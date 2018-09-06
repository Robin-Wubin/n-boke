const _ = require('koa-router')();
const fs = require('fs');
const path = require('path');
module.exports = ()=>{
    "use strict";
    let router = [];
    let fileList = fs.readdirSync(__dirname + '/ctrl');
    for(let f of fileList){
            let tempC = require(path.join(__dirname, '/ctrl/', f));
            if(tempC) router = router.concat(tempC.route);
    }
    router = router.concat([{
        type: 'get', url: /^\/(?!api)/
        , fun: [async (ctx) => {
            let sid = ctx.cookies.get("sid");
            await ctx.renderComponents.readyPromise;
            await ctx.renderComponents.render(ctx, {sid});
        }]
    }]);
    for (let c of router){
        _[c.type](c.url, ...c.fun);
    }
    return _;
};