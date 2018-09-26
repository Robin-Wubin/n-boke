
const mongo = require("../../lib/mongo");
class artilce{
    constructor(ctx) {
        this.ctx = ctx;
    }

    /**
     * 获取文章列表
     * @param page  页数
     * @param opt   perPage         每页个数
     *               projection      显示或不显示子元素
     *               sort            排序
     * @returns {Promise<void>}
     */
    async list (page, opt){
        try{
            let option = Object.assign({
                perPage:10,
                projection: {content:0, password:0},
                sort:{createdAt:-1}
            }, opt);
            let article = new mongo(this.ctx.state.mdb, "app.article");
            let selectQuery={};
            selectQuery.state = 1;
            let totalNum = await article.count(selectQuery);
            let totalPage = Math.ceil(totalNum/option.perPage);
            let list = await article.find(selectQuery, {projection:option.projection, skip:(page-1) * option.perPage, limit:option.perPage, sort:option.sort});
            return {list, totalPage, perPage:option.perPage, page};
        }catch (e) {
            throw e;
        }
    }
}


module.exports = artilce;