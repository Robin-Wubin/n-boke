<template>
    <b-container>
        <b-navbar toggleable="md" class="full">
            <b-row class="grow1">
                <b-col md="3" class="mt-2">
                    <b-navbar-toggle target="nav_menu_collapse" class="collapseBtn">
                        <div>
                            <i class="fa fa-th-large"></i>
                        </div>
                    </b-navbar-toggle>
                    <b-collapse is-nav id="nav_menu_collapse">
                        <b-list-group class="grow1">
                            <b-list-group-item v-for="(item, index) in menu" :key="item.path">
                                <i v-if="item.meta" :class="'fa '+item.meta.icon+' mr-2'"></i>
                                <router-link :to="{ path: '/admin/app' + item.path}">{{item.name}}</router-link>
                            </b-list-group-item>
                        </b-list-group>
                    </b-collapse>
                </b-col>
                <b-col md="9">
                    <div class="admin_container mt-2">
                        <router-view class="view"></router-view>
                    </div>
                </b-col>
            </b-row>
        </b-navbar>
        <!-- Content here -->
    </b-container>
</template>

<script>
    export default {
        name: "index",
        data(){
            return {
                menu: [
                    {
                        name:"博客一览",
                        path:"/dashboard",
                        meta:{
                            icon:"fa-dashboard",
                            expanded:false
                        }
                    },
                    {
                        name:"文章管理",
                        path:"/article",
                        meta:{
                            icon:"fa-book",
                            expanded:false
                        }
                    },
                    {
                        name:"素材管理",
                        path:"/source",
                        meta:{
                            icon:"fa-file-photo-o",
                            expanded:false
                        }
                    },
                    {
                        name:"评论管理",
                        path:"/comment",
                        meta:{
                            icon:"fa-edit",
                            expanded:false
                        }
                    },
                    {
                        name:"个人中心",
                        path:"/person",
                        meta:{
                            icon:"fa-user"
                        }
                    },
                    {
                        name:"博客设置",
                        path:"/setting",
                        meta:{
                            icon:"fa-gears"
                        }
                    }
                 ]
            }
        }
    }
</script>

<style>
    .bread_head{
        margin-bottom: 0;
        border-radius: 0;
    }

    .suit_fot_tpl{
        border-left: none;
        border-right: none;
        display: flex;
        flex-direction: column;
    }
    .suit_fot_tpl:first-child{
        border-radius: 0;
    }
    .suit_fot_tpl:last-child{
        border-bottom: none;
    }
    .suit_fot_tpl .bottom_side{
        display: flex;
        flex-wrap: nowrap;
        flex-direction: row;
        justify-content: space-between;
    }
    .pagination_nav{
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    .main_container{
        background: #FFF;
        border-radius: 0.25rem;
        border: 1px solid rgba(0,0,0,0.125);
        margin-bottom: 1rem;
    }
    .no_radius{
        -webkit-border-radius: 0;
        -moz-border-radius: 0;
        border-radius: 0;
    }
    .collapseBtn, .full{
        width: 100%;
    }
    .grow1{
        flex-grow: 1;
    }
    .list-group-item{
        font-size: 14px;
    }
    .list-group-item .fa{
        width: 20px;
        text-align: center;
        font-size: 14px;
    }
    .container {
        width: 100%;
        padding-right: 0;
        padding-left: 0;
    }
    .comment-delete{
        color: #c7c7c7;
        display: block;
        text-align: center;
    }
</style>