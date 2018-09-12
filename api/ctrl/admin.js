const mongo = require("../../lib/mongo");
const {checkAdmin} = require("../mid");
const fs = require('fs');
const validate = require('koa2-validation');
const Joi = require('joi');
//文件上传
const multer = require('koa-multer');
//配置
const storage = multer.diskStorage({
    //文件保存路径
    destination: function(req, file, cb) {
        cb(null, './public/upload/img/')
    },
    filename: function(req, file, cb) {
        let fileFormat = (file.originalname).split(".");
        cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});
const upload = multer({
    storage: storage
});

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
        },
        {
            type: 'post', url: '/api/admin/article/draft/:id'
            , fun: [
                checkAdmin,
                validate({
                    body: {
                        _id: Joi.string().required()
                    }
                }),
                async (ctx) => {
                    try {
                        let articleId = ctx.params.id;
                        let body = ctx.request.body;
                        let draftArticle = new mongo(ctx.state.mdb, "app.article.draft");
                        let _id = fun.ObjectId(body._id), query = {_id};
                        delete body._id;
                        query.articleId= articleId!=="0" ? fun.ObjectId(articleId) : articleId;
                        body.draftUpdateAt = new Date();
                        await draftArticle.update(query, {$set:body});
                        ctx.body = await ctx.code('0000');
                    } catch (e) {
                        throw e;
                    }
                }]
        },
        {
            type: 'get', url: '/api/admin/article/draft/:id'
            , fun: [
                checkAdmin,
                async (ctx) => {
                    try {
                        let query = ctx.request.query;
                        console.log(query, query.reset === "true");
                        let articleId = ctx.params.id;
                        let article = new mongo(ctx.state.mdb, "app.article");
                        let draftArticle = new mongo(ctx.state.mdb, "app.article.draft");
                        if(articleId !== "0") articleId = fun.ObjectId(articleId);
                        let articleInfo = await draftArticle.findOne({articleId}, {fields:{articleId:0}});
                        if(!articleInfo){
                            if(articleId!=="0"){
                                articleInfo = await article.findOne({_id:articleId}, {fields:{count:0, updateAt:0}});
                                if(!articleInfo) return ctx.body = await ctx.code('2004');
                                articleInfo.articleId = articleInfo._id;
                                delete articleInfo._id;
                            } else {
                                articleInfo = {
                                    title:"",
                                    type:null,
                                    tags:[],
                                    content:null,
                                    state:null,
                                    articleId: "0"
                                };
                            }
                            console.log(articleInfo);
                            let insertData = await draftArticle.insert(articleInfo);
                            articleInfo._id = insertData.ops[0]._id;
                            articleInfo.articleId && delete articleInfo.articleId;
                        }
                        if(query.reset === "true"){
                            let tempInfo = await article.findOne({_id:articleId}, {fields:{count:0, updateAt:0}});
                            tempInfo._id = articleInfo._id;
                            articleInfo = tempInfo;
                        }
                        ctx.body = await ctx.code('0000', articleInfo);
                    } catch (e) {
                        throw e;
                    }
                }]
        },
        {
            type: 'post', url: '/api/admin/article/post/:id'
            , fun: [
                checkAdmin,
                validate({
                    body: {
                        _id: Joi.string().required()
                    }
                }),
                async (ctx) => {
                    try {
                        let articleId = ctx.params.id;
                        let body = ctx.request.body;
                        let draftArticle = new mongo(ctx.state.mdb, "app.article.draft");
                        let article = new mongo(ctx.state.mdb, "app.article");
                        let _id = fun.ObjectId(body._id);
                        delete body._id;
                        body.draftUpdateAt && delete body.draftUpdateAt;
                        body.type = fun.ObjectId(body.type);
                        articleId = articleId!=="0" ? fun.ObjectId(articleId) : articleId;
                        if(articleId!=="0"){
                            articleId = fun.ObjectId(articleId);
                            body.updateAt = new Date();
                            await article.update({_id:articleId}, {$set:body});
                        } else {
                            body.createdAt = new Date();
                            body.count = {view:0,comment:0};
                            await article.insert(body);
                        }
                        await draftArticle.remove({_id});
                        ctx.body = await ctx.code('0000');
                    } catch (e) {
                        throw e;
                    }
                }]
        },
        {
            type: 'get', url: '/api/admin/article/list'
            , fun: [
                checkAdmin,
                validate({
                    query: {
                        page: Joi.number().default(1)
                    }
                }),
                async (ctx) => {
                    try {
                        let query = ctx.query, page = query.page,NUMBER = 10;
                        let article = new mongo(ctx.state.mdb, "app.article");
                        let totalNum = await article.count({});
                        let totalPage = Math.ceil(totalNum/NUMBER);
                        let list = await article.find({}, {project:{content:0}, skip:(page-1) * NUMBER, limit:NUMBER});
                        ctx.body = await ctx.code('0000', {list, totalPage});
                    } catch (e) {
                        throw e;
                    }
                }]
        },
        {
            type: 'post', url: '/api/admin/article/delete'
            , fun: [
                checkAdmin,
                validate({
                    body: {
                        id: Joi.string().required()
                    }
                }),
                async (ctx) => {
                    try {
                        let body = ctx.request.body;
                        let article = new mongo(ctx.state.mdb, "app.article");
                        let draftArticle = new mongo(ctx.state.mdb, "app.article.draft");
                        let _id = fun.ObjectId(body.id);
                        await article.remove({_id});
                        await draftArticle.remove({articleId: _id});
                        ctx.body = await ctx.code('0000');
                    } catch (e) {
                        throw e;
                    }
                }]
        },
        {
            type: 'post',
            url: '/api/admin/article/upload',
            fun: [
                checkAdmin,
                upload.single('file'),
                async (ctx) => {
                    let body = ctx.req.body;
                    let file = ctx.req.file;
                    try {
                        console.log(body, file);
                        // let objectKey = `/report/${body.type}/${new Date().getTime()}/${file.filename}`;
                        // await fun.oss.put(objectKey, file.path);
                        // let url = "https://cdn.das.vcsaas.cn" + objectKey;
                        // console.log(url);
                        return  ctx.body = await ctx.code('0000', file.path.replace("public", ""));
                    } catch (e) {
                        console.error(e);
                        throw e;
                    } finally {
                        // fs.unlinkSync(file.path);
                    }
                }
            ]
        },
    ]
};