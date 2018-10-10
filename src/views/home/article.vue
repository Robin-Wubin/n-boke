<template>
    <div class="bg-white">
        <div class="head_image_container">
            <div :class="'head_image '+color[parseInt(Math.random()*color.length)]" :style="article.headImage ? {backgroundImage:'url(' + article.headImage.replace(/\\/g, '/') + ')'} : null"></div>
            <div class="article_head">
                <b-container>
                    <div class="title">{{article.title}}</div>

                    <b-row class="type_tag mt-3">
                        <b-col md="8" offset-md="2">
                            <b-badge pill variant="success" class="bg-yellow mr-3 mb-1">
                                <router-link :to="{ path: '/list/type/' + article.type + '/1'}"># {{article.type | getTypes(types)}}</router-link>
                            </b-badge>
                            <b-badge v-for="(item, index) of article.tags" :key="index" pill variant="success" class="bg-purple mr-3 mb-1">
                                <router-link :to="{ path: '/list/tag/' + item + '/1'}"># {{item}}</router-link>
                            </b-badge>
                        </b-col>
                    </b-row>
                </b-container>
            </div>
            <div class="article_footer">
                <b-container>
                    <b-row>
                        <b-col md="8" offset-md="2" style="text-align: right;">
                            <span class="float-left">{{article.createdAt | formatTime(setting.read.dateFormat)}}</span>
                            <span><i class="fa fa-eye "></i>&nbsp;&nbsp;{{article.count.view}}</span>
                            <span class="ml-3"><i class="fa fa-comments"></i>&nbsp;&nbsp;{{article.count.comment}}</span>
                        </b-col>
                    </b-row>
                </b-container>
            </div>
        </div>
        <b-container v-if="!article.needPassword">
            <b-row class="ql-snow">
                <b-col md="8" offset-md="2">
                    <div class="article_content ql-editor" v-html="article.content"></div>
                </b-col>
            </b-row>
        </b-container>
        <comment v-if="!article.needPassword" :id="id" :isComment="article.isComment" :setting="setting"></comment>

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
                            <b-col sm="8" offset-sm="2">
                                <div class="need_password_form">
                                    <b-row>
                                        <b-col>
                                            <small class="text-muted">* 该文章需使用密码访问，你可以向博主索要密码。</small>
                                        </b-col>
                                    </b-row>
                                    <b-row class="mb-2">
                                        <b-col>
                                            <b-form-input size="sm" id="input-password" :state="null" type="text" placeholder="输入密码访问" v-model="password"></b-form-input>
                                        </b-col>
                                    </b-row>
                                    <b-row>
                                        <b-col>
                                            <b-button size="sm" variant="danger" class="float-right" @click="getArticle">
                                                确认密码
                                            </b-button>
                                        </b-col>
                                    </b-row>
                                </div>
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
    import comment from '../../components/comment.vue'
    export default {
        name: "myArticle",
        asyncData ({ store, route}) {
            let id = route.params.id;
            console.log(id);
            return Promise.all([store.dispatch('getUserInfo'), store.dispatch('getRecentComment'), store.dispatch('getRecentPost'), store.dispatch('setTypeList'), store.dispatch('getBlogContent', id)]);
        },
        computed: {
            ...mapGetters({
                types: 'getTypeList',
                article: 'getBlogContent',
                setting: 'getSettingInfo'
            })
        },
        components: {
            comment
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
    .article_footer{
        position: relative;
        background: rgba(0, 0, 0, 0.3);
        margin-top: -25px;
        color: #fff;
        height: 25px;
        font-size: 12px;
        line-height: 25px;
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
    .need_password_form{
        padding: 10px 20px;
        border-radius: 3px;
        background: #fff;
        -webkit-box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        box-shadow: 0 1px 4px rgba(0,0,0,0.04);
    }
    .need_password_container{
        display: flex;
    }
    .need_password{
        font-size: 14px;
        line-height: 31px;
        margin: 50px 0;
    }
    .type_tag{
        width: 100%;
        border-top: 1px solid #00000036;
        padding-top: 1rem;
    }
    .type_tag .badge{
        padding: 0 15px;
        line-height: 25px;
    }
</style>