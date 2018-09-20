<template>
    <div>
        <div v-if="showlist" class="main_container">
            <b-breadcrumb class="bread_head" :items="breadcrumb"/>
            <b-list-group class="suit_fot">
                <b-list-group-item class="suit_fot_tpl"><router-link :to="'/admin/app/article/new'"><i class="fa fa-plus-square"></i> 添加新文章</router-link></b-list-group-item>
                <loading ref="load"></loading>
                <b-list-group-item v-if="list.length > 0" v-for="(item,index) of list" :key="index" class="suit_fot_tpl">
                    <div>
                        <div>
                            <i class="fa fa-circle" :class="item.state ? 'text-success' : 'text-secondary' "></i>
                            <i class="fa" :class="item.password ? 'text-success fa-lock' : 'text-secondary fa-unlock-alt' "></i>
                            <router-link :to="'/admin/app/article/edit/'+ item._id">{{item.title}}</router-link>
                        </div>
                    </div>
                    <div class="bottom_side">
                        <span>
                            <b-badge variant="dark" pill class="mr-4">{{item.type | getTypes(types)}}</b-badge>
                            <span v-if="screenWidth>1000">
                                <b-badge variant="light" v-for="(tag,index) of item.tags" :key="index" class="mr-2">{{tag}}</b-badge>
                            </span>
                        </span>
                        <span class="">
                            <b-badge variant="secondary" class="mr-2"><i class="fa fa-eye"></i> {{item.count.view}}</b-badge>
                            <b-badge variant="dark" class="mr-2"><i class="fa fa-comments"></i> {{item.count.comment}}</b-badge>
                            <a href="javascript:void(0);" @click="deleteArticle(item,index)"><i class="fa fa-trash-o"></i></a>
                        </span>
                    </div>
                </b-list-group-item>
                <b-list-group-item v-if="list.length=== 0" class="suit_fot_tpl">
                    <div style="font-size: 14px;
        line-height: 250px;
        text-align: center;
        color: #CCC;">
                        <i class="fa fa-child"></i>&nbsp;&nbsp;&nbsp;&nbsp;没有文章
                    </div>
                </b-list-group-item>
            </b-list-group>
        </div>
        <b-pagination-nav v-if="showlist && totalPage>0" class="pagination_nav" :link-gen="linkGen" :number-of-pages="totalPage" v-model="page" />
        <router-view v-if="!showlist"></router-view>
        <b-modal id="modalForDeleteArticle" size="sm" ref="modalForDeleteArticle" title="删除文章"
                 @ok="confirmDelete" @hidden="cancelDelete">
            确定要删除文章吗？
        </b-modal>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    import loading from '../../../../components/Loading.vue'
    export default {
        asyncData ({ store, route}) {
            return store.dispatch('setTypeList');
        },
        name: "list",
        computed: {
            ...mapGetters({
                types: 'getTypeList'
            })
        },
        components: {
            loading
        },
        data () {
            return {
                breadcrumb: [{
                    text: 'Article',
                    href: '/admin/app/article/list'
                }],
                screenWidth: !this.$isServer ? document.body.clientWidth : 0,
                loading: true,
                page: parseInt(this.$route.params.page ? this.$route.params.page : 1),
                totalPage: 1,
                showlist: true,
                list:[],
                deleteTempObj:null
            }
        },
        methods: {
            linkGen (pageNum) {
                return "" + pageNum
            },
            getList () {
                let _that = this;
                let page = parseInt(this.$route.params.page ? this.$route.params.page : 1);
                _that.loading= true;
                this.axios.get('/api/admin/article/list?page=' + page ).then(res=>{
                    if(res.data.code === "0000"){
                        _that.$refs.load && _that.$refs.load.finished();
                        _that.loading= false;
                        _that.list = res.data.data.list;
                        _that.totalPage = res.data.data.totalPage;
                        _that.page = page;
                        // console.log(res.data);
                    } else {
                        console.error(res);
                    }
                }).catch(res=>{
                    console.error(res);
                });
            },
            deleteArticle (item,index) {
                this.$refs.modalForDeleteArticle.show();
                this.deleteTempObj = {item,index}
            },
            confirmDelete () {
                let _that = this;
                if(!this.deleteTempObj) return null;
                this.axios.post('/api/admin/article/delete',{id:this.deleteTempObj.item._id}).then(res=>{
                    _that.getList();
                }).catch(res=>{
                    console.error(res);
                });
            },
            cancelDelete () {
                this.deleteTempObj = null;
            }
        },
        beforeMount(){
            this.showlist = /\/admin\/app\/article\/list(\/\d)*/.test(this.$store.state.route.path);
        },
        mounted(){
            this.getList();
            const that = this;
            if(!this.$isServer){
                window.onresize = () => {
                    return (() => {
                        window.screenWidth = document.body.clientWidth;
                        that.screenWidth = window.screenWidth
                    })()
                }
            }
        },
        watch: {
            $route (to, from) {
                this.showlist = /\/admin\/app\/article\/list(\/\d+)*/.test(to.path);
                if(this.showlist) this.getList();
            }
        }
    }
</script>

<style scoped>
</style>