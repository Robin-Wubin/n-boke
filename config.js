/**
 * Created by Robin on 2017/11/7.
 */
const path = require('path');
const koaBody = require('koa-bodyparser');
const LRU = require('lru-cache');
const views = require('koa-views');
const util = require('util');
const api = require('./api');
const mysql = require('mysql');
// const install = require('./install');
const { createBundleRenderer } = require('vue-server-renderer');
const resolve = file => path.resolve(__dirname, file);
const MongoClient = require('mongodb').MongoClient;
const templatePath = resolve('./src/index.template.html');
let renderer,readyPromise;
function createRenderer (bundle, options) {
    // https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer
    return createBundleRenderer(bundle, Object.assign(options, {
        // for component caching
        cache: LRU({
            max: 1000,
            maxAge: 1000 * 60 * 15
        }),
        // this is only needed when vue-server-renderer is npm-linked
        basedir: resolve('./dist'),
        // recommended for performance
        runInNewContext: false
    }))
}


module.exports = (app) => {
    return new Promise(function(resolve, reject) {
        "use strict";
        app.context.renderComponents = {};

        app.use(async (ctx, next) => {
            try {
                if(global.mongoDB)ctx.state.mdb = global.mongoDB;
                await next();
                if(ctx.body !== null && typeof ctx.body === 'object'  && ctx.body.code !== "0000"){
                    ctx.status = 400;
                }
            } catch (err) {
                console.log(err);
                ctx.status = err.status || err.code || 500;
            } finally {

            }
        });

        app.use(koaBody({
            textLimit: '10mb',
            jsonLimit: '10mb'
        }));

        app.use(views(path.normalize('/public'), {
            map: {
                html: 'nunjucks'
            }
        }));
        app.use(require('koa-static')(path.normalize('./public'), {
            maxage: 1000 * 60 * 60 * 24 * 365, // 1年，默认为0
            gzip: true,
        }));
        app.context.code = require("./api/code");
        app.context.renderComponents.readyPromise = require('./build/setup-dev-server')(
            app,
            templatePath,
            (bundle, options) => {
                renderer = createRenderer(bundle, options);
            }
        );

        app.context.renderComponents.render = (ctx) => {
            return new Promise((resolve, reject)=>{
                const s = Date.now();
                ctx.set("Content-Type", "text/html");

                const handleError = err => {
                    if (err.url) {
                        ctx.redirect(err.url)
                    } else if(err.code === 404) {
                        ctx.status = 200;
                        ctx.body='404 | Page Not Found';
                    } else {
                        ctx.status = 200;
                        ctx.body='500 | Internal Server Error';
                        // Render Error Page or Redirect
                        console.error(`error during render : ${ctx.req.url}`);
                        console.error(err.stack);
                    }
                    resolve(null);
                };

                const context = {
                    title: 'N-Boke 1.0', // default title
                    url: ctx.path
                };
                renderer.renderToString(context, (err, html) => {
                    console.log(ctx.path, err, html ? html.substr(0 , 15) + "" : null);
                    if (err) {
                        console.error("renderToString Error",err);
                        return handleError(err);
                    }
                    ctx.body = html;
                    console.log(`whole request: ${Date.now() - s}ms`);
                    resolve(null);
                })
            });
        };
        const route = api();
        app.use(route.routes()).use(route.allowedMethods());
        if(appConfig && appConfig.db){
            MongoClient.connect(`mongodb://${appConfig.db.username}:${appConfig.db.password}@${appConfig.db.url}/${appConfig.db.db}`, {
                poolSize: 5,
                autoReconnect: true
            }, function(err, vcDb) {
                if(err) reject(err);
                global.mongoDB = vcDb.db(appConfig.db.db);
                resolve(app);
            });
        } else {
            resolve(app);
        }
    });
};