'use strict';
/*
* 1*** 是指系统配置时所发生的错误
* 2*** 是指系统业务系统错误
* */
const obj = {
    '0000': {},
    '1001': {
        msgCN: 'MongoDB配置错误',
        msgEN: 'MongoDB Setup Error.'
    },
    '2001': {
        msgCN: '名称或密码错误',
        msgEN: 'Incorrect either name or password.'
    },
    '2002': {
        msgCN: '你还未登录',
        msgEN: 'Your are not login yet.'
    },
    '2003': {
        msgCN: '该类别已经存在',
        msgEN: 'Type is exist.'
    },
};
const ReturnCode = (code, data = null) => {
    return new Promise((resolve, reject)=>{
        if(obj[code]){
            let returnData = Object.assign({code, data}, obj[code]);
            resolve(returnData);
        } else {
            reject("不存在该返回码！")
        }
    });
};
module.exports = ReturnCode;