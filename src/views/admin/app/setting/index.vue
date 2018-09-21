<template>
    <div class="main_container">
        <b-breadcrumb class="bread_head" :items="breadcrumb"/>
        <b-container>
            <b-row>
                <b-col class="header">基本设置</b-col>
            </b-row>
            <b-row class="option">
                <b-col lg="2">站点名称</b-col>
                <b-col lg="10">
                    <b-form-input size="sm" v-model="text1" type="text" placeholder="Enter your name"></b-form-input>
                </b-col>
            </b-row>
            <b-row class="tips mb-2">
                <b-col lg="10" offset-lg="2">
                    站点的名称将显示在网页的标题处。
                </b-col>
            </b-row>
            <b-row class="option">
                <b-col lg="2">站点地址</b-col>
                <b-col lg="10">
                    <b-form-input size="sm" v-model="text1" type="text" placeholder="Enter your name"></b-form-input>
                </b-col>
            </b-row>
            <b-row class="tips mb-2">
                <b-col lg="10" offset-lg="2">
                    站点地址主要用于生成内容的永久链接。
                </b-col>
            </b-row>
            <b-row class="option">
                <b-col lg="2">站点描述</b-col>
                <b-col lg="10">
                    <b-form-input size="sm" v-model="text1" type="text" placeholder="Enter your name"></b-form-input>
                </b-col>
            </b-row>
            <b-row class="tips mb-2">
                <b-col lg="10" offset-lg="2">
                    站点描述将显示在网页代码的头部。
                </b-col>
            </b-row>
            <b-row class="option">
                <b-col lg="2">关键词</b-col>
                <b-col lg="10">
                    <b-form-input size="sm" v-model="text1" type="text" placeholder="Enter your name"></b-form-input>
                </b-col>
            </b-row>
            <b-row class="tips mb-2">
                <b-col lg="10" offset-lg="2">
                    请以半角逗号“,”分割多个关键字。
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
                }]
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