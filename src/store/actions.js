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
        return request.get('http://localhost:3000/api/admin/info', state.sid ? {headers} : null).then((response) => {
            if (response.statusText === 'OK') {
                response.data.code === '0000' && commit('SET_ADMIN_INFO', response.data.data);
            }
        }).catch((error) => {
            console.log(error)
        })
    }
};