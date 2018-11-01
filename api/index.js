const _ = require('koa-router')();
const fs = require('fs');
const mongo = require("../lib/mongo");
const ARTICLE = require("./class/artilce");
const path = require('path');
const mid = require("./mid");
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
        , fun: [
            mid.pvuv,
            async (ctx) => {
            try{
                let sid = ctx.cookies.get("sid");
                let opt = {sid};
                let articleRegular = /^\/article\/([0-9a-zA-Z]+)/;
                let listRegular = /^\/page\/([0-9]+)/;
                let installRegular = /^\/install/;
                opt.title = "准备安装 N-Boke";
                opt.desc = "A New Blog App Development with KOA and VUE.JS";
                opt.keyword = "";
                if(!installRegular.test(ctx.url)){
                    let setting = new mongo(global.mongoDB, "app.setting");
                    let basic = await setting.findOne({key:"basic"});
                    let read = await setting.findOne({key:"read"});
                    let comment = await setting.findOne({key:"comment"});
                    basic = basic.value;
                    read = read.value;
                    comment = comment.value;
                    opt.title = basic.name;
                    opt.desc = basic.desc;
                    opt.keyword = basic.keyword;
                    let Article = new ARTICLE(ctx);
                    if(articleRegular.test(ctx.url)){
                        //文章
                        let urlArr = ctx.url.match(articleRegular);
                        let articleInfo = await Article.one(urlArr[1], {type:1});
                        opt.title = articleInfo.title + " - " + basic.name;
                        opt.desc = articleInfo.brief.replace(/[\n|\s]/g,"");
                        opt.article = articleInfo;
                    } else if (ctx.url === "/" || listRegular.test(ctx.url)){
                        //列表页
                        let urlArr = ctx.url.match(listRegular);
                        let page = urlArr ? urlArr[1] : 1;
                        opt.blogList = await Article.list(page, {perPage: read.perPage});
                    } else {
                        console.log(ctx.url);
                    }
                    opt.setting = {basic, read, comment};
                }
                console.log("readyPromise", ctx.renderComponents.readyPromise);
                let readyPromise = await ctx.renderComponents.readyPromise;
                console.log("readyPromise", readyPromise);
                await ctx.renderComponents.render(ctx, opt);
            }catch (e) {
                if(e.type === 'code') return ctx.body = await ctx.code(e.code);
                throw e;
            }
        }]
    }]);
    for (let c of router){
        _[c.type](c.url, ...c.fun);
    }
    return _;
};