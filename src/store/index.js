import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import mutations from './mutations'

Vue.use(Vuex);

const state = {
    isServer: Vue.prototype.$isServer,
    admin_info: null,
    sid: null,
    type_list: [],
    blog_list: {totalPage:1,list:[]},
    blog_content: null,
    client_info: null
};
export function createStore (context) {
  if(context && context.sid) state.sid = context.sid;
  return new Vuex.Store({
    state,
    actions,
    mutations,
    getters
  })
}
