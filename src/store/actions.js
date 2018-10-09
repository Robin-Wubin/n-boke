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
export const getBlogList = ({ commit, state }, params) => {
    let page = params.page ? params.page : 1;
    if(state.blog_list && (state.blog_list.page === page)){
        return new Promise((resolve, reject)=>{resolve(null)});
    } else {
        let opt = {};
        opt.baseURL = Vue.prototype.$isServer ? 'http://127.0.0.1:3000/' : '';
        opt.url = '/api/blog/list?page=' + page;
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
    }
};
export const getBlogContent = ({ commit, state }, id) => {
    if(state.blog_content && typeof state.blog_content._id ==="object")state.blog_content._id = state.blog_content._id.toString();
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
export const getUserInfo = ({ commit, state }) => {
    let opt = {};
    opt.baseURL = Vue.prototype.$isServer ? 'http://127.0.0.1:3000/' : '';
    opt.url = '/api/blog/user/info';
    opt.method = 'get';
    return request(opt).then((response) => {
        if (response.data.code === '0000') {
            commit('SET_USER_INFO', response.data.data);
        } else {
            console.log(response.data)
        }
    }).catch((error) => {
        console.log(error)
    })
};
export const getRecentComment = ({ commit, state }) => {
    if(state.recent_comment){
        return new Promise((resolve, reject)=>{resolve(null)});
    } else {
        let opt = {};
        opt.baseURL = Vue.prototype.$isServer ? 'http://127.0.0.1:3000/' : '';
        opt.url = '/api/blog/comment/recent';
        opt.method = 'get';
        return request(opt).then((response) => {
            if (response.data.code === '0000') {
                commit('SET_RECENT_COMMENT', response.data.data);
            } else {
                console.log(response.data)
            }
        }).catch((error) => {
            console.log(error)
        })
    }
};
export const getRecentPost = ({ commit, state }) => {
    if(state.recent_post){
        return new Promise((resolve, reject)=>{resolve(null)});
    } else {
        let opt = {};
        opt.baseURL = Vue.prototype.$isServer ? 'http://127.0.0.1:3000/' : '';
        opt.url = '/api/blog/recent';
        opt.method = 'get';
        return request(opt).then((response) => {
            if (response.data.code === '0000') {
                commit('SET_RECENT_POST', response.data.data);
            } else {
                console.log(response.data)
            }
        }).catch((error) => {
            console.log(error)
        })
    }
};
export const searchBlogList = ({ commit, state }, params, query) => {
    let page = params.page ? params.page : 1;
    if(state.blog_list && (state.blog_list.page === page)){
        return new Promise((resolve, reject)=>{resolve(null)});
    } else {
        let opt = {};
        opt.baseURL = Vue.prototype.$isServer ? 'http://127.0.0.1:3000/' : '';
        opt.url = '/api/blog/search?page=' + page;
        opt.method = 'post';
        opt.data = params.query;
        return request(opt).then((response) => {
            console.log(response.data);
            if(response.data.code === '0000'){
                commit('SET_BLOG_LIST', response.data.data);
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