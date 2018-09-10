<template>
    <div>
        <div class="main_container">
            <b-breadcrumb class="bread_head" :items="breadcrumb"/>
            <div>
                <b-row class="new_article_row">
                    <b-col sm="2"><label for="input-title">标题:</label></b-col>
                    <b-col sm="10">
                        <b-form-input id="input-title" size="sm" type="text" placeholder="Enter your title"></b-form-input>
                    </b-col>
                </b-row>
                <b-row class="new_article_row">
                    <b-col sm="2"><label for="input-type">类别:</label><i class="fa fa-pencil-square float-right mt-2" v-b-modal.modalForTypes></i></b-col>
                    <b-col sm="10">
                        <b-form-select id="input-type" size="sm" v-model="selected" :options="options"/>
                    </b-col>
                </b-row>
                <b-row class="new_article_row">
                    <b-col sm="2"><label for="input-tags">标签:</label></b-col>
                    <b-col sm="10">
                        <i class="fa fa-angle-left mr-2"></i>
                        <span v-for="(item, index) of tags" class="new_article_tag mr-2" :key="index">{{item}} <i class="fa fa-minus-square-o" @click="removeTag(index)"></i></span>
                        <i class="fa fa-plus-square mr-2" v-b-modal.modalForTags></i>
                        <i class="fa fa-angle-right"></i>
                    </b-col>
                </b-row>
            </div>

            <no-ssr>
                <quill-editor
                        v-model="content"
                        ref="myQuillEditor"
                        :options="editorOption"
                        @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                        @change="onEditorChange($event)">
                </quill-editor>
            </no-ssr>
            <b-modal id="modalForTags" ref="modalForTags" title="添加标签" @ok="handleOk" @shown="clearName">
                <form @submit.stop.prevent="handleSubmit">
                    <b-form-input type="text" placeholder="请输入要添加的标签" v-model="temp_tag"></b-form-input>
                </form>
            </b-modal>
            <b-modal id="modalForTypes" size="md" hide-footer hide-header title="类别管理">
                <b-list-group>
                    <b-list-group-item><i class="fa fa-plus-square"></i> 添加新类别</b-list-group-item>
                    <b-list-group-item v-for="(item, index) of types" class="d-flex justify-content-between align-items-center" :key="index">
                        {{item.name}}
                        <b-badge variant="primary" pill>14</b-badge>
                    </b-list-group-item>
                </b-list-group>
            </b-modal>

        </div>
    </div>
</template>

<script>
    import NoSSR from 'vue-no-ssr'
    if(typeof document !== "undefined"){
    const { quillEditor } = require('vue-quill-editor');
    }
    export default {
        components: {
            'no-ssr': NoSSR
        },
        name: "new",
        data(){
            return {
                breadcrumb: [{
                    text: 'Article',
                    href: '/admin/app/article/list'
                },{
                    text: 'New',
                    href: '/admin/app/article/new'
                }],
                content:null,
                editorOption:{},
                selected: null,
                options: [
                    { value: null, text: 'Please select an option' },
                    { value: 'a', text: 'This is First option' },
                    { value: 'b', text: 'Selected Option' },
                    { value: {'C': '3PO'}, text: 'This is an option with object value' },
                    { value: 'd', text: 'This one is disabled', disabled: true }
                ],
                temp_tag: "",
                tags:[],
                types:[{name:"日记", count:30}]
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
                this.tags.push(this.temp_tag);
                this.clearName();
                this.$refs.modalForTags.hide();
            },
            removeTag(i){
                this.tags.splice(i,1);
            }
        },
        mounted(){
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