import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import mutations from './mutations'

Vue.use(Vuex);

const state = {
    admin_info: null,
    sid: null,
    type_list: [],
    blog_list: {totalPage:1,list:[]},
    blog_content: null,
    client_info: null
};
export function createStore (context) {
  if(context){
      state.sid = context.sid ? context.sid : null;
      state.blog_content = context.article ? context.article : null;
  }
  return new Vuex.Store({
    state,
    actions,
    mutations,
    getters
  })
}
