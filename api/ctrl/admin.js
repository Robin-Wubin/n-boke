const mongo = require("../../lib/mongo");
const {checkAdmin} = require("../mid");
const fs = require('fs');
const validate = require('koa2-validation');
const Joi = require('joi');
const ARTICLE = require("../class/artilce");
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
            type: 'get'
            , url: '/api/admin/info'
            , name: 'get login admin info'
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
            , name: 'admin signout'
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
            , name: 'admin login'
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
            , name: 'admin add type'
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
                        let type = new mongo(ctx.state.mdb, "app.article.type");
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
            , name: 'admin delete type'
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
                        let type = new mongo(ctx.state.mdb, "app.article.type");
                        let typeInfo = await type.findOne({_id:fun.ObjectId(body._id)});
                        if(typeInfo.countNum !== 0) return ctx.body = await ctx.code('2005');
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
            , name: 'admin get type list'
            , fun: [
                async (ctx) => {
                    try {
                        let type = new mongo(ctx.state.mdb, "app.article.type");
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
            , name: 'admin save the article draft'
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
            , name: 'admin get the article draft'
            , fun: [
                checkAdmin,
                async (ctx) => {
                    try {
                        let Article = new ARTICLE(ctx);
                        let query = ctx.request.query;
                        let articleId = ctx.params.id;
                        let draftArticle = new mongo(ctx.state.mdb, "app.article.draft");
                        if(articleId !== "0") articleId = fun.ObjectId(articleId);
                        let articleInfo = await draftArticle.findOne({articleId}, {projection:{articleId:0}});
                        if(!articleInfo){
                            if(articleId!=="0"){
                                articleInfo = await Article.one(articleId, {type:0,projection:{count:0, updateAt:0}});
                                articleInfo.articleId = articleInfo._id;
                                delete articleInfo._id;
                            } else {
                                articleInfo = {
                                    title:"",
                                    type:null,
                                    tags:[],
                                    content:null,
                                    state:null,
                                    articleId: "0",
                                    isComment: true
                                };
                            }
                            let insertData = await draftArticle.insert(articleInfo);
                            articleInfo._id = insertData.ops[0]._id;
                            //删除articleId，防止其返回到前端后随草稿发布到文章中
                            articleInfo.articleId && delete articleInfo.articleId;
                        }
                        if(query.reset === "true"){
                            let tempInfo = await Article.one(articleId, {type:0,projection:{count:0, updateAt:0}});
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
            type: 'get', url: '/api/admin/article/draft/cancel/:id'
            , name: 'admin delete the article draft'
            , fun: [
                checkAdmin,
                async (ctx) => {
                    try {
                        let query = ctx.request.query;
                        console.log(query, query.reset === "true");
                        let articleId = ctx.params.id;
                        let draftArticle = new mongo(ctx.state.mdb, "app.article.draft");
                        if(articleId !== "0") articleId = fun.ObjectId(articleId);
                        await draftArticle.remove({articleId});
                        ctx.body = await ctx.code('0000');
                    } catch (e) {
                        throw e;
                    }
                }]
        },
        {
            type: 'post', url: '/api/admin/article/post/:id'
            , name: 'admin post the article'
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
                        let type = new mongo(ctx.state.mdb, "app.article.type");
                        let article = new mongo(ctx.state.mdb, "app.article");
                        let _id = fun.ObjectId(body._id);
                        delete body._id;
                        body.draftUpdateAt && delete body.draftUpdateAt;
                        body.type = fun.ObjectId(body.type);
                        articleId = articleId!=="0" ? fun.ObjectId(articleId) : articleId;
                        if(articleId!=="0"){
                            //修改
                            let articleInfo = await article.findOne({_id:articleId});
                            if(articleInfo.type.toString() !== body.type.toString()){
                                await type.update({_id:articleInfo.type}, {$inc:{countNum:-1}});
                                await type.update({_id:body.type}, {$inc:{countNum:1}});
                            }
                            articleId = fun.ObjectId(articleId);
                            body.createdAt = new Date(body.createdAt);
                            body.updateAt = new Date();
                            await article.update({_id:articleId}, {$set:body});
                        } else {
                            //新增
                            await type.update({_id:body.type}, {$inc:{countNum:1}});
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
            , name: 'admin get the articles list'
            , fun: [
                checkAdmin,
                validate({
                    query: {
                        page: Joi.number().default(1)
                    }
                }),
                async (ctx) => {
                    try {
                        let Article = new ARTICLE(ctx);
                        let query = ctx.query, page = query.page,NUMBER = 10;
                        let listObj = await Article.list(page, {perPage:NUMBER, projection:{content:0}, query:{}});
                        let totalPage = listObj.totalPage;
                        let list = listObj.list;
                        ctx.body = await ctx.code('0000', {list, totalPage});
                    } catch (e) {
                        throw e;
                    }
                }]
        },
        {
            type: 'post', url: '/api/admin/article/delete'
            , name: 'admin delete the article'
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
                        let comment = new mongo(ctx.state.mdb, "app.article.comment");
                        let type = new mongo(ctx.state.mdb, "app.article.type");
                        let draftArticle = new mongo(ctx.state.mdb, "app.article.draft");
                        let _id = fun.ObjectId(body.id);
                        let articleInfo = await article.findOne({_id});
                        await type.update({_id:articleInfo.type}, {$inc:{countNum:-1}});
                        await article.remove({_id});
                        await draftArticle.remove({articleId: _id});
                        await comment.remove({articleId: _id});
                        ctx.body = await ctx.code('0000');
                    } catch (e) {
                        throw e;
                    }
                }]
        },
        {
            type: 'post',
            url: '/api/admin/article/upload/image',
            name: 'admin upload image',
            fun: [
                checkAdmin,
                upload.single('file'),
                async (ctx) => {
                    let file = ctx.req.file;
                    try {
                        let source = new mongo(ctx.state.mdb, "app.source");
                        let fileObj = {
                            folder:file.destination,
                            filename: file.filename,
                            mimetype: file.mimetype,
                            originalname: file.originalname,
                            size: file.size,
                            type:"image",
                            url: file.path.replace("public", "")
                        };
                        await source.insert(fileObj);
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
        {
            type: 'post',
            url: '/api/admin/article/upload/media',
            name: 'admin upload media',
            fun: [
                checkAdmin,
                upload.single('file'),
                async (ctx) => {
                    let file = ctx.req.file;
                    try {
                        let source = new mongo(ctx.state.mdb, "app.source");
                        let fileObj = {
                            folder:file.destination,
                            filename: file.filename,
                            mimetype: file.mimetype,
                            originalname: file.originalname,
                            size: file.size,
                            type:"media",
                            url: file.path.replace("public", "")
                        };
                        await source.insert(fileObj);
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
        {
            type: 'post',
            url: '/api/admin/article/upload/video',
            name: 'admin upload video',
            fun: [
                checkAdmin,
                upload.single('file'),
                async (ctx) => {
                    let file = ctx.req.file;
                    try {
                        let source = new mongo(ctx.state.mdb, "app.source");
                        let fileObj = {
                            folder:file.destination,
                            filename: file.filename,
                            mimetype: file.mimetype,
                            originalname: file.originalname,
                            size: file.size,
                            type:"video",
                            url: file.path.replace("public", "")
                        };
                        await source.insert(fileObj);
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
        {
            type: 'post',
            url: '/api/admin/source/set',
            name: 'admin set source type',
            fun: [
                checkAdmin,
                validate({
                    body: {
                        _id: Joi.string().required(),
                        type: Joi.string().required()
                    }
                }),
                async (ctx) => {
                    let body = ctx.request.body;
                    try {
                        body._id = fun.ObjectId(body._id);
                        let source = new mongo(ctx.state.mdb, "app.source");
                        let type = new mongo(ctx.state.mdb, "app.source.type");
                        let sourceInfo = await source.findOne({_id:body._id});
                        if(!sourceInfo) return ctx.body = await ctx.code('2007');
                        if(sourceInfo.group && sourceInfo.group.toString() === body.type)  return ctx.body = await ctx.code('0000');
                        body.type = fun.ObjectId(body.type);
                        let typeInfo = await type.findOne({_id:body.type});
                        if(!typeInfo) return ctx.body = await ctx.code('2006');
                        await source.update({_id:body._id}, {$set:{group:body.type}});
                        await type.update({_id:body.type}, {$inc:{countNum:1}});
                        sourceInfo.group && await type.update({_id:sourceInfo.group}, {$inc:{countNum:-1}});
                        ctx.body = await ctx.code('0000');
                    } catch (e) {
                        console.error(e);
                        throw e;
                    } finally {
                        // fs.unlinkSync(file.path);
                    }
                }
            ]
        },
        {
            type: 'post',
            url: '/api/admin/source/delete',
            name: 'admin delete source',
            fun: [
                checkAdmin,
                validate({
                    body: {
                        _id: Joi.string().required()
                    }
                }),
                async (ctx) => {
                    let body = ctx.request.body;
                    try {
                        body._id = fun.ObjectId(body._id);
                        let source = new mongo(ctx.state.mdb, "app.source");
                        let type = new mongo(ctx.state.mdb, "app.source.type");
                        let sourceInfo = await source.findOne({_id:body._id});
                        if(!sourceInfo) return ctx.body = await ctx.code('2007');
                        // fs.unlink()
                        await source.remove({_id:body._id});
                        sourceInfo.group && await type.update({_id:sourceInfo.group}, {$inc:{countNum:-1}});
                        ctx.body = await ctx.code('0000');
                    } catch (e) {
                        console.error(e);
                        throw e;
                    } finally {
                        // fs.unlinkSync(file.path);
                    }
                }
            ]
        },
        {
            type: 'get',
            url: '/api/admin/source/image/:page',
            name: 'admin get image list',
            fun: [
                checkAdmin,
                validate({
                    params: {
                        page: Joi.number().default(1)
                    }
                }),
                async (ctx) => {
                    let body = ctx.params;
                    let query = ctx.query;
                    try {
                        let source = new mongo(ctx.state.mdb, "app.source"),NUMBER = 8, listQuery = {type:"image"};
                        // let totalPage = Math.ceil(totalNum/NUMBER);
                        if(query.type) listQuery.group = fun.ObjectId(query.type);
                        let totalNum = await source.count(listQuery);
                        let list = await source.find(listQuery, {skip:(body.page-1) * NUMBER, limit:NUMBER});
                        ctx.body = await ctx.code('0000', {list, totalNum});
                    } catch (e) {
                        console.error(e);
                        throw e;
                    } finally {
                        // fs.unlinkSync(file.path);
                    }
                }
            ]
        },
        {
            type: 'get',
            url: '/api/admin/source/media/:page',
            name: 'admin get media list',
            fun: [
                checkAdmin,
                validate({
                    params: {
                        page: Joi.number().default(1)
                    }
                }),
                async (ctx) => {
                    let body = ctx.params;
                    let query = ctx.query;
                    try {
                        let source = new mongo(ctx.state.mdb, "app.source"),NUMBER = 10, listQuery = {type:"media"};
                        if(query.type) listQuery.group = fun.ObjectId(query.type);
                        let totalNum = await source.count(listQuery);
                        // let totalPage = Math.ceil(totalNum/NUMBER);
                        let list = await source.find(listQuery, {skip:(body.page-1) * NUMBER, limit:NUMBER});
                        ctx.body = await ctx.code('0000', {list, totalNum});
                    } catch (e) {
                        console.error(e);
                        throw e;
                    } finally {
                        // fs.unlinkSync(file.path);
                    }
                }
            ]
        },
        {
            type: 'get',
            url: '/api/admin/source/video/:page',
            name: 'admin get video list',
            fun: [
                checkAdmin,
                validate({
                    params: {
                        page: Joi.number().default(1)
                    }
                }),
                async (ctx) => {
                    let body = ctx.params;
                    let query = ctx.query;
                    try {
                        let source = new mongo(ctx.state.mdb, "app.source"),NUMBER = 10, listQuery = {type:"video"};
                        if(query.type) listQuery.group = fun.ObjectId(query.type);
                        let totalNum = await source.count(listQuery);
                        // let totalPage = Math.ceil(totalNum/NUMBER);
                        let list = await source.find(listQuery, {skip:(body.page-1) * NUMBER, limit:NUMBER});
                        ctx.body = await ctx.code('0000', {list, totalNum});
                    } catch (e) {
                        console.error(e);
                        throw e;
                    } finally {
                        // fs.unlinkSync(file.path);
                    }
                }
            ]
        },
        {
            type: 'post',
            url: '/api/admin/source/type/new',
            name: 'admin add source type',
            fun: [
                checkAdmin,
                validate({
                    body: {
                        name: Joi.string().required()
                    }
                }),
                async (ctx) => {
                    try {
                        let body = ctx.request.body;
                        let type = new mongo(ctx.state.mdb, "app.source.type");
                        let typeInfo = await type.findOne({name:body.name});
                        if(body._id){
                            if(typeInfo && typeInfo._id.toString() !== body._id) return ctx.body = await ctx.code('2003');
                            await type.update({_id:fun.ObjectId(body._id)}, {$set:{
                                    name:body.name
                                }});
                        } else {
                            if(typeInfo) return ctx.body = await ctx.code('2003');
                            await type.insert({
                                name:body.name,
                                countNum:0
                            })
                        }
                        let list = await type.find();
                        ctx.body = await ctx.code('0000', list);
                    } catch (e) {
                        console.error(e);
                        throw e;
                    } finally {
                        // fs.unlinkSync(file.path);
                    }
                }
            ]
        },
        {
            type: 'get',
            url: '/api/admin/source/type/list',
            name: 'admin get source type list',
            fun: [
                checkAdmin,
                async (ctx) => {
                    try {
                        let type = new mongo(ctx.state.mdb, "app.source.type");
                        let list = await type.find();
                        ctx.body = await ctx.code('0000', list);
                    } catch (e) {
                        console.error(e);
                        throw e;
                    } finally {
                        // fs.unlinkSync(file.path);
                    }
                }
            ]
        },
        {
            type: 'post',
            url: '/api/admin/source/type/delete',
            name: 'admin delete source type',
            fun: [
                checkAdmin,
                validate({
                    body: {
                        _id: Joi.string().required()
                    }
                }),
                async (ctx) => {
                    try {
                        let body = ctx.request.body;
                        let type = new mongo(ctx.state.mdb, "app.source.type");
                        let typeInfo = await type.findOne({_id:fun.ObjectId(body._id)});
                        if(!typeInfo) return ctx.body = await ctx.code('2006');
                        if(typeInfo.countNum !== 0) return ctx.body = await ctx.code('2005');
                        await type.remove({_id:fun.ObjectId(body._id)});
                        let list = await type.find();
                        ctx.body = await ctx.code('0000', list);
                    } catch (e) {
                        console.error(e);
                        throw e;
                    } finally {
                        // fs.unlinkSync(file.path);
                    }
                }
            ]
        },
        {
            type: 'get', url: '/api/admin/comment/list/:id'
            , name: 'admin get the comment list'
            , fun: [
                checkAdmin,
                validate({
                    query: {
                        page: Joi.number().default(1)
                    }
                }),
                async (ctx) => {
                    let body = ctx.params;
                    try {
                        let query = ctx.query, page = query.page,NUMBER = 10;
                        let comment = new mongo(ctx.state.mdb, "app.article.comment");
                        let match = {
                            reply:null
                        };
                        if(body.id!=='0')match.articleId = fun.ObjectId(body.id);
                        let totalNum = await comment.count(match);
                        let totalPage = Math.ceil(totalNum/NUMBER);
                        let list = await comment.aggregate([
                            {
                                $match: match
                            },
                            {
                                $sort: {
                                    time: -1
                                }
                            },
                            {
                                $skip: (page-1) * NUMBER
                            },
                            {
                                $limit: NUMBER
                            }, {
                                $lookup: {
                                    from: "app.article",
                                    localField: "articleId",
                                    foreignField: "_id",
                                    as: "article"
                                }
                            }, {
                                $project: {
                                    headImg: 1,
                                    name: 1,
                                    email: 1,
                                    site: 1,
                                    state: 1,
                                    comment: 1,
                                    topicId: 1,
                                    reply: 1,
                                    articleId: 1,
                                    time: 1,
                                    replyList: 1,
                                    backupCommon: 1,
                                    del:1,
                                    "article.brief": 1,
                                    "article.title": 1,
                                }
                            }]);
                        list = await list.toArray();
                        for(let child of list){
                            if(child.replyList){
                                child.children = await comment.find({_id:{$in:child.replyList}});
                            }
                        }
                        ctx.body = await ctx.code('0000', {list, totalPage});
                    } catch (e) {
                        throw e;
                    }
                }]
        },
        {
            type: 'post', url: '/api/admin/comment/delete'
            , name: 'admin delete the comment'
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
                        let _id=fun.ObjectId(body._id);
                        let comment = new mongo(ctx.state.mdb, "app.article.comment");
                        let article = new mongo(ctx.state.mdb, "app.article");
                        let commentInfo = await comment.findOne({_id});
                        if(!commentInfo) return ctx.body = await ctx.code('2006');
                        if(!commentInfo.del){
                            await comment.update({_id}, {$set:{comment:`<span class="comment-delete">-&nbsp;&nbsp;该评论已被删除&nbsp;&nbsp;-</span>`, del:true, backupCommon: commentInfo.comment}});
                        } else {
                            let i = 1;
                            console.log(_id, commentInfo);
                            await comment.remove({_id});
                            if(commentInfo.topicId) await comment.update({_id:commentInfo.topicId}, {$pull:{replyList:_id}});
                            if(commentInfo.replyList){
                                await comment.remove({_id:{$in:commentInfo.replyList}});
                                i += commentInfo.replyList.length;
                            }
                            console.log(_id, commentInfo);
                            await article.update({_id:commentInfo.articleId}, {$inc:{'count.comment':-i}})
                        }
                        ctx.body = await ctx.code('0000');
                    } catch (e) {
                        throw e;
                    }
                }]
        },
        {
            type: 'get', url: '/api/admin/setting/info'
            , name: 'admin get the setting list'
            , fun: [
                checkAdmin,
                async (ctx) => {
                    try {
                        let setting = new mongo(global.mongoDB, "app.setting");
                        let basic = await setting.findOne({key:"basic"});
                        basic = basic.value;
                        let comment = await setting.findOne({key:"comment"});
                        comment = comment.value;
                        let read = await setting.findOne({key:"read"});
                        read = read.value;
                        ctx.body = await ctx.code('0000', {basic, comment, read});
                    } catch (e) {
                        throw e;
                    }
                }]
        },
        {
            type: 'post', url: '/api/admin/setting/info'
            , name: 'admin save the setting list'
            , fun: [
                checkAdmin,
                validate({
                    body: {
                        basic: {
                            name:Joi.string().required(),
                            desc:Joi.string().required(),
                            keyword:Joi.string().required(),
                        },
                        comment: {
                            dateFormat:Joi.string().required(),
                            list:Joi.number().required(),
                            display:{
                                isIndex: Joi.boolean().required(),
                                isNoFollow: Joi.boolean().required(),
                                pagination:{
                                    is:Joi.boolean().required(),
                                    num:Joi.number().required(),
                                    type:Joi.number().required(),
                                },
                                reply:{
                                    is:Joi.boolean().required(),
                                    num:Joi.number().required(),
                                    type:Joi.number().required(),
                                }
                            },
                            submit:{
                                apply:Joi.boolean().required(),
                                email:Joi.boolean().required(),
                                website:Joi.boolean().required(),
                                checkRefer:Joi.boolean().required(),
                                disable:{
                                    is:Joi.boolean().required(),
                                    day:Joi.number().required()
                                },
                                ipLimited:{
                                    is:Joi.boolean().required(),
                                    min:Joi.number().required()
                                }
                            }
                        },
                        read: {
                            dateFormat:Joi.string().required(),
                            perPage:Joi.number().required(),
                            recommendNum:Joi.number().required(),
                        },
                    }
                }),
                async (ctx) => {
                    try {
                        let body = ctx.request.body;
                        let setting = new mongo(global.mongoDB, "app.setting");
                        await setting.update({key:"basic"}, {$set:{value:body.basic}});
                        await setting.update({key:"comment"}, {$set:{value:body.comment}});
                        await setting.update({key:"read"}, {$set:{value:body.read}});
                        ctx.body = await ctx.code('0000');
                    } catch (e) {
                        throw e;
                    }
                }]
        },
    ]
};