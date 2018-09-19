import request from 'axios'

export const setCategory = ({ commit, state }) => {
  return request.get('https://gxx.leanapp.cn/category').then((response) => {
    if (response.statusText === 'OK') {
      response.data.code === '200' && commit('SET_CATEGORY', response.data.data)
    }
  }).catch((error) => {
    console.log(error)
  })
};
export const setAdminInfo = ({ commit, state }) => {
    let headers = {};
    if(state.sid) headers.Cookie = 'sid='+state.sid;
    if(state.admin_info){
        return new Promise((resolve, reject)=>{resolve(null)})
    } else {
        return request.get('http://localhost:3000/api/admin/info', process ? {headers} : null).then((response) => {
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
        return request.get('http://localhost:3000/api/admin/type/list').then((response) => {
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
    return request.get('http://localhost:3000/api/blog/list?page=' + page).then((response) => {
        if (response.statusText === 'OK') {
            console.log(response.data);
            response.data.code === '0000' && commit('SET_BLOG_LIST', response.data.data);
        }
    }).catch((error) => {
        console.log(error)
    })
};
export const getBlogContent = ({ commit, state }, id) => {
    return request.get('http://localhost:3000/api/blog/content?id=' + id).then((response) => {
        if (response.statusText === 'OK') {
            console.log(response.data);
            response.data.code === '0000' && commit('SET_BLOG_CONTENT', response.data.data);
        }
    }).catch((error) => {
        console.log(error)
    })
};
export const setClientInfo = ({ commit, state }, data) => {
    window.localStorage.setItem('client_info', JSON.stringify(data));
    commit('SET_CLIENT_INFO', data);
};