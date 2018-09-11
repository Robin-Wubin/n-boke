module.exports.checkAdmin = async(ctx, next)=>{
    try{
        if(ctx.session.adminInfo) return await next();
        return ctx.body = await ctx.code('2002');
    }catch (e) {
        throw e
    }
};