<template>
    <div>
        <div class="main_container">
            <b-breadcrumb class="bread_head" :items="breadcrumb"/>
            <b-container>
                <b-row>
                    <b-col>
                        <p class="tips">欢迎使用N-Boke，你可以开始使用并自定义你的站点：</p>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col lg="4" class="intro">
                        <div class="advice">
                            <h5>开始使用</h5>
                        </div>
                        <div class="advice_content">
                            <b-button size="" variant="primary" class="self-btn" @click="go('/admin/app/setting')">
                                设置您的站点
                            </b-button>
                            <div class="self-or">
                                <span class="mine-or">或</span>
                            </div>
                            <div style="text-align: center;">
                                <b-button size="sm" variant="success"  @click="go('/admin/app/person')">
                                    完善您的个人信息
                                </b-button>
                            </div>
                        </div>
                    </b-col>
                    <b-col lg="4" class="intro">
                        <div class="advice">
                            <h5>接下来</h5>
                        </div>
                        <div class="advice_content">
                            <a href="/admin/app/article/new"><i class="fa fa-edit"></i> 撰写文章</a>
                            <a href="/" target="_blank"><i class="fa fa-desktop"></i> 查看站点</a>
                        </div>
                    </b-col>
                    <b-col lg="4" class="intro">
                        <div class="advice">
                            <h5>更多操作</h5>
                        </div>
                        <div class="advice_content">
                            <a href="/admin/app/source/index"><i class="fa fa-file-image-o"></i> 管理素材</a>
                            <a href="/admin/app/comment/list/0/1"><i class="fa fa-comments"></i> 管理评论</a>
                        </div>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <div class="self-title">
                            <span class="my-title">站点概览</span>
                        </div>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col lg="6" class="overview_data">
                        <div class="bg-purple daily_block">
                            <span class="head font">文章总数</span>
                            <span class="val">{{overView.article}}</span>
                        </div>
                    </b-col>
                    <b-col lg="6" class="overview_data">
                        <div class="bg-blue daily_block">
                            <span class="head font">评论总数</span>
                            <span class="val">{{overView.comment}}</span>
                        </div>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <div class="self-title">
                            <span class="my-title">今日数据</span>
                        </div>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col lg="4" class="daily_data">
                        <div class="bg-orange daily_block">
                            <span class="head font">UV</span>
                            <span class="val">{{dailyData.uv}}</span>
                        </div>
                    </b-col>
                    <b-col lg="4" class="daily_data">
                        <div class="bg-yellow daily_block">
                            <span class="head font">PV</span>
                            <span class="val">{{dailyData.pv}}</span>
                        </div>
                    </b-col>
                    <b-col lg="4" class="daily_data">
                        <div class="bg-green daily_block">
                            <span class="head font">评论</span>
                            <span class="val">{{dailyData.comment}}</span>
                        </div>
                    </b-col>
                </b-row>
            </b-container>
        </div>
    </div>
</template>

<script>
    export default {
        name: "dashboard",
        data () {
            return {
                breadcrumb: [{
                    text: 'Dashboard',
                    href: '/admin/app/dashboard'
                }],
                dailyData:{
                    pv:0,
                    uv:0,
                    comment:0
                },
                overView:{
                    article: 0,
                    comment: 0
                }
            }
        },
        methods:{
            go(url){
                this.$router.push(url);
            },
            getData(){
                let _that = this;
                this.axios.get('/api/admin/overview' ).then(res=>{
                    console.log(res.data.data);
                    if(res.data.code === "0000"){
                        _that.$set(_that.dailyData,"pv",res.data.data.daily.pv);
                        _that.$set(_that.dailyData,"uv",res.data.data.daily.uv);
                        _that.$set(_that.dailyData,"comment",res.data.data.daily.comment);
                        _that.$set(_that.overView,"article",res.data.data.overview.article);
                        _that.$set(_that.overView,"comment",res.data.data.overview.comment);
                        console.log(res.data.data);
                    } else {
                        console.error(res);
                    }
                }).catch(res=>{
                    console.error(res);
                });
            }
        },
        mounted(){
            this.getData();
        },
    }
</script>

<style scoped>
.daily_block{
    display: flex;
    flex-direction: column;
    align-items: center;
}
    .daily_block .head {
        width: 100%;
        color: #fff;
        font-size: 20px;
        font-weight: lighter;
        padding: 10px 0;
        background: rgba(45, 45, 45, 0.5);
        text-align: center;
    }
.daily_block .val {
    font-size: 32px;
    font-weight: 100;
    padding: 15px 0;
    color: #FFF;
}

@media (min-width: 992px){
    .daily_data, .overview_data{
        padding-left: 0;
        padding-right: 0;
    }
    .daily_data:first-child, .overview_data:first-child{
        padding-left: 15px;
    }
    .daily_data:last-child, .overview_data:last-child{
        padding-right: 15px;
    }
    .intro{
        border-right: 1px solid #888;
        padding-left: 0;
        padding-right: 0;
    }
    .intro:first-child{
        padding-left: 15px;
    }
    .intro:last-child{
        border-right: none;
        padding-right: 15px;
    }
}

    .tips{
        color: #888;
        padding: 15px;
        font-size: 14px;
    }
    .advice{
        padding: 0 15px;
        position: relative;
        height: 32px;
    }
    .advice_content{
        padding: 0 15px;
        position: relative;
        font-size: 14px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        height: 150px;
        margin-bottom: 15px;
    }
    .advice_content a{
        text-align: center;
    }
    .self-btn{
        margin: 0.5rem 0;
    }
    .advice h5{
        display: block;
        float: left;
        background: #fff;
        z-index: 8;
        position: relative;
        padding: 0 1.5rem;
    }
    .advice:before{
        position: absolute;
        width: 100%;
        height: 1px;
        background: #888;
        top: 50%;
        left: 0;
        content: '';
        margin-top: -0.4rem;
    }
    .self-or{
        position: relative;
        text-align: center;
    }
    .self-or:before{
        position: absolute;
        width: 100%;
        height: 1px;
        background: #ddd;
        top: 50%;
        left: 0;
        content: '';
    }
    .mine-or{
        background: #FFF;
        position: relative;
        z-index: 8;
        padding: 0 20px;
    }
    .self-title{
        position: relative;
        text-align: center;
        background: #5a5a5a;
    }
    .self-title:before{
        position: absolute;
        width: 100%;
        height: 1px;
        background: #BBB;
        top: 50%;
        left: 0;
        content: '';
    }
    .my-title{
        color: #FFF;
        position: relative;
        z-index: 8;
        background: #5a5a5a;
        padding: 0 25px;
    }
</style>