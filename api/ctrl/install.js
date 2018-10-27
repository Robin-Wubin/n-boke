const mongo = require("../../lib/mongo");
const validate = require('koa2-validation');
const Joi = require('joi');
const MongoClient = require('mongodb').MongoClient;
const checkMongoConnect = (config, ctx)=>{
    return new Promise((resolve, reject)=>{
        MongoClient.connect(`mongodb://${config.username}:${config.password}@${config.url}/${config.db}`, {
            poolSize: 5,
            autoReconnect: true
        }, function(err, vcDb) {
            if(err) return resolve(false);
            global.mongoDB = vcDb.db(config.db);
            ctx.state.mdb = global.mongoDB;
            resolve(true);
        });
    })
};
module.exports = {
    auth:"install",
    desc:"init the blog app",
    route: [
        {
            type: 'post', url: '/api/install/mongodb'
            , fun: [
                validate({
                    body: {
                        username: Joi.string().required(),
                        password: Joi.string().required(),
                        url: Joi.string().required(),
                        db: Joi.string().required()
                    }
                }),
                async (ctx) => {
                    try {
                        console.log(ctx.request.body);
                        let body = ctx.request.body;
                        let checkRes = await checkMongoConnect(body, ctx);
                        if(!checkRes){
                            ctx.body = await ctx.code('1001');
                        } else {
                            global.appConfig.db = body;
                            let setting = new mongo(global.mongoDB, "app.setting");
                            //初始化app
                            let basic = {
                                name: "N-Boke",
                                host: null,
                                desc:"Easy | Simply | Open Source | Server Side Render",
                                keyword:"Easy,Simply,Open Source,Server Side Render"
                            };
                            let commentSetting = {
                                dateFormat: "YMDHMS",
                                list:10,
                                display:{
                                    isIndex:true,
                                    isNoFollow:true,
                                    pagination:{
                                        is:true,
                                        num:10,
                                        type:0              //0：最新一页， 1：最后一页
                                    },
                                    reply:{
                                        is:true,
                                        num:5,
                                        type:0              //0：最近的， 1：较早的
                                    }
                                },
                                submit:{
                                    apply:false,
                                    email:true,
                                    website:false,
                                    checkRefer:true,
                                    disable:{
                                        is:true,
                                        day:30
                                    },
                                    ipLimited:{
                                        is:true,
                                        min:1
                                    }
                                }
                            };
                            let readSetting = {
                                dateFormat: "YMDHMS",
                                perPage: 10,
                                recommendNum: 8
                            };
                            let userInfo = {
                                nickname: "boke",
                                brief: "...",
                                motto: "...",
                                ico: "/avatar.png"
                            };
                            await setting.insertMany([
                                {type:"setting", key:"basic", value:basic},
                                {type:"setting", key:"comment", value:commentSetting},
                                {type:"setting", key:"read", value:readSetting},
                                {type:"setting", key:"userInfo", value:userInfo},
                            ]);
                            ctx.body = await ctx.code('0000');
                        }
                    } catch (e) {
                        throw e;
                    }
                }]
        },
        {
            type: 'post', url: '/api/install/admin'
            , fun: [
                validate({
                    body: {
                        name: Joi.string().required(),
                        password: Joi.string().required(),
                        confirm_password: Joi.string().required()
                    }
                }),
                async (ctx) => {
                    try {
                        if(!ctx.state.mdb) return ctx.body = await ctx.code('1001');
                        let body = ctx.request.body, password;
                        let admin = new mongo(ctx.state.mdb, "account.admin");
                        if(body.password === body.confirm_password) password = global.fun.encord2md5(body.password);
                        await admin.update({name:body.name}, {$set:{password}});
                        ctx.body = await ctx.code('0000');

                    } catch (e) {
                        throw e;
                    }
                }]
        }
    ]
};