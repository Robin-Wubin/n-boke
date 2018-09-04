import request from 'axios'


export const setCategory = ({ commit, state }) => {
  return request.get('https://gxx.leanapp.cn/category').then((response) => {
    if (response.statusText === 'OK') {
      response.data.code == '200' && commit('SET_CATEGORY', response.data.data)
    }
  }).catch((error) => {
    console.log(error)
  })
}