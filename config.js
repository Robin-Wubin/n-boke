/**
 * Created by Robin on 2017/11/7.
 */
const path = require('path');
const koaBody = require('koa-bodyparser');
const LRU = require('lru-cache');
const views = require('koa-views');
const session = require('koa-session');
const crypto = require('crypto');
const EventEmitter = require('events').EventEmitter;
const api = require('./api');
const mongo = require("./lib/mongo");
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
        global.fun = {
            randomString:function(len = 8) {
                let chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
                let res = "";
                for (let i = 0; i < len; i++) {
                    let id = Math.ceil(Math.random() * 35);
                    res += chars[id];
                }
                return res;
            },
            sleep : (time)=>{
                return new Promise( (resolve, reject) =>{
                    setTimeout(function(){resolve(null)}, time * 1000)
                })
            },
            encord2md5:(string)=>{
                let ms5Str = crypto.createHash('sha1').update(string).digest('hex');
                let salt = global.fun.randomString();
                let password = crypto.createHash('sha1').update(ms5Str + salt).digest('hex');
                return {password, salt}
            },
            checkPassword:(string, passObj)=>{
                let ms5Str = crypto.createHash('sha1').update(string).digest('hex');
                let salt = passObj.salt;
                let password = crypto.createHash('sha1').update(ms5Str + salt).digest('hex');
                return password === passObj.password;
            },
            event: new EventEmitter(),
            ObjectId : require('mongodb').ObjectID
        };

        app.context.renderComponents = {};

        app.use(async (ctx, next) => {
            try {
                if(global.mongoDB)ctx.state.mdb = global.mongoDB;
                await next();
                // if(ctx.body !== null && typeof ctx.body === 'object'  && ctx.body.code !== "0000"){
                //     ctx.status = 400;
                // }
            } catch (err) {
                console.log(err);
                ctx.status = 500;
            } finally {

            }
        });

        const CONFIG = {
            key: 'sid', /** (string) cookie key (default is koa:sess) */
            maxAge: 86400000, /** (number) maxAge in ms (default is 1 days) */
            overwrite: true, /** (boolean) can overwrite or not (default true) */
            httpOnly: true, /** (boolean) httpOnly or not (default true) */
            store: {
                get:async (key) => {
                    if(!global.mongoDB) return null;
                    let appSession = new mongo(global.mongoDB, "account.session");
                    let data = await appSession.findOne({_id:key});
                    if(data){
                        data.session = JSON.parse(data.session);
                        data.session._expire = new Date(data.session.cookie.expires).getTime();
                        data.session._maxAge = data.session.cookie.originalMaxAge;
                        if(data.session.socketId) delete data.session.socketId;
                        delete data.session.cookie;
                        return data.session;
                    } else {
                        return null;
                    }
                }
                , set:async (key, sess, maxAge)=>{
                    if(!global.mongoDB) return null;
                    let appSession = new mongo(global.mongoDB, "account.session");
                    let sessionCookie = {cookie:{
                            originalMaxAge: maxAge
                            , expires: new Date(sess._expire)
                            , httpOnly: true
                            , path: "/"
                        }}, sessValue = Object.assign({}, sess);
                    delete sessValue._expire;
                    delete sessValue._maxAge;
                    let keyValue =  Object.assign(sessionCookie, sessValue);
                    await appSession.update({_id:key}, {$set:{session:JSON.stringify(keyValue), expires: new Date(sess._expire)}});
                }
                , destroy:async (key)=>{
                    if(!global.mongoDB) return null;
                    let appSession = new mongo(global.mongoDB, "account.session");
                    await appSession.remove({_id:key});
                }
            },
            signed: false /** (boolean) signed or not (default true) */
        };
        app.use(session(CONFIG, app));
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

        app.context.renderComponents.render = (ctx, params = {}) => {
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

                const context = Object.assign({
                    url: ctx.path
                }, params);
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