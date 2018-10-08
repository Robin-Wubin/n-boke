<template>
    <div class="main_container">
        <b-breadcrumb class="bread_head" :items="breadcrumb"/>
        <loading ref="load"></loading>
        <b-container v-if="!loading">
            <b-row>
                <b-col class="header">基本信息</b-col>
            </b-row>
            <b-row class="option">
                <b-col lg="3">昵称</b-col>
                <b-col lg="9">
                    <b-form-input size="sm" v-model="basic.name" type="text" placeholder="Enter your website name"></b-form-input>
                </b-col>
            </b-row>
            <b-row class="tips mb-2">
                <b-col lg="9" offset-lg="3">
                    在网站回复用户留言时会显示的昵称。
                </b-col>
            </b-row>
            <b-row class="option">
                <b-col lg="3">个人简介</b-col>
                <b-col lg="9">
                    <b-form-textarea id="textarea1"
                                     size="sm"
                                     v-model="basic.desc"
                                     placeholder="Enter something"
                                     :rows="3"
                                     :max-rows="6">
                    </b-form-textarea>
                </b-col>
            </b-row>
            <b-row class="tips mb-2">
                <b-col lg="9" offset-lg="3">
                    简要介绍你自己。
                </b-col>
            </b-row>
            <b-row class="option">
                <b-col lg="3">座右铭</b-col>
                <b-col lg="9">
                    <b-form-input size="sm" v-model="basic.keyword" type="text" placeholder="Enter your web keyword"></b-form-input>
                </b-col>
            </b-row>
            <b-row class="tips mb-2">
                <b-col lg="9" offset-lg="3">
                    激励、警戒自己，作为行动指南的格言。
                </b-col>
            </b-row>
            <b-row>
                <b-col class="header">个人信息</b-col>
            </b-row>
            <b-row class="option">
                <b-col lg="3">姓名</b-col>
                <b-col lg="9">
                    <b-form-input size="sm" v-model="basic.host" type="text" placeholder="Enter your web host"></b-form-input>
                </b-col>
            </b-row>
            <b-row class="option">
                <b-col lg="3">性别</b-col>
                <b-col lg="9">
                    <b-form-input size="sm" v-model="basic.host" type="text" placeholder="Enter your web host"></b-form-input>
                </b-col>
            </b-row>
            <b-row class="option">
                <b-col lg="3">出生日期</b-col>
                <b-col lg="9">
                    <b-form-input size="sm" v-model="basic.host" type="text" placeholder="Enter your web host"></b-form-input>
                </b-col>
            </b-row>
            <b-row class="option">
                <b-col lg="3">邮编</b-col>
                <b-col lg="9">
                    <b-form-input size="sm" v-model="basic.host" type="text" placeholder="Enter your web host"></b-form-input>
                </b-col>
            </b-row>
            <b-row class="option">
                <b-col lg="3">电话</b-col>
                <b-col lg="9">
                    <b-form-input size="sm" v-model="basic.host" type="text" placeholder="Enter your web host"></b-form-input>
                </b-col>
            </b-row>
            <b-row class="option">
                <b-col lg="3">联系地址</b-col>
                <b-col lg="9">
                    <b-form-input size="sm" v-model="basic.host" type="text" placeholder="Enter your web host"></b-form-input>
                </b-col>
            </b-row>
            <b-row>
                <b-col class="header">社交信息</b-col>
            </b-row>
            <b-row class="option">
                <b-col class="ico_for_choose">
                    <b-button class="mr-2 font28 mb-2" size="sm" v-for="(item, index) of socials" :key="index" :variant="typeof basic.social[item.simple] !== 'undefined' ? 'outline-secondary' : 'secondary'" @click="setInput(item.simple)">
                        <i :class="item.value"></i>
                    </b-button>
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
                    text: 'Person',
                    href: '/admin/app/person'
                }],
                loading: true,
                basic: {
                    social:{
                        reddit:""
                    }
                },
                socials:[
                    {value:"fa fa-weibo", text:"微博", simple:"weibo", value_type:"url"},
                    {value:"icon-zhihu-square-fill", text:"知乎", simple:"zhihu", value_type:"url"},
                    {value:"fa fa-github", text:"GitHub", simple:"github", value_type:"url"},
                    {value:"fa fa-facebook-square", text:"FaceBook", simple:"facebook", value_type:"url"},
                    {value:"fa fa-google-plus-square", text:"Google+", simple:"googleplus", value_type:"url"},
                    {value:"fa fa-instagram", text:"Instagram", simple:"instagram", value_type:"url"},
                    {value:"fa fa-linkedin-square", text:"LinkedIn", simple:"linkedin", value_type:"url"},
                    {value:"fa fa-qq", text:"QQ", simple:"qq", value_type:"url"},
                    {value:"fa fa-weixin", text:"WeiXin", simple:"weixin", value_type:"image"},
                    {value:"fa fa-reddit-square", text:"Reddit", simple:"reddit", value_type:"url"},
                    {value:"fa fa-renren", text:"人人", simple:"renren", value_type:"url"},
                    {value:"fa fa-twitter-square", text:"Twitter", simple:"twitter", value_type:"url"},
                ],
            }
        },
        methods:{
            getSetting(){
                let that = this;
                this.loading = true;
                that.$refs.load && that.$refs.load.start();
                this.axios.get("/api/admin/setting/info").then(res=>{
                    if(res.data.code === "0000"){
                        that.$refs.load && that.$refs.load.finished();
                        that.loading= false;
                        // that.basic = res.data.data.basic;
                        that.comment = res.data.data.comment;
                        that.read = res.data.data.read;
                        // console.log(res.data);
                    } else {
                        console.error(res);
                    }
                }).catch(res=>{
                    console.error(res);
                });
            },
            saveSetting(){
                let that = this;
                this.loading = true;
                that.$refs.load && that.$refs.load.start();
                this.axios.post("/api/admin/setting/info", {
                    basic: that.basic,
                    comment: that.comment,
                    read: that.read,
                }).then(res=>{
                    if(res.data.code === "0000"){
                        that.$refs.load && that.$refs.load.finished();
                        that.loading= false;
                        // console.log(res.data);
                    } else {
                        console.error(res);
                    }
                }).catch(res=>{
                    console.error(res);
                });
            },
            setInput(type){
                this.basic.social[type] = '';
                console.log(type,this.basic);
            },
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
    .submit{
        background: #a7cdff;
        padding: 15px 0;
    }
    .font28{
        font-size: 28px;
        width: 48px;
        text-align: center;
    }
    .ico_for_choose{
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }
</style>