<template>
    <b-container class="mb-5">
        <b-row>
            <b-col lg="8" offset-lg="2" class="about_body_title">
                <h5 class="mt-3">关 · 于</h5>
            </b-col>
        </b-row>
        <b-row>
            <b-col lg="8" offset-lg="2" class="about_body ico">
                <img :src="user_info.ico ? user_info.ico : '/avatar.png'" height="80">
            </b-col>
        </b-row>
        <b-row>
            <b-col lg="8" offset-lg="2" class="about_body">
                <span class="categorys-title">个人简介</span>
                <ol class="about_content">
                    <li>
                        <span>昵&emsp;&emsp;称:</span>
                        <div>{{user_info.nickname}}</div>
                    </li>
                    <li>
                        <span>座&ensp;右&ensp;铭:</span>
                        <div>{{user_info.motto}}</div>
                    </li>
                    <li>
                        <span>个人介绍:</span>
                        <div>{{user_info.brief}}</div>
                    </li>
                </ol>
            </b-col>
        </b-row>
        <b-row>
            <b-col lg="8" offset-lg="2" class="about_body">
                <span class="categorys-title">社交信息</span>
                <ol class="about_content">
                    <li v-for="item in user_info.social" :key="item.name">
                        <span><i :class="item.style"></i>&ensp;{{item.text}}:</span>
                        <div>
                            <span v-if="item.type === 'text'">{{item.url}}</span>
                            <a v-if="item.type === 'url'" :href="item.url" target="_blank">{{item.url}}</a>
                            <img v-if="item.type === 'image'" :src="item.url" height="120"/>
                        </div>
                    </li>
                </ol>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    export default {
        name: "about",
        asyncData ({ store, route}) {
            return Promise.all([store.dispatch('getUserInfo')]);
        },
        computed: {
            ...mapGetters({
                user_info: 'getUserInfo'
            })
        },
        mounted (){
            console.log(this.user_info);
        }
    }
</script>

<style scoped>
    .about_body_title{
        padding: 15px 35px;
        text-align: center;
    }
    .about_body{
        padding: 15px 35px;
        background: #FFF;
    }
    .ico{
        text-align: center;
        border-bottom: 1px solid #3333331c;
        border-radius: 5px 5px 0 0;
    }
    .ico img{
        border: 1px solid #e0e0e0;
        border-radius: 5px;
        box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.1);
    }
    .categorys-title{
        position: relative;
        margin: 10px auto;
        padding: 0 30px;
        color: #5f5f5f;
        font-size: 14px;
    }
    .categorys-title:before {
        position: absolute;
        top: 0;
        left: -15px;
        padding: 0 0 0 30px;
        color: #eb5055;
        content: '#';
    }
    .about_content{
        padding-left: 30px;
        list-style-type:none;
        font-size: 14px;
    }
    .about_content li{
        margin: 10px 0;
        display: flex;
        flex-direction: row;
    }
    .about_content li span{
        width: 80px;
        flex-shrink: 0;
    }
    .about_content li div{
        padding-left: 15px;
        flex-grow: 1;
    }
</style>