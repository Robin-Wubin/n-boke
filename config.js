/**
 * Created by Robin on 2017/11/7.
 */
const path = require('path');
const koaBody = require('koa-bodyparser');
const LRU = require('lru-cache');
const views = require('koa-views');
const mysql = require('mysql');
// const install = require('./install');
const { createBundleRenderer } = require('vue-server-renderer');
const resolve = file => path.resolve(__dirname, file);
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
        app.context.db = {};

        // app.use(async (ctx, next) => {
        //     try {
        //         await next();
        //     } catch (err) {
        //         console.log('err', err);
        //         ctx.status = err.status || err.code || 500;
        //     } finally {
        //
        //     }
        // });

        // app.use(koaBody({
        //     textLimit: '10mb',
        //     jsonLimit: '10mb'
        // }));

        app.use(views(path.normalize('/public'), {
            map: {
                html: 'nunjucks'
            }
        }));
        app.use(require('koa-static')(path.normalize('./public'), {
            maxage: 1000 * 60 * 60 * 24 * 365, // 1年，默认为0
            gzip: true,
        }));

        readyPromise = require('./build/setup-dev-server')(
            app,
            templatePath,
            (bundle, options) => {
                renderer = createRenderer(bundle, options);
            }
        );

        function render (ctx) {
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
                    title: 'Vue HN 2.0', // default title
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
        }

        app.use(async ctx => {

            await readyPromise;
            await render(ctx);
        });
        resolve(app);
    });
};