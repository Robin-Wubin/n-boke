const mongo = require("../../lib/mongo");
module.exports = class {
    constructor(ctx) {
        this.ctx = ctx;
    }

    /**
     * 获取评论列表
     * @param ArticleId             文章id
     * @param page                  页数
     * @param opt                   配置
     * @param opt.pagination            是否分页
     * @param opt.perPage               每页数量
     * @param opt.sort                  排序
     * @param opt.reply                 是否显示回复
     * @param opt.childSort             回复排序
     * @param opt.projection            过滤元素
     * @param opt.query                 筛选
     *
     * @returns {Promise<void>}
     */
    async list(ArticleId, page, opt){
        try{
            let option = Object.assign({
                pagination: true,
                reply: true,
                perPage:10,
                sort:{time:-1},
                childSort:{time:-1},
                projection: {backupCommon:0},
                query:{reply:null}
            }, opt);
            option.query.articleId = fun.ObjectId.isValid(ArticleId) && typeof ArticleId === "object" ? ArticleId : fun.ObjectId(ArticleId);
            let comment = new mongo(this.ctx.state.mdb, "app.article.comment");
            let totalNum = await comment.count(option.query);
            let promise;
            if(option.pagination){
                promise = comment.find(option.query, {skip:(page-1) * option.perPage, limit:option.perPage, sort:option.sort, projection:option.projection})
            } else {
                promise = comment.find(option.query, {sort:option.sort, projection:option.projection})
            }
            let list = await promise;
            if(option.reply){
                for(let child of list){
                    if(child.replyList){
                        child.children = await comment.find({_id:{$in:child.replyList}}, {projection:option.projection, sort:option.childSort});
                        for(let msg of child.children){
                            if(msg.state === 0) delete msg.comment;
                        }
                    }
                }
            }
            for(let msg of list){
                if(msg.state === 0) delete msg.comment;
            }
            return {list, totalNum};
        }catch (e) {
            throw e;
        }
    }

    /**
     * 新增评论
     * @param ArticleId             文章ID
     * @param commentObj            评论结构
     * @param opt
     * @param opt.reply             是否允许回复
     * @param opt.num               允许回复的最大层数
     * @param opt.apply             评论需要经过审核
     * @param opt.email             必须填写邮箱
     * @param opt.website           必须填写网址
     * @param opt.checkRefer        检查评论来源页
     * @param opt.disable           限定时间关闭评论
     * @param opt.disable.is        是否开启
     * @param opt.disable.day       限定天数
     * @param opt.ipLimited         限定IP评论间隔
     * @param opt.ipLimited.is      是否限定
     * @param opt.ipLimited.min     评论间隔
     * @param article               文章
     * @returns {Promise<null>}
     */
    async add(ArticleId, commentObj, opt, articleContent){
        try{
            let option = Object.assign({
                reply: true,
                num: 5,
                apply: true,
                email: true,
                website:false,
                refer: true,
                disable: null,
                ipLimited: null,
            }, opt);
            if(option.reply){
                let sid = this.ctx.cookies.get('sid');
                if(!sid) throw {type:'code', code:'2014'};
                if(option.email && !commentObj.email) throw {type:'code', code:'2012'};
                if(option.website && !commentObj.site) throw {type:'code', code:'2013'};
                let regular = new RegExp("article/"+ArticleId);
                if(option.checkRefer && !this.ctx.headers.referer.match(regular)) throw {type:'code', code:'2014'};
                if(option.disable && option.disable.is){
                    let expireTime = articleContent.createdAt.getTime() + option.disable.day * 24 * 60 * 60 * 1000;
                    if(new Date().getTime() >= expireTime) throw {type:'code', code:'2014'};
                }
                let commentLimited = new mongo(this.ctx.state.mdb, "app.article.comment.limited");
                if(option.ipLimited && option.ipLimited.is){
                    let limited = await commentLimited.findOne({sid});
                    if(limited && limited.time.getTime() + option.ipLimited.min * 60 * 1000 >= new Date().getTime()) throw {type:'code', code:'2015'};
                }
                commentObj.state = option.apply ? 0 : 1;
                commentObj.comment = commentObj.comment.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, ' ');
                let articleId = fun.ObjectId.isValid(ArticleId) && typeof ArticleId === "object" ? ArticleId : fun.ObjectId(ArticleId);
                let comment = new mongo(this.ctx.state.mdb, "app.article.comment");
                let article = new mongo(this.ctx.state.mdb, "app.article");
                if(commentObj.reply){
                    //回复评论,
                    let topicId = commentObj.reply.topicId ? commentObj.reply.topicId : commentObj.reply._id;
                    commentObj.topicId = fun.ObjectId(topicId);
                    let parentNode = await comment.findOne({_id:commentObj.topicId});
                    if(!parentNode) throw {type:'code', code:'2010'};
                    if(parentNode.replyList && parentNode.replyList.length >= option.num) throw {type:'code', code:'2011'};
                    let reply = {};
                    reply.toId = fun.ObjectId(commentObj.reply._id);
                    reply.toName = commentObj.reply.name;
                    delete commentObj.reply;
                    commentObj.reply = reply;
                    commentObj.articleId=articleId;
                    commentObj.time = new Date();
                    let newComment = await comment.insert(commentObj);
                    await comment.update({_id:commentObj.topicId}, {$push:{replyList:newComment.ops[0]._id}});
                } else {
                    //文章评论
                    commentObj.articleId=articleId;
                    commentObj.time = new Date();
                    await comment.insert(commentObj);
                }
                await article.update({_id:articleId}, {$inc:{"count.comment":1}});
                await commentLimited.update({sid}, {$set:{time:new Date()}});
                return null;
            } else {
                throw {type:'code', code:'2009'};
            }
        }catch (e) {
            throw e
        }
    }
};