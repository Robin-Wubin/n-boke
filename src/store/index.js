import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import mutations from './mutations'

Vue.use(Vuex);

const state = {
    admin_info: null,
    sid: null,
    type_list: []
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
