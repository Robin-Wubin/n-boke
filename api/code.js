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
    '2004': {
        msgCN: '不存在该文章',
        msgEN: 'Article is not exist.'
    },
    '2005': {
        msgCN: '该分组下还有素材资源未移除，不允许删除',
        msgEN: 'Can not delete type because there is some sources belong to.'
    },
    '2006': {
        msgCN: '不存在该分组',
        msgEN: 'Type no exits.'
    },
    '2007': {
        msgCN: '不存在该资源',
        msgEN: 'Source no exits.'
    },
    '2008': {
        msgCN: '访问密码错误',
        msgEN: 'Error Password.'
    },
    '2009': {
        msgCN: '文章不允许评论',
        msgEN: 'Article is not allow comment.'
    },
    '2010': {
        msgCN: '回复的评论不存在',
        msgEN: 'Comment no exits.'
    },
    '2011': {
        msgCN: '回复的评论超过限制层数',
        msgEN: 'Comment exceed the limit number.'
    },
    '2012': {
        msgCN: '请填写邮箱',
        msgEN: 'Please enter your email.'
    },
    '2013': {
        msgCN: '请填写网址',
        msgEN: 'Please enter your website.'
    },
    '2014': {
        msgCN: '新增评论错误',
        msgEN: 'new comment error.'
    },
    '2015': {
        msgCN: '抱歉，您的评论太频繁。请稍后一分钟后再发表',
        msgEN: 'comment too busy.'
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