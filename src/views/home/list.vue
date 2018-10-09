<template>
    <b-container>
        <b-row>
            <b-col lg="6" v-for="(item,index) of article.list" :key="index">

                <p class="card-text">
                    <router-link :to="{ path: '/article/' + item._id}">{{item.title}}</router-link>
                </p>
            </b-col>
        </b-row>
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
        },
        mounted(){
            console.log(this.article);
        }
    }
</script>

<style scoped>

</style>