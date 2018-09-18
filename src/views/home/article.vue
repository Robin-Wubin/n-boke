<template>
    <div class="bg-white">
        <div class="head_image_container">
            <div :class="'head_image '+color[parseInt(Math.random()*color.length)]" :style="article.headImage ? {backgroundImage:'url(' + article.headImage.replace(/\\/g, '/') + ')'} : null"></div>
            <div class="article_head">
                <b-container>
                    <div class="title">{{article.title}}</div>
                </b-container>
            </div>
        </div>
        <b-container>
            <b-row class="ql-snow" v-if="!article.needPassword">
                <b-col md="8" offset-md="2">
                    <div class="article_content ql-editor" v-html="article.content"></div>
                </b-col>
            </b-row>
        </b-container>

        <div class="bg-grey need_password_container" v-if="article.needPassword">
            <b-container>
                <b-row class="need_password">
                    <b-col md="8" offset-md="2">
                        <b-row class="mb-5">
                            <b-col>
                                {{article.brief}}
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col sm="9" offset-sm="3">
                                <small class="text-muted">* 这篇文章被博主设置为加密访问，你可以联系博主索要密码。</small>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col sm="3"><label for="input-password">浏览密码:</label></b-col>
                            <b-col sm="9">
                                <b-form-input size="sm" id="input-password" :state="null" type="text" placeholder="输入浏览密码" v-model="password"></b-form-input>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col sm="9" offset-sm="3">
                                <b-button size="sm" variant="danger" class="float-right" @click="getArticle">
                                    确认密码
                                </b-button>
                            </b-col>
                        </b-row>
                    </b-col>
                </b-row>
            </b-container>
        </div>
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
                id: this.$route.params.id,
                password:""
            }
        },
        methods:{
            getArticle(){
                let that = this;
                this.axios.post('http://localhost:3000/api/blog/content?id=' + this.id, {
                    password: this.password
                }).then((response) => {
                    if (response.data.code === '0000') {
                        that.$store.commit('SET_BLOG_CONTENT', response.data.data);
                    } else {
                        that.$eventHub.$emit('alert', {
                            type:"warning"
                            , message:response.data.msgCN
                        });
                    }
                }).catch((error) => {
                    that.$eventHub.$emit('alert', {
                        type:"danger"
                        , message:"验证密码错误"
                    });
                    console.log(error)
                })
            }
        }
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
    .need_password_container{
        display: flex;
    }
    .need_password{
        font-size: 14px;
        line-height: 31px;
        margin: 150px 0;
    }
</style>