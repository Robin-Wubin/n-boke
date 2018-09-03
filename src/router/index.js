import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

// route-level code splitting
const Home = () => import('../views/home.vue');
const HomeView = () => import('../views/home/default.vue');
const List = () => import('../views/list/index.vue');
const InstallIndex = () => import('../views/install/index.vue');

export function createRouter () {
  return new Router({
    mode: 'history',
    fallback: false,
    scrollBehavior: () => ({ y: 0 }),
    routes: [
        { path: '/install', component: InstallIndex },
        { path: '/', component: Home,
            children:[
                {path: '', component:HomeView},
                {path:'list', component: List}
            ]
        },
    ]
  })
}