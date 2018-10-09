<template>
    <div class="bg-grey">
        <b-alert :show="alert.dismissCountDown" :variant="alert.type"
                 fade
                 @dismiss-count-down="countDownChanged" class="globalAlert">
            {{alert.message}}
            <a href="javascript:void(0)" @click="alert.dismissCountDown=0"><i class="fa fa-times"></i></a>
        </b-alert>
        <b-navbar toggleable="md" variant="faded" type="light" :class="'n_boke_header animated ' + headDire ">
            <b-container>
                <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
                <b-navbar-brand href="/">NBoke</b-navbar-brand>
                <b-collapse is-nav id="nav_collapse">
                    <b-navbar-nav>
                        <b-nav-item href="#">Link</b-nav-item>
                        <b-nav-item href="#" disabled>Disabled</b-nav-item>
                    </b-navbar-nav>

                    <!-- Right aligned nav items -->
                    <b-navbar-nav class="ml-auto">

                        <b-nav-form>
                            <b-form-input size="sm" class="mr-sm-2" type="text" placeholder="Search"/>
                            <b-button size="sm" class="my-2 my-sm-0" type="submit"><i class="fa fa-search"></i></b-button>
                        </b-nav-form>
                    </b-navbar-nav>
                </b-collapse>
            </b-container>
        </b-navbar>
        <router-view class="view mt-58"></router-view>
        <my-footer></my-footer>
    </div>
</template>

<script>
    import myFooter from '../components/footer.vue'
export default {
    asyncData ({ store, route}) {
        return store.dispatch('getUserInfo');
    },
    data(){
        return {
            headDire: "",
            alert:{
                type:"info"
                ,dismissCountDown: 0
                , message:""
            }
        }
    },
    components: {
        myFooter
    },
    beforeMount(){
        let that = this;
        this.$eventHub.$on('alert', (yourData)=>{
            yourData.dismissCountDown = yourData.dismissCountDown ? yourData.dismissCountDown : 5;
            yourData.type = yourData.type ? yourData.type : "primary"; // "secondary", "success", "danger", "warning", "info", "light", "dark"
            that.alert = yourData;
        } )
    },
    mounted(){
        let beforeScrollTop = document.body.scrollTop;
        let that = this;
        window.addEventListener("scroll",function(){
            let afterScrollTop = document.documentElement.scrollTop;
            let delta = afterScrollTop - beforeScrollTop;
            if(afterScrollTop< 116){
                that.headDire = "";
            } else {
                if(delta===0){
                    return false;
                } else if (delta>0){
                    //dowm
                    that.headDire = "slideUp";
                } else {
                    //up
                    that.headDire = "slideDown";
                }
            }
            beforeScrollTop = afterScrollTop;

        },false);
    },
    methods:{
        countDownChanged (dismissCountDown) {
            this.alert.dismissCountDown = dismissCountDown
        }
    }
}
</script>

<style>
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
        display: inline-block;
        line-height: 1;

        /* Better Font Rendering =========== */
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    .icon-zhihu-square-fill:before {
        content: "\e900";
    }

    .n_boke_header{
        background: #fff;
        position: fixed;
        top: 0;
        z-index: 10;
        display: block;
        padding: 0;
        width: 100%;
        height: 58px;
        box-shadow: 0 1px 5px rgba(0,0,0,0.1);
        text-align: right;
        line-height: 45px;
    }
    .mt-58{
        margin-top: 58px;
    }

    @-webkit-keyframes slideDown {
        0% {
            -webkit-transform: translateY(-70px)
        }

        to {
            -webkit-transform: translateY(0)
        }
    }

    @keyframes slideDown {
        0% {
            -webkit-transform: translateY(-70px);
            transform: translateY(-70px)
        }

        to {
            -webkit-transform: translateY(0);
            transform: translateY(0)
        }
    }

    @-webkit-keyframes slideUp {
        0% {
            -webkit-transform: translateY(0)
        }

        to {
            -webkit-transform: translateY(-70px)
        }
    }

    @keyframes slideUp {
        0% {
            -webkit-transform: translateY(0);
            transform: translateY(0)
        }

        to {
            -webkit-transform: translateY(-70px);
            transform: translateY(-70px)
        }
    }

    .n_boke_header.animated {
        -webkit-animation-duration: .5s;
        animation-duration: .5s;
        -webkit-animation-fill-mode: both;
        animation-fill-mode: both;
    }
    .n_boke_header.animated.slideDown {
        -webkit-animation-name: slideDown;
        animation-name: slideDown;
    }
    .n_boke_header.animated.slideUp {
        -webkit-animation-name: slideUp;
        animation-name: slideUp;
    }
    .bg-white {
        background-color: #fff!important
    }

    .bg-grey {
        background-color: #f7f7f7!important
    }

    .bg-deepgrey {
        background-color: rgba(0,0,0,.5)!important
    }

    .bg-blue {
        background-color: #6fa3ef!important
    }

    .bg-purple {
        background-color: #bc99c4!important
    }

    .bg-green {
        background-color: #46c47c!important
    }

    .bg-yellow {
        background-color: #f9bb3c!important
    }

    .bg-red {
        background-color: #e8583d!important
    }

    .bg-orange {
        background-color: #f68e5f!important
    }
    a {
        outline: 0;
        color: #313131;
        text-decoration: none
    }
    a:active,a:focus,a:hover {
        outline: 0;
        color: #1b1b1b;
        text-decoration: none
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
    input,input:focus:invalid,input:required:invalid,textarea:focus:invalid,textarea:required:invalid {
        box-shadow: none
    }

    .comment-delete{
        color: #c7c7c7;
        display: block;
        text-align: center;
    }
</style>