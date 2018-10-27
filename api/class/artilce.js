
const mongo = require("../../lib/mongo");
class artilce{
    constructor(ctx) {
        this.ctx = ctx;
    }
    /**
     * 获取文章列表
     * @param page                  页数
     * @param opt                   配置
     * @param opt.perPage               每页个数
     * @param opt.projection            显示或不显示子元素
     * @param opt.sort                  排序
     * @param opt.query                 筛选
     * @returns {Promise<void>}
     */
    async list (page, opt){
        try{
            let option = Object.assign({
                perPage:10,
                projection: {content:0, password:0},
                sort:{createdAt:-1},
                query:{state:1}
            }, opt);
            let article = new mongo(this.ctx.state.mdb, "app.article");
            let selectQuery=option.query;
            let totalNum = await article.count(selectQuery);
            let totalPage = Math.ceil(totalNum/option.perPage);
            let list = await article.find(selectQuery, {projection:option.projection, skip:(page-1) * option.perPage, limit:option.perPage, sort:option.sort});
            return {list, totalPage, perPage:option.perPage, page};
        }catch (e) {
            throw e;
        }
    }
    /**
     * 最近5篇文章
     * @returns {Promise<void>}
     */
    async recent (){
        try{
            let article = new mongo(this.ctx.state.mdb, "app.article");
            let list = await article.find({state:1}, {projection:{content:0, password:0}, limit:5, sort:{createdAt:-1}});
            return {list};
        }catch (e) {
            throw e;
        }
    }

    /**
     * 获取分类及分类下的最近9篇文章
     */
    async archives (){
        try{
            let type = new mongo(this.ctx.state.mdb, "app.article.type");
            let article = new mongo(this.ctx.state.mdb, "app.article");
            let types = await type.find();
            for(let item of types){
                item.count = await article.count({type: item._id, state:1});
                item.list = await article.find({type: item._id, state:1}, {projection:{content:0, password:0}, limit:8, sort:{createdAt:-1}});
            }
            return types;
        }catch (e) {
            throw e;
        }
    }
    /**
     * 获取文章详情
     * @param id                文章id
     * @param opt               配置
     * @param opt.type              0：后台获取文章，不进行浏览计数，1：前台get文章，判断密码输出，2：前台post文章，验证密码输出
     * @param opt.projection        显示或不显示子元素
     * @param opt.password          文章密码
     * @returns {Promise<*>}
     */
    async one(id, opt){
        try{
            let option = Object.assign({
                type:1,
                projection:{}
            }, opt);
            let _id = fun.ObjectId.isValid(id) && typeof id === "object" ? id : fun.ObjectId(id);
            let article = new mongo(this.ctx.state.mdb, "app.article");
            let content;
            switch(option.type){
                case 0:
                    content = await article.findOne({_id}, {projection:option.projection});
                    if(!content) throw {type:'code', code:'2004'};
                    return content;
                case 1:
                case 2:
                    content = await article.findOneAndUpdate({_id}, {$inc:{"count.view":1}}, {projection:option.projection});
                    console.log(typeof _id, content);
                    if(!content.value) throw {type:'code', code:'2004'};
                    content = content.value;
                    switch(option.type){
                        case 1:
                            if(content.password){
                                content.needPassword = true;
                                delete content.password;
                                delete content.content;
                                await article.update({_id}, {$inc:{"count.view":-1}});
                            }
                            return content;
                        case 2:
                            if(option.password && content.password === option.password){
                                delete content.password;
                                return content;
                            } else {
                                throw {type:'code', code:'2008'};
                            }
                    }
                    break;
            }
        }catch (e) {
            throw e;
        }
    }
}


module.exports = artilce;