<template>

    <b-container>
        <b-row>
            <div style="width: 100%">
                <div v-if="article.list.length>0" class="list">
                    <b-card v-for="(item,index) of article.list" :key="index"
                            tag="article"
                            style="max-width: 20rem;"
                            class="n_boke_card">
                        <div class="headImageContainer">
                            <div :class="'headImage '+color[parseInt(Math.random()*color.length)]" v-bind:style="item.headImage ? {backgroundImage:'url(' + item.headImage.replace(/\\/g, '/') + ')'} : null"></div>
                            <div class="articleBrief"><p>{{item.brief}}</p></div>
                            <div :class="'slant reverse-slant '+color[parseInt(Math.random()*color.length)]"></div>
                            <div class="slant"></div>
                        </div>
                        <div class="card-content">
                            <p class="card-text">
                                <router-link :to="{ path: '/article/' + item._id}">{{item.title}}</router-link>
                            </p>
                        </div>
                        <div slot="footer">
                            <small class="text-muted float-left">{{item.createdAt | formatTime(setting.read.dateFormat)}}</small>
                            <small class="text-muted float-right"># {{item.type | getTypes(types)}}</small>
                        </div>
                    </b-card>
                </div>
                <div v-if="article.list.length===0" class="list">
                    <b-card tag="article"
                            style="max-width: 20rem;"
                            class="n_boke_card">
                        <div class="headImageContainer">
                            <div :class="'headImage '+color[parseInt(Math.random()*color.length)]" ></div>
                            <div class="blanket"><i class="fa fa-edit"></i></div>
                            <div :class="'slant reverse-slant '+color[parseInt(Math.random()*color.length)]"></div>
                            <div class="slant"></div>
                        </div>
                        <div class="card-content">
                            <p class="card-text" style="font-size: 12px">
                                博主正在努力撰写文章中...
                            </p>
                        </div>
                    </b-card>
                </div>
                <b-pagination-nav v-if="article.totalPage>1" class="pagination_nav" align="center" :link-gen="linkGen" :number-of-pages="article.totalPage" v-model="page" />
            </div>
        </b-row>
    </b-container>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    export default {
        name: "default",
        asyncData ({ store, route}) {
            let page = route.params.page ? route.params.page : 1;
            return Promise.all([store.dispatch('getUserInfo'), store.dispatch('getRecentComment'), store.dispatch('setTypeList'), store.dispatch('getBlogList', {page})]);
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
                page: parseInt(this.$route.params.page ? this.$route.params.page : 1)
            }
        },
        methods: {
            linkGen (pageNum) {
                return "/page/" + pageNum
            }
        }
    }
</script>

<style>
    .list{
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        flex-wrap: wrap;
        padding: 50px 0;
    }
    .n_boke_card{
        width: 300px;
        margin: 25px 30px !important;
        overflow: hidden;
    }
    .n_boke_card .card-body{
        position: relative;
        padding: 0;
    }
    .n_boke_card .card-content{
        position: relative;
        padding: 0.25em 1.25em 1.25em;
        background: #FFF;
    }
    .slant{
        position: absolute;
        right: 0;
        bottom: -75pt;
        left: 0;
        z-index: 0;
        width: 110%;
        min-height: 75pt;
        background-color: #fff;
        -webkit-transform: rotate(7deg) translate(-10px,-20px);
        transform: rotate(7deg) translate(-10px,-20px);
        -ms-transform: rotate(7deg) translate(-10px,-20px);
    }
    .slant.reverse-slant {
        -webkit-transform: rotate(-10deg) translate(10px,-20px);
        -ms-transform: rotate(-10deg) translate(10px,-20px);
        transform: rotate(-10deg) translate(10px,-20px);
        opacity: .7;
        background-color: #f68e5f;
        -webkit-box-shadow: none;
        box-shadow: none;
    }
    .bg-deepgrey {
        background-color: rgba(0,0,0,.5)!important;
    }
    .headImageContainer{
        position: relative;
        overflow: hidden;
    }
    .headImage{
        position: relative;
        display: inherit;
        min-height: 250px;
        -webkit-transition: -webkit-transform .5s ease,filter .5s ease;
        -moz-transition: -moz-transform .5s ease,filter .5s ease;
        transition: transform .5s ease,filter .5s ease;
        background-position: 50% 50%;
        background-size: cover;
    }
    .n_boke_card:hover .headImage {
        -webkit-transform: scale(1.1);
        -moz-transform: scale(1.1);
        transform: scale(1.1);
        -webkit-filter: blur(3px);
        -moz-filter: blur(3px);
        filter: blur(3px)
    }
    .n_boke_card .articleBrief {
        position: absolute;
        top: 0;
        overflow: hidden;
        width: 100%;
        height: 100%;
        padding: 40px 28px;
    }
    .n_boke_card .articleBrief p {
        font-size: 14px;
        margin: 0;
        padding: 0;
        word-break: break-all;
        opacity: 0;
        color: #fff
    }

    .n_boke_card .blanket {
        position: absolute;
        top: 0;
        overflow: hidden;
        width: 100%;
        height: 100%;
        font-size: 60px;
        color: #FFF;
        text-align: center;
        line-height: 250px;
    }
    .n_boke_card:hover .articleBrief {
        background-color: rgba(0,0,0,.5)
    }

    .n_boke_card:hover .articleBrief p {
        -webkit-animation: fade-in .5s;
        animation: fade-in;
        animation-duration: .5s;
        opacity: 1
    }
</style>