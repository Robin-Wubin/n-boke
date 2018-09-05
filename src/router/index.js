import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

// route-level code splitting
const Home = () => import('../views/home.vue');
const HomeView = () => import('../views/home/default.vue');
const List = () => import('../views/list/index.vue');
const InstallIndex = () => import('../views/install/index.vue');
const InstallDefault = () => import('../views/install/default.vue');
const InstallMongoDB = () => import('../views/install/mongo.vue');
const InstallAdmin = () => import('../views/install/admin.vue');
const Admin = () => import('../views/admin/index.vue');
const AdminLogin = () => import('../views/admin/login.vue');

export function createRouter () {
  return new Router({
    mode: 'history',
    fallback: false,
    scrollBehavior: () => ({ y: 0 }),
    routes: [
        { path: '/install', component: InstallIndex ,
            children:[
                {path: '', component:InstallDefault},
                {path: 'mongo', component:InstallMongoDB},
                {path: 'admin', component:InstallAdmin},
            ]
        },
        { path: '/', component: Home,
            children:[
                {path: '', component:HomeView},
                {path:'list', component: List}
            ]
        },
        { path: '/admin', component: Admin,
            children:[
                {path:'login', component: AdminLogin},
                {path: 'app', component:HomeView},
            ]
        },
    ]
  })
}