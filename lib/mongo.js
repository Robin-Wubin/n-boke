'use strict';
class sheet {
    constructor(db, table){
        this.collection = db.collection(table);
    }
    stats() {
        let self = this;
        return new Promise(function (resolve, reject) {
            self.collection.stats(function (err, stats) {
                err ? resolve(err) : resolve(stats);
            });
        });
    }
    ensureIndex(fieldOrSpec, options) {
        let self = this;
        return new Promise(function (resolve, reject) {
            self.collection.ensureIndex(fieldOrSpec, options, function (err, stats) {
                err ? reject(err) : resolve(stats);
            });
        });
    }
    insert (data) {
        let self = this;
        return new Promise(function (resolve, reject) {
            self.collection.insertOne(data, function (err, item) {
                err ? reject(err) : resolve(item);
            });
        });
    }
    insertMany (datas) {
        let self = this;
        return new Promise(function (resolve, reject) {
            self.collection.insertMany(datas, function (err, item) {
                err ? reject(err) : resolve(item);
            });
        });
    }
    find (data, option = null) {
        let self = this;
        return new Promise(function (resolve, reject) {
            let collections;
            collections = self.collection.find(data, option);
            collections.toArray(function (err, result) {
                err ? reject(err) : resolve(result);
            });
        });
    }
    findOne (data, option={}) {
        let self = this;
        return new Promise(function (resolve, reject) {
            self.collection.findOne(data, option, function (err, item) {
                err ? reject(err) : resolve(item);
            });
        });
    }
    /**
     * 更新记录
     * @param {Object} condition 条件
     * @param {Object} data 更新的数据
     *
     */
    update(condition, data, opt = { upsert: true }) {
        let self = this;
        return new Promise(function (resolve, reject) {
            self.collection.updateOne(condition, data, opt, function (err, results) {
                err ? reject(err) : resolve(results);
            });
        });
    }
    findOneAndUpdate (condition, data, opt={}) {
        let self = this;
        return new Promise(function (resolve, reject) {
            self.collection.findOneAndUpdate(condition, data, opt, function (err, results) {
                err ? reject(err) : resolve(results);
            });
        });
    }
    count (condition,option) {
        let self = this;
        return new Promise(function (resolve, reject) {
            let collections;
            collections = self.collection.find(condition); //此处返回的是游标，用同样的变量会覆盖 上面获取的集合信息
            if (option) for (let i in option) collections = collections[i](option[i]); //在查询游标上加入条件
            collections.count(function (err, result) {
                err ? reject(err) : resolve(result);
            });
        });
    }
    remove (condition) {
        let self = this;
        return new Promise(function (resolve, reject) {
            self.collection.deleteOne(condition, {}, function (err, results) {
                err ? reject(err) : resolve(results);
            });
        });
    }

    aggregate(condition){
        let self = this;
        return new Promise(function (resolve, reject) {
            self.collection.aggregate(condition, {}, function (err, results) {
                err ? reject(err) : resolve(results);
            });
        });
    }
}
module.exports = sheet;