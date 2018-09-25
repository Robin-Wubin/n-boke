import request from 'axios'
import Vue from 'vue'

request.defaults.proxy = false;
export const setAdminInfo = ({ commit, state }) => {
    if(state.admin_info){
        return new Promise((resolve, reject)=>{resolve(null)})
    } else {
        let headers = {};
        let opt = {};
        opt.baseURL = Vue.prototype.$isServer ? 'http://127.0.0.1:3000/' : '';
        opt.url = '/api/admin/info';
        opt.method = 'get';
        if(state.sid){
            headers.Cookie = 'sid='+state.sid;
            opt.headers = headers;
        }
        return request(opt).then((response) => {
            if (response.data.code === '0000') {
                 commit('SET_ADMIN_INFO', response.data.data);
            } else {
                console.log(response.data)
            }
        }).catch((error) => {
            console.log(error)
        })
    }
};
export const setTypeList = ({ commit, state }) => {
    if(state.type_list.length!==0){
        return new Promise((resolve, reject)=>{resolve(null)})
    } else {
        let opt = {};
        opt.baseURL=Vue.prototype.$isServer ? 'http://127.0.0.1:3000/' : '';
        opt.url='/api/admin/type/list';
        opt.method='get';
        return request(opt).then((response) => {
            if (response.data.code === '0000') {
                commit('SET_TYPE_LIST', response.data.data);
            } else {
                console.log(response.data)
            }
        }).catch((error) => {
            console.log(error)
        })
    }
};
export const getBlogList = ({ commit, state }, page) => {
    page = page ? page : 1;

    let opt = {};
    opt.baseURL = Vue.prototype.$isServer ? 'http://127.0.0.1:3000/' : '';
    opt.url = 'api/blog/list?page=' + page;
    opt.method = 'get';
    return request(opt).then((response) => {
        if(response.data.code === '0000'){
            commit('SET_BLOG_LIST', response.data.data);
        } else {
            console.log(response.data)
        }
    }).catch((error) => {
        console.log(error)
    })
};
export const getBlogContent = ({ commit, state }, id) => {
    if(state.blog_content && (state.blog_content._id === id)){
        console.log(state.blog_content && state.blog_content._id, id);
        return new Promise((resolve, reject)=>{resolve(null)});
    } else {
        let opt = {};
        opt.baseURL = Vue.prototype.$isServer ? 'http://127.0.0.1:3000/' : '';
        opt.url = '/api/blog/content?id=' + id;
        opt.method = 'get';
        return request(opt).then((response) => {
            if (response.data.code === '0000') {
                 commit('SET_BLOG_CONTENT', response.data.data);
            } else {
                console.log(response.data)
            }
        }).catch((error) => {
            console.log(error)
        })
    }
};
export const setClientInfo = ({ commit, state }, data) => {
    window.localStorage.setItem('client_info', JSON.stringify(data));
    commit('SET_CLIENT_INFO', data);
};