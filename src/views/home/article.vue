<template>
    <div>
        <div class="head_image_container">
            <div :class="'head_image '+color[parseInt(Math.random()*color.length)]" :style="article.headImage ? {backgroundImage:'url(' + article.headImage.replace(/\\/g, '/') + ')'} : null"></div>
            <div class="article_head">
                <b-container>
                    <div class="title">{{article.title}}</div>
                </b-container>
            </div>
        </div>
        <b-container>
            <b-row class="ql-snow">
                <b-col md="8" offset-md="2">
                    <div class="article_content ql-editor" v-html="article.content"></div>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    export default {
        name: "myArticle",
        asyncData ({ store, route}) {
            let id = route.params.id;
            console.log(id);
            return Promise.all([store.dispatch('setTypeList'), store.dispatch('getBlogContent', id)]);
        },
        computed: {
            ...mapGetters({
                types: 'getTypeList',
                article: 'getBlogContent'
            })
        },
        data(){
            return{
                color:["bg-blue", "bg-green", "bg-yellow", "bg-red", "bg-orange"],
                id: this.$route.params.id
            }
        },
    }
</script>

<style scoped>
    .head_image_container {
        position: relative;
        width: 100%;
        height: 300px;
        overflow: hidden;
    }
    .head_image {
        position: absolute;
        width: 100%;
        height: 300px;
        background-position: center;
        background-size: cover;
        -webkit-filter: blur(4px);
        -moz-filter: blur(4px);
        filter: blur(4px);
    }
    .article_head{
        position: relative;
        height: 100%;
     }
    .article_head>.container{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
    }
    .title{
        color: #FFF;
        font-size: 25px;
        text-shadow: 0 1px #5f5f5f, 1px 0 #5f5f5f, -1px 0 #5f5f5f, 0 -1px #5f5f5f;
    }
    .article_content{
        width: 100%;
        padding: 50px 0;
        font-size: 14px;
        line-height: 28px;
        color: #5f5f5f;
        font-family: -apple-system,SF UI Text,Arial,PingFang SC,Hiragino Sans GB,Microsoft YaHei,WenQuanYi Micro Hei,sans-serif;
    }
</style>