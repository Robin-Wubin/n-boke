const mongo = require("../../lib/mongo");
const validate = require('koa2-validation');
const ARTICLE = require("../class/artilce");
const COMMENT = require("../class/comment");
const Joi = require('joi');
//文件上传
const multer = require('koa-multer');
//配置
const storage = multer.diskStorage({
    //文件保存路径
    destination: function(req, file, cb) {
        cb(null, './public/upload/ico/')
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
    auth:"blog",
    route: [
        {
            type: 'get'
            , url: '/api/blog/list'
            , name: 'get blog list'
            , fun: [
                validate({
                    query: {
                        page: Joi.number().default(1)
                    }
                }),
                async (ctx) => {
                    try {
                        console.log("get blog list", ctx.query.page);
                        let setting = new mongo(global.mongoDB, "app.setting");
                        let read = await setting.findOne({key:"read"});
                        let query = ctx.query, page = query.page;
                        let Article = new ARTICLE(ctx);
                        ctx.body = await Article.list(page, {perPage: read.value.perPage});
                    } catch (e) {
                        throw e;
                    }
                }]
        },
        {
            type: 'get'
            , url: '/api/blog/recent'
            , name: 'get blog recent'
            , fun: [
                async (ctx) => {
                    try {
                        let Article = new ARTICLE(ctx);
                        ctx.body = await ctx.code("0000", await Article.recent());
                    } catch (e) {
                        throw e;
                    }
                }]
        }
        ,{
            type: 'get'
            , url: '/api/blog/content'
            , name: 'get blog content'
            , fun: [
                validate({
                    query: {
                        id: Joi.string().required()
                    }
                }),
                async (ctx) => {
                    try {
                        console.log("get blog content", ctx.query.id);
                        let query = ctx.query, _id = fun.ObjectId(query.id);
                        let Article = new ARTICLE(ctx);
                        let content = await Article.one(query.id, {type:1});
                        ctx.body = await ctx.code('0000', content);
                    } catch (e) {
                        if(e.type === 'code') return ctx.body = await ctx.code(e.code);
                        throw e;
                    }
                }]
        }
        ,{
            type: 'post'
            , url: '/api/blog/content'
            , name: 'get blog content'
            , fun: [
                validate({
                    query: {
                        id: Joi.string().required()
                    },
                    body: {
                        password: Joi.string().required()
                    }
                }),
                async (ctx) => {
                    try {
                        let query = ctx.query;
                        let body = ctx.request.body;
                        let Article = new ARTICLE(ctx);
                        let content = await Article.one(query.id, {type:2, password:body.password});
                        ctx.body = await ctx.code('0000', content);
                    } catch (e) {
                        if(e.type === 'code') return ctx.body = await ctx.code(e.code);
                        throw e;
                    }
                }]
        }
        ,{
            type: 'post',
            url: '/api/blog/comment/upload/image',
            name: 'client upload they are ico',
            fun: [
                upload.single('file'),
                async (ctx) => {
                    let file = ctx.req.file;
                    try {
                        return  ctx.body = await ctx.code('0000', file.path.replace("public", ""));
                    } catch (e) {
                        console.error(e);
                        throw e;
                    }
                }
            ]
        }
        ,{
            type: 'post',
            url: '/api/blog/comment/new',
            name: 'client post a new comment',
            fun: [
                validate({
                    query: {
                        id: Joi.string().required()
                    },
                    body: {
                        reply: Joi.object(),
                        name: Joi.string().required(),
                        email: Joi.string(),
                        site: Joi.string(),
                        headImg: Joi.string(),
                        comment: Joi.string().required()
                    }
                }),
                async (ctx) => {
                    try {
                        let query = ctx.query, _id = fun.ObjectId(query.id);
                        let Article = new ARTICLE(ctx);
                        let Comment = new COMMENT(ctx);
                        let hasArticle = await Article.one(query.id, {type:0});
                        if(!hasArticle.isComment) return ctx.body = await ctx.code('2009');
                        let body = ctx.request.body;
                        let setting = new mongo(global.mongoDB, "app.setting");
                        let comment = await setting.findOne({key:"comment"});
                        let option = Object.assign({
                            reply: typeof hasArticle.isComment === "boolean" ? hasArticle.isComment : comment.value.display.reply.is,
                            num:comment.value.display.reply.num
                        }, comment.value.submit);
                        await Comment.add(query.id, body, option, hasArticle);
                        return  ctx.body = await ctx.code('0000');
                    } catch (e) {
                        if(e.type === 'code') return ctx.body = await ctx.code(e.code);
                        throw e;
                    }
                }
            ]
        },{
            type: 'get',
            url: '/api/blog/comment/recent',
            name: 'client get recent comment',
            fun: [
                async (ctx) => {
                    try {
                        let Comment = new COMMENT(ctx);
                        let commentObj = await Comment.recent();
                        ctx.body = await ctx.code('0000', commentObj);
                    } catch (e) {
                        if(e.type === 'code') return ctx.body = await ctx.code(e.code);
                        throw e;
                    }
                }
            ]
        }
        ,{
            type: 'get',
            url: '/api/blog/comment/list',
            name: 'client get comment list',
            fun: [
                validate({
                    query: {
                        id: Joi.string().required(),
                        page: Joi.number().default(1),
                    }
                }),
                async (ctx) => {
                    try {
                        let setting = new mongo(global.mongoDB, "app.setting");
                        let comment = await setting.findOne({key:"comment"});
                        let Comment = new COMMENT(ctx);
                        let query = ctx.query;
                        let dsPag = comment.value.display.pagination;
                        let reply = comment.value.display.reply;
                        let sort = dsPag.type === 0 ? {time:-1} : {time:1};
                        let childSort = reply.type === 0 ? {time:-1} : {time:1};
                        let commentObj = await Comment.list(query.id, query.page, {pagination:dsPag.is, reply:reply.is, perPage:dsPag.num, sort, childSort});
                        ctx.body = await ctx.code('0000', commentObj);
                    } catch (e) {
                        if(e.type === 'code') return ctx.body = await ctx.code(e.code);
                        throw e;
                    }
                }
            ]
        },{
            type: 'get',
            url: '/api/blog/user/info',
            name: 'client get user info',
            fun: [
                async (ctx) => {
                    try {
                        let setting = new mongo(global.mongoDB, "app.setting");
                        let userInfo = await setting.findOne({key:"userInfo"});
                        userInfo = userInfo ? userInfo.value : {social:{}};
                        console.log(userInfo);
                        ctx.body = await ctx.code('0000', userInfo);
                    } catch (e) {
                        if(e.type === 'code') return ctx.body = await ctx.code(e.code);
                        throw e;
                    }
                }
            ]
        }
    ]
};