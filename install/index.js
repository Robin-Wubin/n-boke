const _ = require('koa-router')();

_.get('/' , async (ctx) => {

    // 第 1 步：创建一个 Vue 实例
    const Vue = require('vue');
    const app = new Vue({
        data: {
            url: ctx.path
        },
        template: `<div>访问的 URL 是： {{ url }}</div>`
    });

    // 在 2.5.0+，如果没有传入回调函数，则会返回 Promise：
    ctx.body = await ctx.render.renderToString(app);
});

module.exports = () => {
    "use strict";
    return _;
};