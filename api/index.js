const _ = require('koa-router')();
const fs = require('fs');
const mongo = require("../lib/mongo");
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
            let opt = {sid};
            let articleRegular = /\/article\/([0-9a-zA-Z]+)/;
            let setting = new mongo(global.mongoDB, "app.setting");
            let basic = await setting.findOne({key:"basic"});
            opt.title = basic.value.name;
            opt.desc = basic.value.desc;
            opt.keyword = basic.value.keyword;
            if(articleRegular.test(ctx.url)){
                let article = new mongo(ctx.state.mdb, "app.article");
                let urlArr = ctx.url.match(articleRegular);
                let _id = fun.ObjectId(urlArr[1]);
                let articleInfo = await article.findOne({_id});
                if(articleInfo.password){
                    articleInfo.needPassword = true;
                    delete articleInfo.password;
                    delete articleInfo.content;
                } else {
                    await article.update({_id}, {$inc:{"count.view":1}});
                }
                opt.title = articleInfo.title + " - " + basic.value.name;
                opt.desc = articleInfo.brief.replace(/[\n|\s]/g,"");
                opt.article = articleInfo;
            }
            await ctx.renderComponents.readyPromise;
            await ctx.renderComponents.render(ctx, opt);
        }]
    }]);
    for (let c of router){
        _[c.type](c.url, ...c.fun);
    }
    return _;
};