<template>
    <div>
        <div class="main_container">
            <b-breadcrumb class="bread_head" :items="breadcrumb"/>
            <b-container>
                <b-row>
                    <b-col>
                        <p>欢迎使用N-Boke，你可以开始使用并自定义你的站点：</p>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col lg="4">
                        <p>开始使用</p>
                    </b-col>
                    <b-col lg="4">
                        <p>接下来</p>
                    </b-col>
                    <b-col lg="4">
                        <p>更多操作</p>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <p>今日数据：</p>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col lg="4" class="daily_data">
                        <div class="bg-orange daily_block">
                            <span class="head font">UV</span>
                            <span class="val">12</span>
                        </div>
                    </b-col>
                    <b-col lg="4" class="daily_data">
                        <div class="bg-yellow daily_block">
                            <span class="head font">PV</span>
                            <span class="val">12</span>
                        </div>
                    </b-col>
                    <b-col lg="4" class="daily_data">
                        <div class="bg-green daily_block">
                            <span class="head font">评论</span>
                            <span class="val">12</span>
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
                }
            }
        }
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
@media (min-width: 768px){
    .daily_data{
        padding-left: 0;
        padding-right: 0;
    }
    .daily_data:first-child{
        padding-left: 15px;
    }
    .daily_data:last-child{
        padding-right: 15px;
    }
}

</style>