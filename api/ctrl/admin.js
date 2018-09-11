const mongo = require("../../lib/mongo");
const {checkAdmin} = require("../mid");
const validate = require('koa2-validation');
const Joi = require('joi');
module.exports = {
    auth:"admin",
    route: [
        {
            type: 'get', url: '/api/admin/info'
            , fun: [
                checkAdmin,
                async (ctx) => {
                    try {
                        ctx.body = await ctx.code('0000', ctx.session.adminInfo);
                    } catch (e) {
                        throw e;
                    }
                }]
        },
        {
            type: 'get', url: '/api/admin/signout'
            , fun: [
                checkAdmin,
                async (ctx) => {
                    try {
                        ctx.session.adminInfo = null;
                        ctx.body = await ctx.code('0000');
                    } catch (e) {
                        throw e;
                    }
                }]
        },
        {
            type: 'post', url: '/api/admin/login'
            , fun: [
                validate({
                    body: {
                        name: Joi.string().required(),
                        password: Joi.string().required()
                    }
                }),
                async (ctx) => {
                    try {
                        let body = ctx.request.body;
                        let admin = new mongo(ctx.state.mdb, "account.admin");
                        let userInfo = await admin.findOne({name:body.name});
                        if(!userInfo) return ctx.body = await ctx.code('2001');
                        if(!fun.checkPassword(body.password, userInfo.password)) return ctx.body = await ctx.code('2001');
                        delete userInfo.password;
                        ctx.session.adminInfo = userInfo;
                        ctx.body = await ctx.code('0000');
                    } catch (e) {
                        throw e;
                    }
                }]
        },
        {
            type: 'post', url: '/api/admin/type/new'
            , fun: [
                checkAdmin,
                validate({
                    body: {
                        name: Joi.string().required(),
                        alisa: Joi.string().required(),
                        _id: Joi.string()
                    }
                }),
                async (ctx) => {
                    try {
                        let body = ctx.request.body;
                        let type = new mongo(ctx.state.mdb, "admin.type");
                        let typeInfo = await type.findOne({name:body.name});
                        let alisaInfo = await type.findOne({alisa:body.alisa});
                        if(body._id){
                            if(typeInfo && typeInfo._id.toString() !== body._id) return ctx.body = await ctx.code('2003');
                            if(alisaInfo && alisaInfo._id.toString() !== body._id) return ctx.body = await ctx.code('2003');
                            console.log(body);
                            await type.update({_id:fun.ObjectId(body._id)}, {$set:{
                                    name:body.name,
                                    alisa:body.alisa
                                }});
                        } else {
                            if(typeInfo) return ctx.body = await ctx.code('2003');
                            if(alisaInfo) return ctx.body = await ctx.code('2003');
                            await type.insert({
                                name:body.name,
                                alisa:body.alisa,
                                countNum:0
                            })
                        }
                        let list = await type.find(), typeList = [{ value: null, text: '请选择一个类别' }];
                        for(let item of list){
                            typeList.push({value:item._id.toString(), text:item.name, alisa:item.alisa, countNum:item.countNum})
                        }
                        ctx.body = await ctx.code('0000', typeList);
                    } catch (e) {
                        throw e;
                    }
                }]
        },
        {
            type: 'post', url: '/api/admin/type/delete'
            , fun: [
                checkAdmin,
                validate({
                    body: {
                        _id: Joi.string().required()
                    }
                }),
                async (ctx) => {
                    try {
                        let body = ctx.request.body;
                        let type = new mongo(ctx.state.mdb, "admin.type");
                        await type.remove({_id:fun.ObjectId(body._id)});
                        let list = await type.find(), typeList = [{ value: null, text: '请选择一个类别' }];
                        for(let item of list){
                            typeList.push({value:item._id.toString(), text:item.name, alisa:item.alisa, countNum:item.countNum})
                        }
                        ctx.body = await ctx.code('0000', typeList);
                    } catch (e) {
                        throw e;
                    }
                }]
        },
        {
            type: 'get', url: '/api/admin/type/list'
            , fun: [
                async (ctx) => {
                    try {
                        let type = new mongo(ctx.state.mdb, "admin.type");
                        let list = await type.find(), typeList = [{ value: null, text: '请选择一个类别' }];
                        for(let item of list){
                            typeList.push({value:item._id.toString(), text:item.name, alisa:item.alisa, countNum:item.countNum})
                        }
                        ctx.body = await ctx.code('0000', typeList);
                    } catch (e) {
                        throw e;
                    }
                }]
        }
    ]
};