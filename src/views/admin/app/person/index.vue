<template>
    <div class="main_container">
        <b-breadcrumb class="bread_head" :items="breadcrumb"/>
        <loading ref="load"></loading>
        <b-container v-if="!loading">
            <b-row>
                <b-col class="header">基本信息</b-col>
            </b-row>
            <b-row>
                <b-container>
                    <b-row>
                        <b-col lg="8">
                            <b-row class="option">
                                <b-col lg="3">昵称</b-col>
                                <b-col lg="9">
                                    <b-form-input size="sm" v-model="basic.nickname" type="text" placeholder="Enter your nick name"></b-form-input>
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
                                                     v-model="basic.brief"
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
                                    <b-form-input size="sm" v-model="basic.motto" type="text" placeholder="Enter your motto"></b-form-input>
                                </b-col>
                            </b-row>
                            <b-row class="tips mb-2">
                                <b-col lg="9" offset-lg="3">
                                    激励、警戒自己，作为行动指南的格言。
                                </b-col>
                            </b-row>
                        </b-col>
                        <b-col lg="4">
                            <b-row class="option">
                                <b-col>头像</b-col>
                            </b-row>
                            <b-row class="avatar">
                                <img :src="basic.ico ? basic.ico : '/avatar.png'" height="125" width="125" class="mb-2">
                                <b-btn size="sm" variant="primary" @click="clickUploadICOBtn()">上传头像</b-btn>
                                <input id="uploadICO" class="uploadQRImage" @change='uploadICO'  type="file" accept="image/*">
                            </b-row>
                        </b-col>
                    </b-row>
                </b-container>
            </b-row>

            <b-row>
                <b-col class="header">个人信息</b-col>
            </b-row>
            <b-row class="option">
                <b-col lg="3">姓名</b-col>
                <b-col lg="9">
                    <b-form-input size="sm" v-model="basic.name" type="text" placeholder="Enter your name"></b-form-input>
                </b-col>
            </b-row>
            <b-row class="option">
                <b-col lg="3">性别</b-col>
                <b-col lg="9">
                        <b-form-radio-group id="genders" v-model="basic.gender" :options="gender" name="genderOpenions"></b-form-radio-group>
                </b-col>
            </b-row>
            <b-row class="option">
                <b-col lg="3">出生日期</b-col>
                <b-col lg="9">
                    <b-form-input size="sm" v-model="basic.birthday" type="text" placeholder="Enter your birthday, exp: '2017-10-01'"></b-form-input>
                </b-col>
            </b-row>
            <b-row class="option">
                <b-col lg="3">电话</b-col>
                <b-col lg="9">
                    <b-form-input size="sm" v-model="basic.tel" type="text" placeholder="Enter your tel number"></b-form-input>
                </b-col>
            </b-row>
            <b-row class="option">
                <b-col lg="3">联系地址</b-col>
                <b-col lg="9">
                    <b-form-input size="sm" v-model="basic.address" type="text" placeholder="Enter your address"></b-form-input>
                </b-col>
            </b-row>
            <b-row>
                <b-col class="header">社交信息</b-col>
            </b-row>
            <b-row class="option">
                <b-col class="ico_for_choose">
                    <b-button class="mr-2 font28 mb-2" size="sm" v-for="(item, index) of socials" :key="index" :variant="typeof basic.social[item.simple] !== 'undefined' ? 'success' : 'secondary'" @click="setInput(item)" v-b-tooltip.hover :title="item.text">
                        <i :class="item.value"></i>
                    </b-button>
                </b-col>
            </b-row>
            <b-row class="option" v-for="item in basic.social" :key="item.name">
                <b-col>
                    <b-input-group>
                        <b-input-group-prepend is-text>
                            <i :class="item.style"></i>
                        </b-input-group-prepend>
                        <b-form-input size="sm" v-model="basic.social[item.name].url" type="text" :placeholder="'Enter your ' + item.text"></b-form-input>
                        <b-input-group-append v-if="item.type === 'image'">
                            <b-btn size="sm" variant="primary" @click="clickUploadQRImageBtn(item.name)">选择二维码</b-btn>
                            <input id="uploadQRImage" class="uploadQRImage" @change='uploadQRImage'  type="file" accept="image/*">
                        </b-input-group-append>
                    </b-input-group>
                </b-col>
            </b-row>
            <b-row class="mt-3 submit">
                <b-col lg="9" offset-lg="3">
                    <b-button size="sm" variant="primary" class="float-right" @click="saveSetting">
                        保存
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
                    social:{}
                },
                uploadSimple: null,
                socials:[
                    {value:"fa fa-weibo", text:"微博", simple:"weibo", value_type:"url"},
                    {value:"icon-zhihu-square-fill", text:"知乎", simple:"zhihu", value_type:"url"},
                    {value:"fa fa-github", text:"GitHub", simple:"github", value_type:"url"},
                    {value:"fa fa-facebook-square", text:"Facebook", simple:"facebook", value_type:"url"},
                    {value:"fa fa-google-plus-square", text:"Google+", simple:"googleplus", value_type:"url"},
                    {value:"fa fa-instagram", text:"Instagram", simple:"instagram", value_type:"url"},
                    {value:"fa fa-linkedin-square", text:"LinkedIn", simple:"linkedin", value_type:"url"},
                    {value:"fa fa-qq", text:"QQ", simple:"qq", value_type:"text"},
                    {value:"fa fa-weixin", text:"微信", simple:"weixin", value_type:"image"},
                    {value:"fa fa-reddit-square", text:"Reddit", simple:"reddit", value_type:"url"},
                    {value:"fa fa-renren", text:"人人", simple:"renren", value_type:"url"},
                    {value:"fa fa-twitter-square", text:"Twitter", simple:"twitter", value_type:"url"},
                ],
                gender: [
                    { text: '男', value: 1 },
                    { text: '女', value: 0 }
                ]
            }
        },
        methods:{
            getSetting(){
                let that = this;
                this.loading = true;
                that.$refs.load && that.$refs.load.start();
                this.axios.get("/api/admin/setting/userInfo").then(res=>{
                    if(res.data.code === "0000"){
                        that.$refs.load && that.$refs.load.finished();
                        that.loading= false;
                        that.basic = res.data.data.userInfo;
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
                this.axios.post("/api/admin/setting/userInfo", that.basic).then(res=>{
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
                console.log(this);
                if(typeof this.basic.social[type.simple] !== 'undefined' && this.basic.social[type.simple] !== null){
                    this.$delete(this.basic.social,type.simple);
                } else {
                    this.$set(this.basic.social,type.simple,{
                        name: type.simple,
                        style: type.value,
                        text: type.text,
                        type: type.value_type,
                        url: ""
                    });
                }
            },
            clickUploadQRImageBtn(simple){
                this.uploadSimple = simple;
                document.getElementById('uploadQRImage').click();
            },
            clickUploadICOBtn(){
                document.getElementById('uploadICO').click();
                },
            uploadQRImage(event){
                let that = this, typeName, sizeLimit, sizeName, url;
                let img1=event.target.files[0];
                let type=img1.type;//文件的类型，判断是否是图片
                let size=img1.size;//文件的大小，判断图片的大小

                typeName = '图片';
                sizeLimit = 3145728;
                sizeName = "3M";
                url = "/api/admin/article/upload/image";
                if('image/gif, image/jpeg, image/png, image/jpg'.indexOf(type) === -1){
                    return that.$eventHub.$emit('alert', {
                        type:"warning"
                        , message:"请选择我们支持的" + typeName + "格式!"
                    });
                }
                if(size>sizeLimit){
                    return that.$eventHub.$emit('alert', {
                        type:"warning"
                        , message:"请选择" + sizeName + "以内的" + typeName + "!"
                    });
                }
                let form = new FormData();
                form.append('file',img1,img1.name);
                this.axios.post(url,form,{
                    headers:{'Content-Type':'multipart/form-data'}
                }).then(response => {
                    that.$set(that.basic.social[that.uploadSimple],"url",response.data.data);
                }).catch(error => {
                    return that.$eventHub.$emit('alert', {
                        type:"warning"
                        , message:"上传" + typeName + "出错!"
                    });
                })
            },
            uploadICO(event){
                let that = this, typeName, sizeLimit, sizeName, url;
                let img1=event.target.files[0];
                let type=img1.type;//文件的类型，判断是否是图片
                let size=img1.size;//文件的大小，判断图片的大小

                typeName = '图片';
                sizeLimit = 3145728;
                sizeName = "3M";
                url = "/api/admin/article/upload/image";
                if('image/gif, image/jpeg, image/png, image/jpg'.indexOf(type) === -1){
                    return that.$eventHub.$emit('alert', {
                        type:"warning"
                        , message:"请选择我们支持的" + typeName + "格式!"
                    });
                }
                if(size>sizeLimit){
                    return that.$eventHub.$emit('alert', {
                        type:"warning"
                        , message:"请选择" + sizeName + "以内的" + typeName + "!"
                    });
                }
                let form = new FormData();
                form.append('file',img1,img1.name);
                this.axios.post(url,form,{
                    headers:{'Content-Type':'multipart/form-data'}
                }).then(response => {
                    that.$set(that.basic,"ico",response.data.data);
                }).catch(error => {
                    return that.$eventHub.$emit('alert', {
                        type:"warning"
                        , message:"上传" + typeName + "出错!"
                    });
                })
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

    .uploadQRImage{
        display: none;
    }
    .avatar{
        justify-content: center;
        flex-direction: column;
        align-items: center;
    }
</style>