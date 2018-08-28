/**
 * Created by Robin on 2017/11/7.
 */
const path = require('path');
const koaBody = require('koa-bodyparser');
const views = require('koa-views');
const mysql = require('mysql');


module.exports = (app) => {
    return new Promise(function(resolve, reject) {
        "use strict";
        app.context.db = {};

        app.use(async (ctx, next) => {
            try {
                await next();
            } catch (err) {
                console.log('err', err);
                ctx.status = err.status || err.code || 500;
            } finally {

            }
        });

        app.use(koaBody({
            textLimit: '10mb',
            jsonLimit: '10mb'
        }));

        app.use(views(path.normalize(process.cwd() + '/frontend'), {
            map: {
                html: 'nunjucks'
            }
        }));
        resolve(app);
    });
};