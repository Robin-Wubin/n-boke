<template>
    <div>
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
                        <b-dropdown-item href="#">Signout</b-dropdown-item>
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
            return store.dispatch('setAdminInfo')
        },
        computed: {
            ...mapGetters({
                admin_info: 'getAdminInfo'
            })
        },
        methods: {
            ...mapActions([
                'setAdminInfo',
            ])
        },
        mounted(){
            if(!this.admin_info){
                this.$router.push("/admin/login");
            } else {
                this.$router.push("/admin/app");
            }
        },
        watch: {
            '$route' (to, from) {
                console.log(this.admin_info, to.path, to.path === "/admin");
                if(to.path === "/admin"){
                    if(!this.admin_info){
                        this.$router.push("/admin/login");
                    } else {
                        this.$router.push("/admin/app");
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>