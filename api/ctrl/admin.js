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
        }
    ]
};