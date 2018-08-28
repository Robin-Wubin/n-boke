const fs = require("fs");
const path = require("path");
const yaml = require('js-yaml');
const CONFIG_PATH = path.join(__dirname, '../../', 'config.yml');
let state = fs.existsSync(CONFIG_PATH), doc;
if(!state){
    doc = {version: "1.0.0", port:3000};
    fs.writeFileSync(CONFIG_PATH,yaml.dump(doc, {
        flowLevel: 3,
        styles: {
            '!!int'  : 'decimal',
            '!!null' : 'camelcase'
        }
    }));
} else {
    doc = yaml.safeLoad(fs.readFileSync(CONFIG_PATH, 'utf8'));
}
let HANDLER = {
    get: function (target, key, receiver) {
        return Reflect.get(target, key, receiver);
    },
    set: function (target, key, value, receiver) {
        let res = Reflect.set(target, key, value, receiver);
        fs.writeFileSync(CONFIG_PATH,yaml.dump(target, {
            flowLevel: 3,
            styles: {
                '!!int'  : 'decimal',
                '!!null' : 'camelcase'
            }
        }));
        return res;
    },
    deleteProperty: function(target, key){
        let res = Reflect.deleteProperty(target, key);
        fs.writeFileSync(CONFIG_PATH,yaml.dump(target, {
            flowLevel: 3,
            styles: {
                '!!int'  : 'decimal',
                '!!null' : 'camelcase'
            }
        }));
        return res;
    }
};
module.exports = ()=>{
    return new Proxy(doc, HANDLER);
};