import request from 'axios'

request.defaults.baseURL = 'http://127.0.0.1:3000/';
request.defaults.proxy = false;
export const setAdminInfo = ({ commit, state }) => {
    let headers = {};
    if(state.sid) headers.Cookie = 'sid='+state.sid;
    if(state.admin_info){
        return new Promise((resolve, reject)=>{resolve(null)})
    } else {
        return request.get('api/admin/info', process ? {headers} : null).then((response) => {
            if (response.statusText === 'OK') {
                response.data.code === '0000' && commit('SET_ADMIN_INFO', response.data.data);
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
        return request.get('api/admin/type/list').then((response) => {
            if (response.statusText === 'OK') {
                response.data.code === '0000' && commit('SET_TYPE_LIST', response.data.data);
            }
        }).catch((error) => {
            console.log(error)
        })
    }
};
export const getBlogList = ({ commit, state }, page) => {
    page = page ? page : 1;
    return request.get('api/blog/list?page=' + page).then((response) => {
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
        return request.get('api/blog/content?id=' + id).then((response) => {
            if (response.statusText === 'OK') {
                console.log(response.data);
                response.data.code === '0000' && commit('SET_BLOG_CONTENT', response.data.data);
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