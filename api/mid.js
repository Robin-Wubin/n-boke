const mongo = require("../lib/mongo");

module.exports.checkAdmin = async(ctx, next)=>{
    try{
        if(ctx.session.adminInfo) return await next();
        return ctx.body = await ctx.code('2002');
    }catch (e) {
        throw e
    }
};
module.exports.pvuv = async(ctx, next)=>{
    try{
        if(ctx.session.adminInfo) return await next();
        let sid = ctx.cookies.get("sid");
        let matchUtl = /\.[a-zA-Z0-9]{1,4}$/;
        let matchInstall = /^\/install/;
        if(!matchUtl.test(ctx.url) && !matchInstall.test(ctx.url)){
            //非资源请求
            let date = new Date().setHours(0,0,0,0);
            let $inc = {}, $push = {}, updateData;
            let dailyData = new mongo(ctx.state.mdb, "app.data.daily");
            let isNewUv = await dailyData.findOne({date, sids: sid});
            if(!isNewUv){
                $push.sids = sid;
                $inc.uv = 1;
                $inc.pv = 1;
                updateData = {$inc, $push};
            } else {
                $inc.pv = 1;
                updateData = {$inc};
            }
            await dailyData.update({date}, updateData);
        }
        await next();
    }catch (e) {
        throw e
    }
};