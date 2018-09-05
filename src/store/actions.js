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
    return request.get('http://localhost:3000/api/admin/info').then((response) => {
        if (response.statusText === 'OK') {
            response.data.code === '0000' && commit('SET_ADMIN_INFO', response.data);
        }
    }).catch((error) => {
        console.log(error)
    })
};