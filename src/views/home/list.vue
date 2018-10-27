<template>
    <div>
        <div class="title-container">
            <div class="categorys-title" v-if="act === 'search'">搜索: {{keyword}}</div>
            <div class="categorys-title" v-if="act === 'tag'">标签: {{keyword}}</div>
            <div class="categorys-title" v-if="act === 'type'">分类: {{keyword | getTypes(types)}}</div>
        </div>
        <div class="articles" v-if="article.list.length > 0">
            <b-col lg="12" v-for="(item,index) of article.list" :key="index">
                <b-container class="article">
                    <div v-if="item.headImage" class="head-img bg-deepgrey" :style="{'background-image': 'url(' + item.headImage.replace(/\\/g, '/') + ')'}"></div>
                    <div class="item-title"> <h2> <router-link :to="{ path: '/article/' + item._id}">{{item.title}}</router-link> </h2> </div>
                    <div class="item-meta"> <time> 发表于 {{item.createdAt | formatTime(setting.read.dateFormat)}}</time> in
                        <router-link :to="{ path: '/list/type/' + item.type + '/1'}">{{item.type | getTypes(types)}}</router-link>
                    </div>
                    <div class="item-meta-hr bg-deepgrey"></div>
                    <div class="item-content"> <p>{{item.brief}}</p> </div>
                    <div class="item-readmore"> <router-link :to="{ path: '/article/' + item._id}">继续阅读 →</router-link> </div>
                </b-container>
            </b-col>
        </div>
        <b-container class="article blank" v-if="article.list.length === 0">
            <div v-if="act === 'search'">- Sorry, 找不到与 <strong>{{keyword}}</strong> 有关的文章 -</div>
            <div v-if="act === 'tag'">- 还没有与 {<strong>{{keyword}}</strong> 有关的文章 -</div>
            <div v-if="act === 'type'">- 此分类下还没有发布文章 -</div>
        </b-container>
        <b-pagination-nav size="sm" v-if="article.totalPage>1" class="pagination_nav mt-3" align="center" :link-gen="linkGen" :number-of-pages="article.totalPage" v-model="page" />
    </div>

</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    export default {
        name: "list",
        asyncData ({ store, route}) {
            let query = {};
            query[route.params.act] = route.params.keyword;
            let page = route.params.page ? route.params.page : 1;
            return Promise.all([store.dispatch('getUserInfo'), store.dispatch('getRecentComment'), store.dispatch('getRecentPost'), store.dispatch('setTypeList'), store.dispatch('searchBlogList', {page, query} )]);
        },
        computed: {
            ...mapGetters({
                types: 'getTypeList',
                article: 'getBlogList',
                setting: 'getSettingInfo'
            })
        },
        data(){
            return{
                color:["bg-blue", "bg-green", "bg-yellow", "bg-red", "bg-orange"],
                page: parseInt(this.$route.params.page ? this.$route.params.page : 1),
                act: this.$route.params.act,
                keyword: this.$route.params.keyword,
            }
        },
        methods: {
            linkGen (pageNum) {
                return "/list/" + this.act + "/" + this.keyword + "/" + pageNum
            }
        },
        mounted(){
            this.act= this.$route.params.act;
            this.keyword= this.$route.params.keyword;
            console.log(this.article);
        },
        watch: {
            $route (to, from) {
                if(to.params.act){
                    this.act= to.params.act;
                    this.keyword= to.params.keyword;
                }
            }
        }
    }
</script>

<style scoped>
    .articles{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }
    .article{
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 55px 15px;
    }
    .articles>div:nth-child(n) {
        background-color: #f7f7f7;
    }
    .articles>div:nth-child(2n) {
        background-color: #fff;
    }
    .articles>div:nth-child(2n):last-child {
        border-bottom: 1px solid rgba(184,197,214,0.2);
    }
    .head-img{
        min-height: 260px;
        width: 640px;
        max-width: 100%;
        border-radius: 5px;
        background-position: 50% 50%;
        background-size: cover;
        -webkit-box-shadow: 0 2px 4px rgba(0,0,0,.1);
        box-shadow: 0 2px 4px rgba(0,0,0,.1);
        transition-duration: .4s;
        -webkit-transition-duration: .4s;
    }
    .item-title{
        margin: 30px 0 0;
        text-align: center;
    }
    .item-title a{
        font-size: 21px;
        line-height: 17px;
        color: #313131;
    }
    .item-meta, .item-readmore {
        font-size: 12px;
        text-align: center;
        color: #5f5f5f;
    }
    .item-readmore {
        margin-top: 30px;
     }
    .item-meta-hr {
        display: block;
        width: 55px;
        height: 2px;
        margin: 20px auto 0;
    }
    .item-content {
        padding: 30px 10px;
        text-align: center;
        word-break: break-all;
        font-size: 14px;
        width: 640px;
        max-width: 100%;
        display: none;
    }
    .item-readmore a {
        padding: 8px 20px;
        color: #5f5f5f;
        border: 1px solid #5f5f5f;
        border-radius: 20px;
    }
    .categorys-title{
        position: relative;
        margin: 10px auto;
        padding: 0 30px;
        color: #5f5f5f;
        font-size: 14px;
    }
    .categorys-title:before {
        position: absolute;
        top: 0;
        left: -15px;
        padding: 0 30px;
        color: #eb5055;
        content: '#';
    }
    .title-container{
        display: flex;
        justify-content: center;
        padding: 15px 0;
        background: #f1f1f1;
    }
    .blank{
        text-align: center;
        font-size: 9px;
        color: #888;
        padding: 150px 0;
    }
    @media (min-width: 768px){
        .item-content{
            display: block;
        }
        .item-readmore {
            margin-top: 0;
        }
    }
</style>