<template>
    <div>
        <b-alert :show="alert.dismissCountDown" :variant="alert.type"
                 fade
                 @dismiss-count-down="countDownChanged" class="globalAlert">
            {{alert.message}}
            <a href="javascript:void(0)" @click="alert.dismissCountDown=0"><i class="fa fa-times"></i></a>
        </b-alert>
        <b-navbar toggleable="md" type="dark" variant="secondary">
            <b-navbar-brand href="#">N-Boke 后台管理系统</b-navbar-brand>
            <div style="flex-grow: 1"  v-if="admin_info">
                <b-button variant="default" size="mini" @click="signout" class="float-right"><i class="fa fa-sign-out"></i></b-button>
            </div>

        </b-navbar>
            <!-- Stack the columns on mobile by making one full-width and the other half-width -->
        <transition name="slide"><router-view class="view"></router-view></transition>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    export default {
        name: "index",
        asyncData ({ store, route}) {
            return store.dispatch('setAdminInfo');
        },
        computed: {
            ...mapGetters({
                admin_info: 'getAdminInfo'
            })
        },
        methods: {
            ...mapActions([
                'setAdminInfo',
            ]),
            signout(){
                let _that = this;
                this.axios.get('/api/admin/signout', this.form).then(res=>{
                    _that.$store.commit("SET_ADMIN_INFO", null);
                    _that.$router.push("/");
                }).catch(res=>{
                    console.error(res);
                });
            },
            countDownChanged (dismissCountDown) {
                this.alert.dismissCountDown = dismissCountDown
            }
        },
        beforeMount(){
            let that = this;
            if(!this.admin_info){
                this.$router.push("/admin/login");
            } else {
                if(this.$store.state.route.path  === "/admin") this.$router.push("/admin/app/dashboard");
            }
            this.$eventHub.$on('alert', (yourData)=>{
                yourData.dismissCountDown = yourData.dismissCountDown ? yourData.dismissCountDown : 5;
                yourData.type = yourData.type ? yourData.type : "primary"; // "secondary", "success", "danger", "warning", "info", "light", "dark"
                that.alert = yourData;
            } )
        },
        data () {
            return {
                alert:{
                    type:"info"
                    ,dismissCountDown: 0
                    , message:""
                }
            }
        },
        watch: {
            $route (to, from) {
                if(to.path === "/admin"){
                    console.log(this.admin_info);
                    if(!this.admin_info){
                        this.$router.push("/admin/login");
                    } else {
                        this.$router.push("/admin/app/dashboard");
                    }
                }
            }
        }
    }
</script>

<style>
    body{
        background: #f6f6f6;
        font-family: -apple-system,SF UI Text,Arial,PingFang SC,Hiragino Sans GB,Microsoft YaHei,WenQuanYi Micro Hei,sans-serif;
    }
    a, a:hover{
        color: rgba(0, 0, 0, 0.75);
        text-decoration: none;
        background-color: transparent;
    }
    .globalAlert{
        display: inline-block;
        margin: auto;
        position: fixed;
        z-index: 9999;
        box-sizing: border-box;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        font-size: 14px;
    }
    @font-face {
        font-family: 'icomoon';
        src:  url('/fonts/icomoon.eot?6psrn1');
        src:  url('/fonts/icomoon.eot?6psrn1#iefix') format('embedded-opentype'),
        url('/fonts/icomoon.ttf?6psrn1') format('truetype'),
        url('/fonts/icomoon.woff?6psrn1') format('woff'),
        url('/fonts/icomoon.svg?6psrn1#icomoon') format('svg');
        font-weight: normal;
        font-style: normal;
    }

    [class^="icon-"], [class*=" icon-"] {
        /* use !important to prevent issues with browser extensions that change fonts */
        font-family: 'icomoon' !important;
        speak: none;
        font-style: normal;
        font-weight: normal;
        font-variant: normal;
        text-transform: none;
        line-height: 1;

        /* Better Font Rendering =========== */
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    .icon-zhihu-square-fill:before {
        content: "\e900";
    }

    .bg-white {
        background-color: #fff!important
    }
    .bg-white .font {
        color: #fff!important
    }
    .bg-grey {
        background-color: #f7f7f7!important
    }
    .bg-grey .font {
        color: #f7f7f7!important
    }

    .bg-deepgrey {
        background-color: rgba(0,0,0,.5)!important
    }
    .bg-deepgrey .font{
        color: rgba(0,0,0,.5)!important
    }
    .bg-blue {
        background-color: #6fa3ef!important
    }
    .bg-blue .font{
        color: #6fa3ef!important
    }
    .bg-purple {
        background-color: #bc99c4!important
    }
    .bg-purple .font{
        color: #bc99c4!important
    }
    .bg-green {
        background-color: #46c47c!important
    }
    .bg-green .font{
        color: #46c47c!important
    }
    .bg-yellow {
        background-color: #f9bb3c!important
    }
    .bg-yellow .font{
        color: #f9bb3c!important
    }
    .bg-red {
        background-color: #e8583d!important
    }
    .bg-red .font{
        color: #e8583d!important
    }
    .bg-orange {
        background-color: #f68e5f!important
    }
    .bg-orange .font{
        color: #f68e5f!important
    }
</style>