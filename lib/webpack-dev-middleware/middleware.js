/*
 MIT License http://www.opensource.org/licenses/mit-license.php
 Author Tobias Koppers @sokra
 */
var mime = require("mime");
var getFilenameFromUrl = require("./lib/GetFilenameFromUrl");
var Shared = require("./lib/Shared");
var pathJoin = require("./lib/PathJoin");

// constructor for the middleware
module.exports = function(compiler, options) {

    var context = {
        state: false,
        webpackStats: undefined,
        callbacks: [],
        options: options,
        compiler: compiler,
        watching: undefined,
        forceRebuild: false
    };
    var shared = Shared(context);

    // The middleware function
    function webpackDevMiddleware(ctx) {
        return new Promise(function(resolve, reject) {
            function goNext() {
                if(!context.options.serverSideRender) return resolve(true);
				shared.ready(function() {
                    ctx.res.locals.webpackStats = context.webpackStats;
					resolve(true);
				}, ctx.req);
            }
            if(ctx.method !== "GET") {
                return goNext();
            }

            var filename = getFilenameFromUrl(context.options.publicPath, context.compiler, ctx.url);
            if(filename === false) return goNext();


			shared.handleRequest(filename, processRequest, ctx.req);
			function processRequest() {
				try {
					var stat = context.fs.statSync(filename);
					if(!stat.isFile()) {
						if(stat.isDirectory()) {
							var index = context.options.index;

							if(index === undefined || index === true) {
								index = "index.html";
							} else if(!index) {
								throw "next";
							}

							filename = pathJoin(filename, index);
							stat = context.fs.statSync(filename);
							if(!stat.isFile()) throw "next";
						} else {
							throw "next";
						}
					}
				} catch(e) {
					return reject(e);
				}

				// server content
				var content = context.fs.readFileSync(filename);
				content = shared.handleRangeHeaders(content, ctx.req, ctx.res);
				var contentType = mime.lookup(filename);
				// do not add charset to WebAssembly files, otherwise compileStreaming will fail in the client
				if(!/\.wasm$/.test(filename)) {
					contentType += "; charset=UTF-8";
				}
                ctx.set("Content-Type", contentType);
                ctx.set("Content-Length", content.length);
				if(context.options.headers) {
					for(var name in context.options.headers) {
                        ctx.set(name, context.options.headers[name]);
					}
				}
				// Express automatically sets the statusCode to 200, but not all servers do (Koa).
                ctx.status = 200;
                ctx.body = content;
                console.log("filename", filename, ctx.body, ctx.status);
				resolve(false);
			}
		});
    }

    webpackDevMiddleware.getFilenameFromUrl = getFilenameFromUrl.bind(this, context.options.publicPath, context.compiler);
    webpackDevMiddleware.waitUntilValid = shared.waitUntilValid;
    webpackDevMiddleware.invalidate = shared.invalidate;
    webpackDevMiddleware.close = shared.close;
    webpackDevMiddleware.fileSystem = context.fs;
    return webpackDevMiddleware;
};
