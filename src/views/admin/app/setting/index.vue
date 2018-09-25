<template>
    <div class="main_container">
        <b-breadcrumb class="bread_head" :items="breadcrumb"/>
        <b-container>
            <b-row>
                <b-col class="header">基本设置</b-col>
            </b-row>
            <b-row class="option">
                <b-col lg="3">站点名称</b-col>
                <b-col lg="9">
                    <b-form-input size="sm" v-model="text1" type="text" placeholder="Enter your name"></b-form-input>
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
                    <b-form-input size="sm" v-model="text1" type="text" placeholder="Enter your name"></b-form-input>
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
                    <b-form-input size="sm" v-model="text1" type="text" placeholder="Enter your name"></b-form-input>
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
                    <b-form-input size="sm" v-model="text1" type="text" placeholder="Enter your name"></b-form-input>
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
                    <b-form-input size="sm" v-model="text1" type="text" placeholder="Enter your name"></b-form-input>
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
                    <b-form-input size="sm" v-model="text1" type="text" placeholder="Enter your name"></b-form-input>
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
                            <b-form-checkbox id="input-comment" v-model="text1" :value="true" :unchecked-value="false">
                                评论者名称显示时自动加上其个人主页链接
                            </b-form-checkbox>
                        </b-row>
                        <b-row class="mb-1">
                            <b-form-checkbox id="input-comment" v-model="text1" :value="true" :unchecked-value="false">
                                对评论者个人主页链接使用 nofollow 属性
                            </b-form-checkbox>
                        </b-row>
                        <b-row class="mb-1">
                            <b-form-checkbox id="input-comment" v-model="text1" :value="true" :unchecked-value="false">
                                启用分页，并且每页显示
                                <b-form-input size="sm" v-model="text1" type="text" placeholder="Enter your name" style="display: inline-block;width: 50px;"></b-form-input>
                                篇评论，在列出时将
                                <b-form-input size="sm" v-model="text1" type="text" placeholder="Enter your name" style="display: inline-block;width: 50px;"></b-form-input>
                                作为默认显示
                            </b-form-checkbox>
                        </b-row>
                        <b-row class="mb-1">
                            <b-form-checkbox id="input-comment" v-model="text1" :value="true" :unchecked-value="false">
                                启用评论回复，以
                                <b-form-input size="sm" v-model="text1" type="text" placeholder="Enter your name" style="display: inline-block;width: 50px;"></b-form-input>
                                层作为每个评论最多的回复层数，将
                                <b-form-input size="sm" v-model="text1" type="text" placeholder="Enter your name" style="display: inline-block;width: 50px;"></b-form-input>
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
                            <b-form-checkbox id="input-comment" v-model="text1" :value="true" :unchecked-value="false">
                                所有评论必须经过审核
                            </b-form-checkbox>
                        </b-row>
                        <b-row class="mb-1">
                            <b-form-checkbox id="input-comment" v-model="text1" :value="true" :unchecked-value="false">
                                必须填写邮箱
                            </b-form-checkbox>
                        </b-row>
                        <b-row class="mb-1">
                            <b-form-checkbox id="input-comment" v-model="text1" :value="true" :unchecked-value="false">
                                必须填写网址
                            </b-form-checkbox>
                        </b-row>
                        <b-row class="mb-1">
                            <b-form-checkbox id="input-comment" v-model="text1" :value="true" :unchecked-value="false">
                                检查评论来源页URL是否与文章链接一致
                            </b-form-checkbox>
                        </b-row>
                        <b-row class="mb-1">
                            <b-form-checkbox id="input-comment" v-model="text1" :value="true" :unchecked-value="false">
                                在文章发布
                                <b-form-input size="sm" v-model="text1" type="text" placeholder="Enter your name" style="display: inline-block;width: 50px;"></b-form-input>
                                天以后自动关闭评论
                            </b-form-checkbox>
                        </b-row>
                        <b-row class="mb-1">
                            <b-form-checkbox id="input-comment" v-model="text1" :value="true" :unchecked-value="false">
                                同一IP发布评论的时间间隔限制为
                                <b-form-input size="sm" v-model="text1" type="text" placeholder="Enter your name" style="display: inline-block;width: 50px;"></b-form-input>
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
                    <b-form-input size="sm" v-model="text1" type="text" placeholder="Enter your name"></b-form-input>
                </b-col>
            </b-row>
            <b-row class="tips mb-2">
                <b-col lg="9" offset-lg="3">
                    此格式用于指定显示在文章归档中的日期默认显示格式。
                </b-col>
            </b-row>
            <b-row class="option">
                <b-col lg="3">站点首页</b-col>
                <b-col lg="9">
                    <b-form-radio-group id="radios2" v-model="text1" name="radioSubComponent">

                        <b-container>
                            <b-row class="mb-1">
                                <b-form-radio value="first">显示最新发布的文章</b-form-radio>
                            </b-row>
                            <b-row class="mb-1">
                                <b-form-radio value="second">使用
                                    <b-form-input size="sm" v-model="text1" type="text" placeholder="Enter your name" style="display: inline-block;width: 50px;"></b-form-input>
                                    页面作为首页</b-form-radio>
                            </b-row>
                        </b-container>
                    </b-form-radio-group>
                </b-col>
            </b-row>
            <b-row class="option">
                <b-col lg="3">文章列表数目</b-col>
                <b-col lg="9">
                    <b-form-input size="sm" v-model="text1" type="text" placeholder="Enter your name"></b-form-input>
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
                    <b-form-input size="sm" v-model="text1" type="text" placeholder="Enter your name"></b-form-input>
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
    export default {
        name: "index",
        data () {
            return {
                breadcrumb: [{
                    text: 'Setting',
                    href: '/admin/app/setting'
                }],
                text1:true
            }
        },
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