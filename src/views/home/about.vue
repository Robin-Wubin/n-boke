<template>
    <b-container>
        <b-row>
            <b-col lg="8" offset-lg="2" class="about_body_title">
                <h5>关于</h5>
            </b-col>
        </b-row>
        <b-row>
            <b-col lg="8" offset-lg="2" class="about_body">
                <img :src="user_info.ico ? user_info.ico : '/avatar.png'" height="60">
            </b-col>
        </b-row>
        <b-row>
            <b-col lg="8" offset-lg="2" class="about_body">
                <h8 class="categorys-title">个人简介</h8>
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
    }
</script>

<style scoped>
    .about_body_title{
        padding: 15px 35px;
        border-bottom: 1px solid #888;
    }
    .about_body{
        padding: 15px 35px;
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
</style>