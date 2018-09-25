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
            let articleRegular = /^\/article\/([0-9a-zA-Z]+)/;
            let listRegular = /^\/page\/([0-9]+)/;
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
            let article = new mongo(ctx.state.mdb, "app.article");
            if(articleRegular.test(ctx.url)){
                //文章
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
                opt.title = articleInfo.title + " - " + basic.name;
                opt.desc = articleInfo.brief.replace(/[\n|\s]/g,"");
                opt.article = articleInfo;
            } else if (ctx.url === "/" || listRegular.test(ctx.url)){
                //列表页
                let urlArr = ctx.url.match(listRegular);
                let page = urlArr ? urlArr[1] : 1;
                let selectQuery={};
                selectQuery.state = 1;
                let totalNum = await article.count(selectQuery);
                let totalPage = Math.ceil(totalNum/read.perPage);
                let list = await article.find(selectQuery, {projection:{content:0, password:0}, skip:(page-1) * read.perPage, limit:read.perPage, sort:{createdAt:-1}});
                opt.blogList = {list, totalPage, perPage:read.perPage, page};
            } else {
                console.log(ctx.url);
            }
            opt.setting = {basic, read, comment};
            await ctx.renderComponents.readyPromise;
            await ctx.renderComponents.render(ctx, opt);
        }]
    }]);
    for (let c of router){
        _[c.type](c.url, ...c.fun);
    }
    return _;
};