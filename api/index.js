const _ = require('koa-router')();
const fs = require('fs');
const path = require('path');
module.exports = ()=>{
    "use strict";
    let router = [{
        type: 'get', url: /^\/(?!api)/
        , fun: [async (ctx) => {
                await ctx.renderComponents.readyPromise;
                await ctx.renderComponents.render(ctx);
            }]
    }];
    let fileList = fs.readdirSync(__dirname + '/ctrl');
    for(let f of fileList){
        if(f !== "index.js"){
            let tempC = require(path.join(__dirname, '/ctrl/', f));
            if(tempC) router = router.concat(tempC.route);
        }
    }
    for (let c of router){
        _[c.type](c.url, ...c.fun);
    }
    return _;
};