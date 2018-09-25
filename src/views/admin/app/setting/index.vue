<template>
    <div class="main_container">
        <b-breadcrumb class="bread_head" :items="breadcrumb"/>

        <loading ref="load"></loading>
        <b-container v-if="!loading">
            <b-row>
                <b-col class="header">基本设置</b-col>
            </b-row>
            <b-row class="option">
                <b-col lg="3">站点名称</b-col>
                <b-col lg="9">
                    <b-form-input size="sm" v-model="basic.name" type="text" placeholder="Enter your website name"></b-form-input>
                </b-col>
            </b-row>
            <b-row class="tips mb-2">
                <b-col lg="9" offset-lg="3">
                    站点的名称将显示在网页的标题处。
                </b-col>
            </b-row>
            <b-row class="option">
                <b-col lg="3">站点地址</b-col>
                <b-col lg="9">
                    <b-form-input size="sm" v-model="basic.host" type="text" placeholder="Enter your web host"></b-form-input>
                </b-col>
            </b-row>
            <b-row class="tips mb-2">
                <b-col lg="9" offset-lg="3">
                    站点地址主要用于生成内容的永久链接。
                </b-col>
            </b-row>
            <b-row class="option">
                <b-col lg="3">站点描述</b-col>
                <b-col lg="9">
                    <b-form-input size="sm" v-model="basic.desc" type="text" placeholder="Enter your web description"></b-form-input>
                </b-col>
            </b-row>
            <b-row class="tips mb-2">
                <b-col lg="9" offset-lg="3">
                    站点描述将显示在网页代码的头部。
                </b-col>
            </b-row>
            <b-row class="option">
                <b-col lg="3">关键词</b-col>
                <b-col lg="9">
                    <b-form-input size="sm" v-model="basic.keyword" type="text" placeholder="Enter your web keyword"></b-form-input>
                </b-col>
            </b-row>
            <b-row class="tips mb-2">
                <b-col lg="9" offset-lg="3">
                    请以半角逗号“,”分割多个关键字。
                </b-col>
            </b-row>
            <b-row>
                <b-col class="header">评论设置</b-col>
            </b-row>
            <b-row class="option">
                <b-col lg="3">评论日期格式</b-col>
                <b-col lg="9">
                    <b-form-input size="sm" v-model="comment.dateFormat" type="text" placeholder="Enter your name"></b-form-input>
                </b-col>
            </b-row>
            <b-row class="tips mb-2">
                <b-col lg="9" offset-lg="3">
                    这是一个默认的格式，当你在页面中显示该评论日期时，如果没有指定日期格式，将按照此格式输出。
                </b-col>
            </b-row>
            <b-row class="option">
                <b-col lg="3">评论列表数目</b-col>
                <b-col lg="9">
                    <b-form-input size="sm" v-model="comment.list" type="text" placeholder="Enter your name"></b-form-input>
                </b-col>
            </b-row>
            <b-row class="tips mb-2">
                <b-col lg="9" offset-lg="3">
                    此数目用于指定显示在侧边栏中的评论列表数目。
                </b-col>
            </b-row>
            <b-row class="option">
                <b-col lg="3">评论显示</b-col>
                <b-col lg="9">
                    <b-container>
                        <b-row class="mb-1">
                            <b-form-checkbox id="input-display-is_index" v-model="comment.display.isIndex" :value="true" :unchecked-value="false">
                                评论者名称显示时自动加上其个人主页链接
                            </b-form-checkbox>
                        </b-row>
                        <b-row class="mb-1">
                            <b-form-checkbox id="input-display-is_nofollow" v-model="comment.display.isNoFollow" :value="true" :unchecked-value="false">
                                对评论者个人主页链接使用 nofollow 属性
                            </b-form-checkbox>
                        </b-row>
                        <b-row class="mb-1">
                            <b-form-checkbox id="input-display-pagination-is" v-model="comment.display.pagination.is" :value="true" :unchecked-value="false">
                                启用分页，并且每页显示
                                <b-form-input size="sm" v-model="comment.display.pagination.num" type="text" placeholder="Enter your name" style="display: inline-block;width: 50px;"></b-form-input>
                                篇评论，在列出时将
                                <b-form-input size="sm" v-model="comment.display.pagination.type" type="text" placeholder="Enter your name" style="display: inline-block;width: 50px;"></b-form-input>
                                作为默认显示
                            </b-form-checkbox>
                        </b-row>
                        <b-row class="mb-1">
                            <b-form-checkbox id="input-display-reply-is" v-model="comment.display.reply.is" :value="true" :unchecked-value="false">
                                启用评论回复，以
                                <b-form-input size="sm" v-model="comment.display.reply.num" type="text" placeholder="Enter your name" style="display: inline-block;width: 50px;"></b-form-input>
                                层作为每个评论最多的回复层数，将
                                <b-form-input size="sm" v-model="comment.display.reply.type" type="text" placeholder="Enter your name" style="display: inline-block;width: 50px;"></b-form-input>
                                评论显示在前面
                            </b-form-checkbox>
                        </b-row>
                    </b-container>
                </b-col>
            </b-row>
            <b-row class="option">
                <b-col lg="3">评论提交</b-col>
                <b-col lg="9">
                    <b-container>
                        <b-row class="mb-1">
                            <b-form-checkbox id="input-submit-apply" v-model="comment.submit.apply" :value="true" :unchecked-value="false">
                                所有评论必须经过审核
                            </b-form-checkbox>
                        </b-row>
                        <b-row class="mb-1">
                            <b-form-checkbox id="input-submit-email" v-model="comment.submit.email" :value="true" :unchecked-value="false">
                                必须填写邮箱
                            </b-form-checkbox>
                        </b-row>
                        <b-row class="mb-1">
                            <b-form-checkbox id="input-submit-website" v-model="comment.submit.website" :value="true" :unchecked-value="false">
                                必须填写网址
                            </b-form-checkbox>
                        </b-row>
                        <b-row class="mb-1">
                            <b-form-checkbox id="input-submit-check-refer" v-model="comment.submit.checkRefer" :value="true" :unchecked-value="false">
                                检查评论来源页URL是否与文章链接一致
                            </b-form-checkbox>
                        </b-row>
                        <b-row class="mb-1">
                            <b-form-checkbox id="input-submit-disable-is" v-model="comment.submit.disable.is" :value="true" :unchecked-value="false">
                                在文章发布
                                <b-form-input size="sm" v-model="comment.submit.disable.day" type="text" placeholder="Enter your name" style="display: inline-block;width: 50px;"></b-form-input>
                                天以后自动关闭评论
                            </b-form-checkbox>
                        </b-row>
                        <b-row class="mb-1">
                            <b-form-checkbox id="input-submit-ip-limited-is" v-model="comment.submit.ipLimited.is" :value="true" :unchecked-value="false">
                                同一IP发布评论的时间间隔限制为
                                <b-form-input size="sm" v-model="comment.submit.ipLimited.min" type="text" placeholder="Enter your name" style="display: inline-block;width: 50px;"></b-form-input>
                                分钟
                            </b-form-checkbox>
                        </b-row>
                    </b-container>
                </b-col>
            </b-row>
            <b-row>
                <b-col class="header">阅读设置</b-col>
            </b-row>
            <b-row class="option">
                <b-col lg="3">文章日期格式</b-col>
                <b-col lg="9">
                    <b-form-input size="sm" v-model="read.dateFormat" type="text" placeholder="Enter your name"></b-form-input>
                </b-col>
            </b-row>
            <b-row class="tips mb-2">
                <b-col lg="9" offset-lg="3">
                    此格式用于指定显示在文章归档中的日期默认显示格式。
                </b-col>
            </b-row>
            <b-row class="option">
                <b-col lg="3">文章列表数目</b-col>
                <b-col lg="9">
                    <b-form-input size="sm" v-model="read.recommendNum" type="text" placeholder="Enter your name"></b-form-input>
                </b-col>
            </b-row>
            <b-row class="tips mb-2">
                <b-col lg="9" offset-lg="3">
                    此数目用于指定显示在侧边栏中的文章列表数目
                </b-col>
            </b-row>
            <b-row class="option">
                <b-col lg="3">每页文章数目</b-col>
                <b-col lg="9">
                    <b-form-input size="sm" v-model="read.perPage" type="text" placeholder="Enter your name"></b-form-input>
                </b-col>
            </b-row>
            <b-row class="tips mb-2">
                <b-col lg="9" offset-lg="3">
                    此数目用于指定文章归档输出时每页显示的文章数目
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
    import loading from '../../../../components/Loading.vue'
    export default {
        name: "index",
        components: {
            loading
        },
        data () {
            return {
                breadcrumb: [{
                    text: 'Setting',
                    href: '/admin/app/setting'
                }],
                loading: true,
                basic:null,
                comment:null,
                read:null
            }
        },
        methods:{
            getSetting(){
                let that = this;
                this.loading = true;
                this.axios.get("/api/admin/setting/info").then(res=>{
                    if(res.data.code === "0000"){
                        that.$refs.load && that.$refs.load.finished();
                        that.loading= false;
                        that.basic = res.data.data.basic;
                        that.comment = res.data.data.comment;
                        that.read = res.data.data.read;
                        // console.log(res.data);
                    } else {
                        console.error(res);
                    }
                }).catch(res=>{
                    console.error(res);
                });
            }
        },
        mounted(){
            this.getSetting();
        }
    }
</script>

<style scoped>
    .container {
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
    }
.header{
    background: rgba(0,0,0,0.13);
    border-left: 5px solid #313131;
    padding: 5px 15px;
    color: #313131;
    font-size: 14px;
}
    .option{
        font-size: 14px;
        padding: 15px 15px 5px;
        line-height: 31px;
    }
    .tips{
        color: #c1c1c1;
        font-size: 12px;
    }
    .tips>div{
        padding-left: 25px;
    }
</style>