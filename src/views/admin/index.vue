<template>
    <div>
        <b-alert :show="alert.dismissCountDown" :variant="alert.type"
                 fade
                 @dismiss-count-down="countDownChanged" class="globalAlert">
            {{alert.message}}
            <a href="javascript:void(0)" @click="alert.dismissCountDown=0"><i class="fa fa-times"></i></a>
        </b-alert>
        <b-navbar toggleable="md" type="dark" variant="secondary">
            <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
            <b-navbar-brand href="#">Admin</b-navbar-brand>
            <b-collapse is-nav id="nav_collapse">
                <!--<b-navbar-nav>-->
                    <!--<b-nav-item href="#">Link</b-nav-item>-->
                    <!--<b-nav-item href="#" disabled>Disabled</b-nav-item>-->
                <!--</b-navbar-nav>-->

                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto">

                    <b-nav-item-dropdown v-if="admin_info" right>
                        <!-- Using button-content slot -->
                        <template slot="button-content">
                            <em>{{admin_info.name}}</em>
                        </template>
                        <b-dropdown-item href="#">Profile</b-dropdown-item>
                        <b-dropdown-item @click="signout()">Signout</b-dropdown-item>
                    </b-nav-item-dropdown>
                </b-navbar-nav>
            </b-collapse>
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
</style>