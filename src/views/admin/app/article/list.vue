<template>
    <div>
        <div v-if="showlist" class="main_container">
            <b-breadcrumb class="bread_head" :items="breadcrumb"/>
            <b-list-group class="suit_fot">
                <b-list-group-item class="suit_fot_tpl"><router-link :to="'/admin/app/article/new'"><i class="fa fa-plus-square"></i> 添加新文章</router-link></b-list-group-item>
                <b-list-group-item class="suit_fot_tpl">Dapibus ac facilisis in</b-list-group-item>
                <b-list-group-item class="suit_fot_tpl">Morbi leo risus</b-list-group-item>
                <b-list-group-item class="suit_fot_tpl">Vestibulum at eros</b-list-group-item>
            </b-list-group>
        </div>
        <b-pagination-nav v-if="showlist" class="pagination_nav" :link-gen="linkGen" :number-of-pages="10" v-model="currentPage" />
        <router-view v-if="!showlist"></router-view>
    </div>
</template>

<script>
    export default {
        name: "list",
        data () {
            return {
                breadcrumb: [{
                    text: 'Article',
                    href: '/admin/app/article/list'
                }],
                currentPage: 1,
                showlist: true
            }
        },
        methods: {
            linkGen (pageNum) {
                return '#page/' + pageNum + '/foobar'
            }
        },
        beforeMount(){
            this.showlist = this.$store.state.route.path  === "/admin/app/article/list";
        },
        watch: {
            $route (to, from) {
                this.showlist = to.path === "/admin/app/article/list";
            }
        }
    }
</script>

<style>
    .bread_head{
        margin-bottom: 0;
        border-radius: 0;
    }
    .suit_fot_tpl{
        border-left: none;
        border-right: none;
    }
    .suit_fot_tpl:first-child{
        border-radius: 0;
    }
    .suit_fot_tpl:last-child{
        border-bottom: none;
    }
    .pagination_nav{
        display: flex;
        flex-direction: row;3
        justify-content: center;
    }
</style>