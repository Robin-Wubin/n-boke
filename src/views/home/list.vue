<template>
    <b-container>
        asd
    </b-container>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    export default {
        name: "list",
        asyncData ({ store, route}) {
            let query = {};
            query[route.params.act] = route.params.keyword;
            let page = route.params.page ? route.params.page : 1;
            return Promise.all([store.dispatch('getUserInfo'), store.dispatch('getRecentComment'), store.dispatch('getRecentPost'), store.dispatch('setTypeList'), store.dispatch('searchBlogList', {page, query} )]);
        },
        computed: {
            ...mapGetters({
                types: 'getTypeList',
                article: 'getBlogList',
                setting: 'getSettingInfo'
            })
        },
        data(){
            return{
                color:["bg-blue", "bg-green", "bg-yellow", "bg-red", "bg-orange"],
                page: parseInt(this.$route.params.page ? this.$route.params.page : 1)
            }
        },
        methods: {
            linkGen (pageNum) {
                return "/page/" + pageNum
            }
        }
    }
</script>

<style scoped>

</style>