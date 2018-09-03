const _ = require('koa-router')();
_.get(/^\/(?!api)/,async (ctx) => {
    await ctx.renderComponents.readyPromise;
    await ctx.renderComponents.render(ctx);
});
module.exports = ()=>{
    "use strict";
    return _;
};