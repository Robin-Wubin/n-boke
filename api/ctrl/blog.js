const mongo = require("../../lib/mongo");
const validate = require('koa2-validation');
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
                        let query = ctx.query, page = query.page,NUMBER = 9, selectQuery={};
                        let article = new mongo(ctx.state.mdb, "app.article");
                        selectQuery.state = 1;
                        let totalNum = await article.count(selectQuery);
                        let totalPage = Math.ceil(totalNum/NUMBER);
                        let list = await article.find(selectQuery, {project:{content:0}, skip:(page-1) * NUMBER, limit:NUMBER});
                        ctx.body = await ctx.code('0000', {list, totalPage});
                    } catch (e) {
                        throw e;
                    }
                }]
        },{
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
                        let query = ctx.query, _id = fun.ObjectId(query.id);
                        let article = new mongo(ctx.state.mdb, "app.article");
                        let content = await article.findOne({_id});
                        if(content.password){
                            content.needPassword = true;
                            delete content.password;
                            delete content.content;
                        }
                        ctx.body = await ctx.code('0000', content);
                    } catch (e) {
                        throw e;
                    }
                }]
        },{
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
                        let query = ctx.query, _id = fun.ObjectId(query.id);
                        let body = ctx.request.body;
                        let article = new mongo(ctx.state.mdb, "app.article");
                        let content = await article.findOne({_id});
                        if(!content) return ctx.body = await ctx.code('2004');
                        if(content.password === body.password){
                            delete content.password;
                            ctx.body = await ctx.code('0000', content);
                        } else {
                            ctx.body = await ctx.code('2008');
                        }
                    } catch (e) {
                        throw e;
                    }
                }]
        },{
            type: 'post',
            url: '/api/blog/comment/upload/image',
            name: 'client upload they are ico',
            fun: [
                upload.single('file'),
                async (ctx) => {
                    let file = ctx.req.file;
                    try {
                        console.log(file);
                        return  ctx.body = await ctx.code('0000', file.path.replace("public", ""));
                    } catch (e) {
                        console.error(e);
                        throw e;
                    }
                }
            ]
        },{
            type: 'post',
            url: '/api/blog/comment/new',
            name: 'client post a new comment',
            fun: [
                validate({
                    query: {
                        id: Joi.string().required()
                    },
                    body: {
                        id: Joi.string(),
                        name: Joi.string().required(),
                        email: Joi.string().required(),
                        site: Joi.string(),
                        headImg: Joi.string().required(),
                        comment: Joi.string().required()
                    }
                }),
                async (ctx) => {
                    try {
                        let query = ctx.query, _id = fun.ObjectId(query.id);
                        let body = ctx.request.body;
                        let comment = new mongo(ctx.state.mdb, "app.article.comment");
                        let article = new mongo(ctx.state.mdb, "app.article");
                        let content = await article.findOne({_id});
                        if(!content) return ctx.body = await ctx.code('2004');
                        if(!content.isComment) return ctx.body = await ctx.code('2009');
                        if(body.id){
                            //回复评论

                        } else {
                            //文章评论
                            body.articleId=_id;
                            body.time = new Date();
                            await comment.insert(body);
                            ctx.body = await ctx.code('0000');
                        }
                    } catch (e) {
                        console.error(e);
                        throw e;
                    }
                }
            ]
        },{
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
                        let query = ctx.query, _id = fun.ObjectId(query.id)
                            , selectQuery={articleId:_id}, NUMBER=10;
                        let comment = new mongo(ctx.state.mdb, "app.article.comment");
                        let totalNum = await comment.count(selectQuery);
                        // let totalPage = Math.ceil(totalNum/NUMBER);
                        let list = await comment.find(selectQuery, {skip:(query.page-1) * NUMBER, limit:NUMBER});
                        ctx.body = await ctx.code('0000', {list, totalNum});
                    } catch (e) {
                        console.error(e);
                        throw e;
                    }
                }
            ]
        }
    ]
};