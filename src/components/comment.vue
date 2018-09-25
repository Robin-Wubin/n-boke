<template>
    <div class="bg-grey">
        <b-container v-if="isComment">
            <b-row>
                <b-col md="8" offset-md="2">
                    <b-form @submit="post_comment" class="comment_post_container" id="comment_form">
                        <div class="head_ico_container" @click="upload_client_user_ico_input()">
                            <img :src="form.headImg">
                            <input id="client_user_ico" type="file" style="display: none" @change="add_source"/>
                        </div>
                        <div v-if="replyObj" class="head_reply_ico_container">
                            <i class="fa fa-reply"></i>
                            <i class="fa fa-times" @click="cancel_reply"></i>
                            <img :src="replyObj.headImg">
                        </div>
                        <b-row class="comment_info">
                            <b-col md="4">
                                <b-form-input id="exampleInput1"
                                              size="sm"
                                              type="text"
                                              v-model="form.name"
                                              required
                                              placeholder="Enter name">
                                </b-form-input>
                            </b-col>
                            <b-col md="4">
                                <b-form-input id="exampleInput2"
                                              size="sm"
                                              type="email"
                                              v-model="form.email"
                                              required
                                              placeholder="Enter email">
                                </b-form-input>
                            </b-col>
                            <b-col md="4">
                                <b-form-input id="exampleInput3"
                                              size="sm"
                                              type="text"
                                              v-model="form.site"
                                              placeholder="Enter site">
                                </b-form-input>
                            </b-col>
                        </b-row>
                        <div class="comment_info">
                            <b-form-textarea id="textarea1"
                                             size="sm"
                                             v-model="form.comment"
                                             placeholder="Enter something"
                                             required
                                             :rows="3"
                                             :max-rows="6">
                            </b-form-textarea>
                        </div>
                        <div style="height: 31px; margin-top: 4px">
                            <b-button type="submit" variant="secondary" size="sm" class="float-right">Submit</b-button>
                        </div>
                    </b-form>
                </b-col>
            </b-row>
            <b-row>
                <b-col md="8" offset-md="2">
                    <ol class="comment-list">
                        <li class="comment-body comment-parent comment-odd" v-for="(item, index) of commentList" :key="index">
                            <div :class="item.del ? 'is_delete':''"><div :id="item._id" class="comment-view" onclick="">
                                <div class="comment-header" v-if="!item.del">
                                    <img class="avatar" :src="item.headImg" width="80" height="80">
                                    <span class="comment-author"><a :href="item.site && setting.comment.display.isIndex ? item.site:'javascript:void(0);'" :rel="setting.comment.display.isNoFollow ? 'external nofollow' : 'external'">{{item.name}}</a></span>
                                </div>
                                <div class="comment-content" v-html="item.comment"></div>
                                <div class="comment-meta">
                                    <time class="comment-time">
                                        {{item.time | formatTime("YMDHMS")}}
                                    </time>
                                    <span v-if="!item.del" class="comment-reply"><a href="javascript:void(0);" @click="reply(item)">Reply <i class="fa fa-reply"></i> </a></span>
                                </div>
                            </div></div>
                            <div class="comment-children" v-if="item.children && item.children.length > 0">
                                <ol class="comment-list">
                                    <li v-for="(child,index) of item.children" :key="index" class="comment-body comment-child comment-level-odd comment-odd">
                                        <div :class="child.del ? 'is_delete':''">
                                            <div :id="child._id" class="comment-view" onclick="">
                                                <div class="comment-header" v-if="!child.del">
                                                    <img class="avatar" :src="child.headImg" width="80" height="80">
                                                    <span class="comment-author"><a :href="child.site ? child.site:'javascript:void(0);'">{{child.name}}</a></span>
                                                </div>
                                                <div class="comment-content">
                                                    <span class="comment-author-at" v-if="!child.del"><a href="javascript:void(0);" @click="scrollToId(child.reply.toId)">@{{child.reply.toName}}</a></span>
                                                    <div v-html="child.comment"></div>
                                                </div>
                                                <div class="comment-meta">
                                                    <time class="comment-time">
                                                        {{child.time | formatTime("YMDHMS")}}
                                                    </time>
                                                    <span v-if="!child.del" class="comment-reply"><a href="javascript:void(0);" @click="reply(child)">Reply <i class="fa fa-reply"></i> </a></span></div>
                                            </div>
                                        </div>
                                    </li>
                                </ol>
                            </div>
                        </li>
                    </ol>
                    <b-pagination size="sm" align="center" :total-rows="totalNum" v-model="page" :per-page="10" @change="getComment" class="mt-4">
                    </b-pagination>
                </b-col>
            </b-row>
        </b-container>
        <b-container v-if="!isComment">
            <b-row>
                <b-col md="8" offset-md="2">
                    <div class="comment_post_container comment_close">
                        评论已关闭
                    </div>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
    import { mapActions } from 'vuex'
    export default {
        name: "comment",
        props: {
            id: {
                type: String ,
                required: true
            },
            isComment: {
                type: Boolean ,
                default: false
            },
            setting:{
                type: Object ,
                required: true
            }
        },
        data(){
            console.log(this.id, this.setting);
            return {
                form:{
                    headImg:"/upload/ico/head.png"
                },
                page: 1,
                totalNum: 1,
                commentList: [],
                replyObj: null
            }
        },
        methods:{
            ...mapActions({
                set_client_info:"setClientInfo"
            }),
            onSubmit(){},
            upload_client_user_ico_input(){
                document.querySelector("#client_user_ico").click()
            },
            add_source(event){
                let that = this, typeName, sizeLimit, sizeName, url;
                let img1=event.target.files[0];
                let type=img1.type;//文件的类型，判断是否是图片
                let size=img1.size;//文件的大小，判断图片的大小
                typeName = '图片';
                sizeLimit = 3145728;
                sizeName = "3M";
                url = "/api/blog/comment/upload/image";

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
                    if(response.data.code === "0000"){
                        that.form.headImg = response.data.data;
                    } else {
                        return that.$eventHub.$emit('alert', {
                            type:"warning"
                            , message:response.data.msgCN
                        });
                    }
                }).catch(error => {
                    return that.$eventHub.$emit('alert', {
                        type:"warning"
                        , message:"上传" + typeName + "出错!"
                    });
                })
            },
            post_comment(evt){
                evt.preventDefault();
                let that = this;
                let userInfo = Object.assign({}, this.form);
                userInfo.comment && delete userInfo.comment;
                userInfo.reply && delete userInfo.reply;
                this.set_client_info(userInfo);
                if(this.replyObj){
                    this.form.reply = this.replyObj;
                } else {
                    this.form.reply && delete this.form.reply;
                }
                this.axios.post('/api/blog/comment/new?id=' + this.id, this.form).then(res=>{
                    that.form.comment = "";
                    delete that.form.reply;
                    that.replyObj = null;
                    that.getComment(that.page);
                }).catch(res=>{
                    console.error(res);
                });
            },
            getComment(page){
                let that = this;
                this.page = page;
                this.axios.get('/api/blog/comment/list?id=' + this.id + '&page=' + this.page).then(res=>{
                    that.commentList = res.data.data.list;
                    that.totalNum = res.data.data.totalNum;
                }).catch(res=>{
                    console.error(res);
                });

            },
            reply(item){
                this.replyObj = item;
                let scrollTop = document.documentElement.scrollTop + document.getElementById("comment_form").getBoundingClientRect().top - 100;
                window.scrollTo(0, scrollTop);
            },
            scrollToId(id){
                let scrollTop = document.documentElement.scrollTop + document.getElementById(id).getBoundingClientRect().top - 100;
                window.scrollTo(0, scrollTop);
                document.getElementById(id).setAttribute("class","comment-view comment-tips");
                setTimeout(()=>{
                    document.getElementById(id).setAttribute("class","comment-view");
                }, 3000)
            },
            cancel_reply(){
                this.replyObj = null;
            }
        },
        mounted(){
            let client_info = this.$store.getters.getClientInfo;
            if(client_info) for(let key in client_info) this.form[key] = client_info[key];
            this.getComment(1);
        }
    }
</script>

<style scoped>
    .comment_post_container{
        margin: 80px 0 40px;
        padding: 35px 20px 10px;
        border-radius: 3px;
        background: #fff;
        -webkit-box-shadow: 0 1px 4px rgba(0,0,0,.04);
        box-shadow: 0 1px 4px rgba(0,0,0,.04);
        position: relative;
    }
    .comment_close{
        margin: 40px 0;
        padding: 35px 20px;
        font-size: 14px;
        text-align: center;
    }
    .comment_info.row{
        margin-left: 0;
        margin-right: 0;
    }
    .comment_info>div{
        padding-left: 0;
        padding-right: 0;
    }
    .comment_info input{
        border: none;
        border-bottom: 1px dashed #ddd;
        border-radius: 0;
    }
    .comment_info>textarea{
        border: none;
        border-radius: 0;
    }
    .comment_info input:focus {
         border-color: #eb5055;
         box-shadow: none;
         outline: 0
     }
    .comment_info>textarea:focus{
        outline: 0;
        box-shadow: none;
    }
    .comment_info>.btn{
        align-self: right;
    }
    .head_ico_container, .head_reply_ico_container{
        height: 50px;
        width: 50px;
        border-radius: 3px;
        background: #fff;
        -webkit-box-shadow: 0 1px 4px rgba(0,0,0,0.1);
        box-shadow: 0 1px 4px rgba(0,0,0,0.1);
        position: absolute;
        top: -25px;
        left: 50%;
        margin-left: -25px;
        overflow: hidden;
        cursor: pointer;
    }
    .head_reply_ico_container {
        left: 100%;
        margin-left: -50px;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
        transform: rotate(15deg) translate(0, -5px);
        -webkit-transform: rotate(15deg) translate(0, -5px);
        -ms-transform: rotate(15deg)  translate(0, -5px);
        overflow: visible;
        border-radius: 50%;
    }
    .head_reply_ico_container img{
        border-radius: 50%;
    }
    .head_reply_ico_container i.fa-reply{
        position: absolute;
        left: 50%;
        margin-left: -15px;
        bottom: -7px;
        color: #eb5055ab;
        transform: rotate(90deg);
        -webkit-transform: rotate(90deg);
        -ms-transform: rotate(90deg);
        text-shadow: 0 1px #FFF, 1px 0 #FFF, -1px 0 #FFF, 0 -1px #FFF;
        display: block;
    }
    .head_reply_ico_container i.fa-times{
        position: absolute;
        right: 0;
        color: #eb5055;
        transform: rotate(90deg);
        -webkit-transform: rotate(90deg);
        -ms-transform: rotate(90deg);
        text-shadow: 0 1px #FFF, 1px 0 #FFF, -1px 0 #FFF, 0 -1px #FFF;
        display: none;
    }
    .head_reply_ico_container:hover  i.fa-times{
        display: block;
    }
    .head_reply_ico_container:hover  i.fa-reply{
        display: none;
    }
    .head_ico_container>img, .head_reply_ico_container>img{
        height: 50px;
    }
    .comment-list {
        margin: 0;
        padding-left: 0;
        list-style-type: none;
    }
    .comment-parent:first-child {
        margin: 0;
    }
    .comment-parent {
        margin: 20px 0;
        border: 1px solid rgba(184,197,214,.2);
        border-radius: 3px;
        background: #fff;
        -webkit-box-shadow: 0 1px 4px rgba(0,0,0,.04);
        box-shadow: 0 1px 4px rgba(0,0,0,.04);
    }
    .comment-view {
        padding: 20px;
        cursor: pointer;
    }
    .comment-header {
        display: inline-block;
        width: 100%;
    }
    .comment-header .avatar {
        display: inline-block;
        float: left;
        width: 40px;
        height: 40px;
        border: 1px solid #eaeaea;
        border-radius: 3px;
        background: #FFF;
    }
    .comment-header .comment-author {
        font-size: 13px;
        line-height: 45px;
        display: inline-block;
        float: left;
        margin: 0 20px;
    }
    .comment-content {
        margin-bottom: 10px;
        color: #313131;
        font-size: 14px;
        line-height: 28px;
    }
    .comment-meta {
        font-size: 12px;
    }
    .comment-meta .comment-time{
        color: #b4b4b4;
    }
    .comment-meta .comment-reply {
        display: none;
        float: right;
    }
    .comment-meta .comment-reply a {
        color: #eb5055!important
    }
    .comment-view:hover .comment-meta .comment-reply {
        display: block
    }
    .comment-child {
        border-top: 1px solid rgba(184,197,214,.2);
    }
    .comment-parent>.comment-children .comment-author-at {
        float: left;
        margin-right: 5px;
    }
    .comment-parent>.comment-children .comment-author-at>a{
        color: #fd7e14;
        font-size: 12px;
        opacity: 0.5;
    }
    .comment-parent>.comment-children .comment-author-at>a:hover{
        opacity: 1;
    }
    .comment-tips{
        animation:commentFade 1s infinite;
    }
    .comment-delete{
        color: #c7c7c7;
        display: block;
        text-align: center;
    }
    @keyframes commentFade
    {
        0% {background: rgba(229, 246, 255, 0);}
        10% {background: rgba(229, 246, 255, 0.2);}
        20% {background: rgba(229, 246, 255, 0.4);}
        30% {background: rgba(229, 246, 255, 0.6);}
        40% {background: rgba(229, 246, 255, 0.8);}
        50% {background: rgb(229, 246, 255);}
        60% {background: rgba(229, 246, 255, 0.8);}
        70% {background: rgba(229, 246, 255, 0.6);}
        80% {background: rgba(229, 246, 255, 0.4);}
        90% {background: rgba(229, 246, 255, 0.2);}
        100% {background: rgba(229, 246, 255, 0);}
    }
    .is_delete{
        background: #cccccc3b;
    }
</style>