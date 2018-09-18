const mongo = require("../../lib/mongo");
const validate = require('koa2-validation');
const Joi = require('joi');

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
                        ctx.body = await ctx.code('0000', content);
                    } catch (e) {
                        throw e;
                    }
                }]
        }
    ]
};