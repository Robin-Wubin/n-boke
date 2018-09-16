<template>
    <div>
        <material ref="material"></material>
        <div class="main_container">
            <b-breadcrumb class="bread_head" :items="breadcrumb"/>
            <loading ref="load"></loading>
            <div v-if="!loading">
                <b-alert :show="dismissCountDown"
                         variant="info"
                         @dismissed="dismissCountDown=0"
                         @dismiss-count-down="countDownChanged" style="font-size: 12px">
                    <i class="fa fa-info-circle"></i> 此为文章草稿，上次保存时间为：{{article.draftUpdateAt | formatTime("YMDHMS")}}
                </b-alert>
                <b-row class="new_article_row">
                    <b-col sm="2"><label for="input-title">标题:</label></b-col>
                    <b-col sm="10">
                        <b-form-input id="input-title" size="sm" v-model="article.title" type="text" placeholder="请输入文章标题" class="mb-1"></b-form-input>
                    </b-col>
                </b-row>
                <b-row class="new_article_row">
                    <b-col sm="2"><label for="input-type">类别:</label><i class="fa fa-pencil-square float-right mt-2" v-b-modal.modalForTypes></i></b-col>
                    <b-col sm="10">
                        <b-form-select id="input-type" size="sm" v-model="article.type" :options="types" class="mb-1"/>
                    </b-col>
                </b-row>
                <b-row class="new_article_row">
                    <b-col sm="2"><label for="input-tags">标签:</label></b-col>
                    <b-col sm="10">
                        <i class="fa fa-angle-left mr-2"></i>
                        <span v-for="(item, index) of article.tags" class="new_article_tag mr-2" :key="index">{{item}} <i class="fa fa-minus-square-o" @click="removeTag(index)"></i></span>
                        <i class="fa fa-plus-square mr-2" v-b-modal.modalForTags></i>
                        <i class="fa fa-angle-right"></i>
                    </b-col>
                </b-row>
                <b-row class="new_article_row">
                    <b-col sm="2"><label for="input-password">密码:</label></b-col>
                    <b-col sm="10">
                        <b-form-input id="input-password" size="sm" v-model="article.password" type="password" placeholder="如有密码，打开文章前会先验证密码" class="mb-1"></b-form-input>
                    </b-col>
                </b-row>
            </div>

            <no-ssr v-if="!loading">
                <quill-editor
                        v-model="article.content"
                        ref="myQuillEditor"
                        :options="editorOption"
                        @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                        @change="onEditorChange($event)">
                </quill-editor>
            </no-ssr>
            <div v-if="!loading">
                <b-row class="new_article_row bt-1">
                    <b-col sm="2"><label for="input-state">状态:</label></b-col>
                    <b-col sm="10">
                        <b-form-select id="input-state" size="sm" v-model="article.state" :options="states" class="mb-1"/>
                    </b-col>
                </b-row>
            </div>
            <b-modal id="modalForTags" size="sm" ref="modalForTags" title="添加标签" @ok="handleOk" @shown="clearName">
                <form @submit.stop.prevent="handleSubmit">
                    <b-form-input type="text" size="sm" placeholder="请输入要添加的标签" v-model="temp_tag"></b-form-input>
                </form>
            </b-modal>
            <b-modal id="modalForTypes" size="md" hide-footer hide-header title="类别管理" @shown="resetTypeEditor">
                <b-list-group>
                    <b-list-group-item>
                        <a href="javascript:void(0);" v-if="!typeEdit.newState" @click="newType()">
                            <i class="fa fa-plus-square"></i> 添加新类别
                        </a>
                        <div v-if="typeEdit.newState">
                            <b-input-group prepend="类别" size="sm">
                                <b-form-input v-model="typeEdit.newTypeName" placeholder="类别名"></b-form-input>
                                <b-form-input v-model="typeEdit.newTypeAlisa" placeholder="导航名（英文）"></b-form-input>
                                <b-input-group-append>
                                    <b-btn variant="outline-success" @click="actNewType"><i class="fa fa-check"></i></b-btn>
                                    <b-btn variant="info" @click="resetTypeEditor"><i class="fa fa-times"></i></b-btn>
                                </b-input-group-append>
                            </b-input-group>
                        </div>
                    </b-list-group-item>
                    <b-list-group-item v-for="(item, index) of types" v-if="index>0" class="d-flex justify-content-between align-items-center" :key="index">
                        <div v-if="typeEdit.editIndex!==index">
                            {{item.text}} <small class=" bg-secondary muted text-white pl-1 pr-1 ml-2">/{{item.alisa}}</small>
                        </div>
                        <div v-if="typeEdit.editIndex!==index">
                            <a href="javascript:void(0);" @click="typeEdit.editIndex=index;typeEdit.editTemp.text = item.text;typeEdit.editTemp.alisa = item.alisa"><i class="fa fa-pencil mr-3"  v-b-tooltip.hover title="修改"></i></a>
                            <a href="javascript:void(0);" @click="deleteType(index)"><i class="fa fa-minus-square mr-3"  v-b-tooltip.hover title="删除"></i></a>
                            <b-badge variant="primary" pill>{{item.countNum}}</b-badge>
                        </div>
                        <div v-if="typeEdit.editIndex===index">
                            <b-input-group prepend="类别" size="sm">
                                <b-form-input v-model="item.text" placeholder="类别名"></b-form-input>
                                <b-form-input v-model="item.alisa" placeholder="导航名（英文）"></b-form-input>
                                <b-input-group-append>
                                    <b-btn variant="outline-success" @click="actEditType(index)"><i class="fa fa-check"></i></b-btn>
                                    <b-btn variant="info" @click="resetTypeEditor"><i class="fa fa-times"></i></b-btn>
                                </b-input-group-append>
                            </b-input-group>
                        </div>
                    </b-list-group-item>
                </b-list-group>
            </b-modal>
        </div>

        <b-button type="submit" class="float-right" variant="success" @click="postArticle">发布</b-button>
        <b-button type="submit" class="float-right mr-2" variant="info" @click="saveDraft">保存</b-button>
        <b-button type="reset" variant="danger" class="mr-2" @click="resetDraft">重置</b-button>
        <b-button type="reset" variant="warning" @click="cancelDraft">取消</b-button>
    </div>
</template>

<script>
    import NoSSR from 'vue-no-ssr'
    import { mapGetters, mapActions } from 'vuex'
    import loading from '../../../../components/Loading.vue'
    import material from '../../../../components/material.vue'
    let quillEditor, container, ImageExtend, Quill, QuillWatch, ImageResize, ImageDrop;
    if(typeof document !== "undefined"){
        Quill = require('vue-quill-editor').Quill;
        quillEditor = require('vue-quill-editor').quillEditor;
        container = require('quill-image-extend-module').container;
        ImageExtend = require('quill-image-extend-module').ImageExtend;
        QuillWatch = require('quill-image-extend-module').QuillWatch;
        ImageResize = require('quill-image-resize-module').default;
        Quill.register('modules/ImageExtend', ImageExtend);
        Quill.register('modules/imageResize', ImageResize);
        const Image = Quill.import('formats/image');

        class VideoBlot extends Image {  // 继承Link Blot
            static create(value) {
                var node = super.create(value);
                node.setAttribute('src', this.sanitize(value));
                node.setAttribute('style', "width:100%");
                node.setAttribute('controls', "controls");
                console.log(node);
                return node;
            }
        }
        VideoBlot.blotName = 'video';
        VideoBlot.tagName = 'video';
        Quill.register(VideoBlot);
        class AudioBlot extends Image {  // 继承Link Blot
            static create(value) {
                var node = super.create(value);
                node.setAttribute('src', this.sanitize(value));
                node.setAttribute('style', "margin: auto;display: block;");
                node.setAttribute('controls', "controls");
                console.log(node);
                return node;
            }
        }
        AudioBlot.blotName = 'audio';
        AudioBlot.tagName = 'audio';
        Quill.register(AudioBlot);
    }
    export default {
        asyncData ({ store, route}) {
            return store.dispatch('setTypeList');
        },
        props: {
            id: {
                type: String,
                default: '0'
            }
        },
        computed: {
            ...mapGetters({
                types: 'getTypeList'
            })
        },
        components: {
            'no-ssr': NoSSR,
            quillEditor,
            loading,
            material
        },
        name: "new",
        data(){
            let that = this;
            console.log(this.id);
            return {
                dismissCountDown: 0,
                typeEdit:{
                    editIndex:null,
                    editTemp:{
                        text:"",
                        alisa:""
                    },
                    newState: false,
                    newTypeName:"",
                    newTypeAlisa:""
                },
                breadcrumb: [{
                    text: 'Article',
                    href: '/admin/app/article/list'
                },{
                    text: this.id === "0" ? 'New' : 'Edit',
                    href: this.id === "0" ? '/admin/app/article/new' : '/admin/app/article/edit/'+this.id
                }],
                article:{
                    title:"",
                    type:null,
                    tags:[],
                    content:null
                },
                states:[
                    {value:null, text:"请选择发布状态"},
                    {value:0, text:"下线"},
                    {value:1, text:"在线"}
                ],
                editorOption:{
                    placeholder:"请在此书写你的文章正文...",
                    modules: {
                        imageResize: {
                            modules: [ 'Resize', 'DisplaySize' ]
                        },
                        ImageExtend: {
                            loading: true,
                            name: 'file',
                            action: "/api/admin/article/upload/image",
                            change: (xhr, formData) => {
                                formData.append("id", that.id);
                            },
                            response: (res) => {
                                that.$refs.material.getImageList(1);
                                return res.data
                            }
                        },
                        toolbar: {
                            container: container,
                            handlers: {
                                'image': function () {
                                    QuillWatch.emit(this.quill.id)
                                },
                                'video': function () {
                                    that.$refs.material.show(this.quill, this.quill.selection.cursor.selection.lastRange.index)
                                }
                            }
                        }
                    }
                },
                temp_tag: "",
                timer: null,
                loading: true
            }
        },
        methods:{
            onEditorBlur(){//失去焦点事件
            },
            onEditorFocus(){//获得焦点事件
            },
            onEditorChange(){//内容改变事件
            },
            clearName () {
                this.temp_tag = ''
            },
            handleOk (evt) {
                // Prevent modal from closing
                evt.preventDefault();
                if (!this.temp_tag) {
                    alert('Please enter your name')
                } else {
                    this.handleSubmit()
                }
            },
            handleSubmit () {
                this.article.tags.push(this.temp_tag);
                this.clearName();
                this.$refs.modalForTags.hide();
            },
            removeTag(i){
                this.article.tags.splice(i,1);
            },
            newType(){
                this.typeEdit.newState=true;
                this.typeEdit.newTypeName = "";
                this.typeEdit.newTypeAlisa = "";
            },
            resetTypeEditor(){
                this.typeEdit.newState=false;
                this.typeEdit.newTypeName = "";
                this.typeEdit.newTypeAlisa = "";
                if(this.typeEdit.editTemp.text !== "" && this.typeEdit.editIndex!=null){
                    this.types[this.typeEdit.editIndex].text = this.typeEdit.editTemp.text;
                    this.types[this.typeEdit.editIndex].alisa = this.typeEdit.editTemp.alisa;
                } else {
                    this.typeEdit.editTemp.text = "";
                    this.typeEdit.editTemp.alisa = "";
                }
                this.typeEdit.editIndex = null;
            },
            actNewType(){
                let _that = this;
                if(this.typeEdit.newTypeName === "") return this.$eventHub.$emit('alert', {
                    type:"warning"
                    , message:"新的类别名不能为空"
                });
                if(this.typeEdit.newTypeAlisa === "") return this.$eventHub.$emit('alert', {
                    type:"warning"
                    , message:"新的导航名不能为空"
                });
                this.axios.post('/api/admin/type/new', {
                    name:this.typeEdit.newTypeName,
                    alisa:this.typeEdit.newTypeAlisa
                }).then(res=>{
                    _that.$store.commit("SET_TYPE_LIST", res.data.data);
                    _that.resetTypeEditor()
                }).catch(res=>{
                    console.error(res);
                });
            },
            actEditType(index){
                let _that = this;
                if(this.types[index].text === "") return this.$eventHub.$emit('alert', {
                    type:"warning"
                    , message:"类别名不能为空"
                });
                if(this.types[index].alisa === "") return this.$eventHub.$emit('alert', {
                    type:"warning"
                    , message:"导航名不能为空"
                });
                this.axios.post('/api/admin/type/new', {
                    _id:this.types[index].value,
                    name:this.types[index].text,
                    alisa:this.types[index].alisa
                }).then(res=>{
                    if(res.data.code === "0000"){
                        _that.typeEdit.editIndex = null;//将index置为null，否则在下面reset的时候会把temp的文本重填入修改前的数据
                        _that.$store.commit("SET_TYPE_LIST", res.data.data);
                        _that.resetTypeEditor()
                    } else {
                        console.error(res);
                    }
                }).catch(res=>{
                    console.error(res);
                });
            },
            deleteType(index){
                let _that = this;
                this.axios.post('/api/admin/type/delete', {
                    _id:this.types[index].value
                }).then(res=>{
                    if(res.data.code === "0000"){
                        _that.$store.commit("SET_TYPE_LIST", res.data.data);
                        _that.resetTypeEditor()
                    } else {
                        console.error(res);
                    }
                }).catch(res=>{
                    console.error(res);
                });
            },
            postArticle(){
                let _that = this;
                this.axios.post('/api/admin/article/post/' + this.id, this.article).then(res=>{
                    if(res.data.code !== "0000"){
                        console.error(res);
                    } else {
                        _that.$router.push("/admin/app/article/list");
                    }
                }).catch(res=>{
                    console.error(res);
                });
            },
            countDownChanged (dismissCountDown) {
                this.dismissCountDown = dismissCountDown
            },
            saveDraft(){
                let _that = this;
                _that.axios.post('/api/admin/article/draft/' + _that.id, _that.article).then(res=>{
                    if(res.data.code !== "0000"){
                        console.error(res);
                    }
                }).catch(res=>{
                    console.error(res);
                });
            },
            cancelDraft(){
                let _that = this;
                _that.axios.get('/api/admin/article/draft/cancel/' + _that.id).then(res=>{
                    if(res.data.code !== "0000"){
                        console.error(res);
                    } else {
                        _that.$router.push("/admin/app/article/list");
                    }
                }).catch(res=>{
                    console.error(res);
                });
            },
            resetDraft(){
                let _that = this;
                if(this.id === "0"){
                    for(let key in _that.article){
                        switch(key){
                            case "content":
                            case "state":
                            case "type":
                            case "password":
                            case "title":
                                _that.article[key] = null;
                                break;
                            case "tags":
                                _that.article[key] = [];
                                break;
                        }
                    }
                } else {
                    this.axios.get('/api/admin/article/draft/' + _that.id + "?reset=true").then(res=>{
                        if(res.data.code === "0000"){
                            for(let key in _that.article){
                                if(res.data.data[key]){
                                    _that.article[key] = res.data.data[key]
                                } else {
                                    switch(key){
                                        case "content":
                                        case "state":
                                        case "type":
                                        case "password":
                                        case "title":
                                            _that.article[key] = null;
                                            break;
                                        case "tags":
                                            _that.article[key] = [];
                                            break;
                                    }
                                }
                            }
                        } else {
                            console.error(res);
                        }
                    }).catch(res=>{
                        console.error(res);
                    });
                }
            }
        },
        mounted(){
            let _that = this;
            this.axios.get('/api/admin/article/draft/' + _that.id).then(res=>{
                if(res.data.code === "0000"){
                    for(let key in res.data.data){
                        _that.article[key] = res.data.data[key]
                    }
                    if(_that.article.draftUpdateAt){
                        _that.dismissCountDown = 10;
                    }
                    _that.$refs.load.finished();
                    _that.loading= false;
                    _that.timer = setInterval(function(){
                        _that.saveDraft();
                    }, 5000);
                } else {
                    console.error(res);
                }
            }).catch(res=>{
                console.error(res);
            });

            window.addEventListener('scroll',function(){
                var clientHeight=document.documentElement.clientHeight; //document.documentElement获取数据
                var scrollTop=document.documentElement.scrollTop; //document.documentElement获取数据
                var scrollHeight=document.documentElement.scrollHeight;//document.documentElement获取数据
                var judgeTop = document.querySelector(".view.container").offsetTop +
                    document.querySelector(".view.container>.navbar>.row>.col-md-9>.admin_container").offsetTop +
                    document.querySelector(".view.container>.navbar>.row>.col-md-9>.admin_container .quill-editor").offsetTop;
                var targetNode = document.querySelector(".view.container>.navbar>.row>.col-md-9>.admin_container .quill-editor>.ql-toolbar"),
                parentNode = document.querySelector(".view.container>.navbar>.row>.col-md-9>.admin_container .quill-editor");
                targetNode.style.background="#FFF";
                if(scrollTop>=judgeTop){
                    targetNode.style.position="fixed";
                    targetNode.style.top="0";
                    targetNode.style.zIndex="999";
                    targetNode.style.width=parentNode.clientWidth + "px";
                } else {
                    targetNode.style.position="";
                    targetNode.style.top="";
                    targetNode.style.zIndex="";
                    targetNode.style.width="";
                }
            },true);
        },
        beforeDestroy(){
            clearInterval(this.timer)
        }
    }
</script>

<style>
    .ql-toolbar.ql-snow, .ql-container.ql-snow {
        border: 1px solid rgba(0,0,0,0.125);
        border-left: none;
        border-right: none;
    }
    .ql-container.ql-snow {
         border-bottom: none;
    }
    .new_article_row{
        padding:0 10px;
        margin: 10px 0 0;
        line-height: 32px;
        border-bottom: 1px solid rgba(0,0,0,0.125);
    }
    .new_article_row:last-child{
        border-bottom: none;
    }
    .bt-1{
        border-top:1px solid rgba(0,0,0,0.125);
        padding: 10px 10px 0;
    }
    .new_article_row label{
        font-size: 14px;
    }
    .new_article_tag{
        padding: 2px 12px;
        background: #ececec;
        font-size: 12px;
        border-radius: 2px;
        cursor: pointer;
    }
    .new_article_tag:hover{
        padding: 2px 2px 2px 11px;
    }
    .new_article_tag i{
        font-size: 14px;
        display: none;
    }
    .new_article_tag:hover i{
        display: inline-block;
    }
    #modalForTypes .modal-body{
        padding: 0;
    }
</style>