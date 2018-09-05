module.exports = {
    auth:"admin",
    route: [
        {
            type: 'get', url: '/api/admin/info'
            , fun: [
                async (ctx) => {
                    try {
                        ctx.body = await ctx.code('1001');
                    } catch (e) {
                        throw e;
                    }
                }]
        }
    ]
};