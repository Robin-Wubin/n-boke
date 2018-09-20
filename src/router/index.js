import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

// route-level code splitting
const Home = () => import('../views/home.vue');
const HomeView = () => import('../views/home/default.vue');
const ArticleView = () => import('../views/home/article.vue');
const InstallIndex = () => import('../views/install/index.vue');
const InstallDefault = () => import('../views/install/default.vue');
const InstallMongoDB = () => import('../views/install/mongo.vue');
const InstallAdmin = () => import('../views/install/admin.vue');
const Admin = () => import('../views/admin/index.vue');
const AdminLogin = () => import('../views/admin/login.vue');
const AdminApp = () => import('../views/admin/app/index.vue');
const AdminAppDashboard = () => import('../views/admin/app/dashboard.vue');
const AdminAppArticleList = () => import('../views/admin/app/article/list.vue');
const AdminAppArticleNew = () => import('../views/admin/app/article/new.vue');
const AdminAppSourceIndex = () => import('../views/admin/app/source/index.vue');
const AdminAppCommentList = () => import('../views/admin/app/comment/list.vue');

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
                {path: 'page/:page', component:HomeView},
                {path: 'article/:id', component:ArticleView}
            ]
        },
        { path: '/admin', component: Admin,
            children:[
                {path:'login', component: AdminLogin},
                {path: 'app', component:AdminApp,
                    children:[
                        {path: 'dashboard', component:AdminAppDashboard},
                        {path: 'article', component: AdminAppArticleList, redirect:"/admin/app/article/list"
                            , children:[
                                {path:"list", redirect:"/admin/app/article/list/1"},
                                {path:"list/:page", component: AdminAppArticleList},
                                {path:"new", component: AdminAppArticleNew},
                                {path:"edit/:id", component: AdminAppArticleNew, props: true}
                            ]
                        },
                        {path: 'source', component: AdminAppSourceIndex, redirect:"/admin/app/source/index"
                            , children:[
                                {path:"index", component: AdminAppSourceIndex}
                            ]
                        },
                        {path: 'comment', component: AdminAppCommentList, redirect:"/admin/app/comment/list"
                            , children:[
                                {path:"list", component: AdminAppCommentList}
                            ]
                        }
                    ]
                },
            ]
        },
    ]
  })
}