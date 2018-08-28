const Koa = require('koa');
const APP_CONFIG = require('./lib/config');
const CONFIG = require('./config');
const app = new Koa();
global.appConfig = APP_CONFIG();

const EventEmitter = require('events');
global.emitter = new EventEmitter();
(async () => {
    try {
        let server = await CONFIG(app);
        server = require('http').createServer(server.callback());

        server.listen(appConfig.port);
        console.log(`server running on ${appConfig.port}`);

    } catch (err) {
        console.error(`server con not running on ${appConfig.port}`, err)
    }
})();