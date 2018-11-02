<template>
    <b-container class="archives">
        <b-row v-if="archives.length>0" v-for="(item, index) of archives" :key="index">
            <b-col lg="12" class="categorys-title">
                <router-link :to="{ path: '/list/type/' + item._id + '/1'}">{{item.name}}</router-link>  <b-badge class="ml-2">{{item.count}}</b-badge>
            </b-col>
            <b-col lg="12" v-if="item.list.length > 0">
                <b-row>
                    <b-col lg="4" v-for="(article, i) of item.list" :key="i">
                        <div class="post-list-item">
                            <div class="post-list-item-container">
                                <div class="item-label">
                                    <div class="item-title">
                                        <router-link :to="{ path: '/article/' + article._id}">{{article.title}}</router-link>
                                    </div>
                                    <div class="item-meta">
                                        <div class="item-meta-date"> {{article.createdAt | formatTime(setting.read.dateFormat)}} </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </b-col>

                    <b-col lg="4" v-if="item.count > 8">
                        <div class="post-list-item">
                            <div class="post-list-item-container">
                                <div class="item-label">
                                    <div class="item-title item-more">
                                        <router-link :to="{ path: '/list/type/' + item._id + '/1'}">查看更多...</router-link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </b-col>
                </b-row>
            </b-col>
            <b-col lg="12" v-if="item.list.length === 0">
                <b-row class="mb-4">
                    <b-col lg="4" offset-lg="4" class="blank">
                        - 分类下没有文章 -
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
        <b-row v-if="archives.length<=0">
            <b-col lg="12">
                <b-row class="mb-4">
                    <b-col lg="4" offset-lg="4" class="blank">
                        - 博主还没创建分类 -
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    export default {
        name: "archives",
        asyncData ({ store, route}) {
            return Promise.all([store.dispatch('getUserInfo'), store.dispatch('getRecentComment'), store.dispatch('getRecentPost'), store.dispatch('setTypeList'), store.dispatch('setArchivesList' )]);
        },
        computed: {
            ...mapGetters({
                types: 'getTypeList',
                archives: 'getArchives',
                setting: 'getSettingInfo'
            })
        },
        mounted(){
            console.log(this.archives);
        }
    }
</script>

<style scoped>
    .archives{
        padding: 25px;
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
        padding: 0 0 0 30px;
        color: #eb5055;
        content: '#';
    }
    .post-list-item{
        padding: 15px;
    }
    .post-list-item-container{
        border: 1px solid rgba(184,197,214,.2);
        border-radius: 3px;
        background: #fff;
        box-shadow: 0 1px 4px rgba(0,0,0,.04);
    }
    .item-label{
        position: relative;
        padding: 25px 20px 40px;
        height: 95px;
        background: #fff;
    }
    .post-list-item-container .item-label .item-meta {
        position: absolute;
        right: 0;
        bottom: 0;
        padding: 0 15px 15px;
        width: 100%;
        text-align: right;
    }
    .item-more{
        text-align: center;
        margin-top: 12px;
    }
    .post-list-item-container .item-label .item-title a {
        display: block;
        overflow: hidden;
        color: #313131;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 14px;
    }
    .post-list-item-container .item-label .item-meta .item-meta-date {
        position: relative;
        float: left;
        padding-top: 9px;
        text-align: right;
        text-transform: none;
        font-size: 9pt;
        padding-bottom: 5px;
        padding-left: 5px;
        color: #5f5f5f;
    }
    .post-list-item:hover {
        -webkit-transition-duration: .3s;
        transition-duration: .3s;
        -webkit-transform: scale(1.03);
        transform: scale(1.03)
    }
    .blank{
        text-align: center;
        font-size: 9px;
        color: #888;
        padding: 15px 0;
    }
    @media (min-width: 768px){
        .archives{
            padding: 25px 120px;
        }
    }
</style>