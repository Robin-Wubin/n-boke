<template>
    <div>
        <div v-if="showlist" class="main_container">
            <b-breadcrumb class="bread_head" :items="breadcrumb"/>
            <b-list-group class="suit_fot">
                <b-list-group-item class="suit_fot_tpl"><router-link :to="'/admin/app/article/new'"><i class="fa fa-plus-square"></i> 添加新文章</router-link></b-list-group-item>
                <b-list-group-item v-for="(item,index) of list" :key="index" class="suit_fot_tpl">
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
            </b-list-group>
        </div>
        <b-pagination-nav v-if="showlist" class="pagination_nav" :link-gen="linkGen" :number-of-pages="10" v-model="currentPage" />
        <router-view v-if="!showlist"></router-view>
        <b-modal id="modalForDeleteArticle" size="sm" ref="modalForDeleteArticle" title="删除文章"
                 @ok="confirmDelete" @hidden="cancelDelete">
            确定要删除文章吗？
        </b-modal>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
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
        data () {
            return {
                breadcrumb: [{
                    text: 'Article',
                    href: '/admin/app/article/list'
                }],
                screenWidth: !this.$isServer ? document.body.clientWidth : 0,
                currentPage: 1,
                showlist: true,
                list:[],
                deleteTempObj:null
            }
        },
        methods: {
            linkGen (pageNum) {
                return '#page/' + pageNum + '/foobar'
            },
            getList () {
                let _that = this;
                this.axios.get('/api/admin/article/list' ).then(res=>{
                    if(res.data.code === "0000"){
                        _that.list = res.data.data;
                        // console.log(res.data);
                    } else {
                        console.error(res);
                    }
                }).catch(res=>{
                    console.error(res);
                });
            },
            deleteArticle (item,index) {
                console.log(this.deleteTempObj);
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
            this.showlist = this.$store.state.route.path  === "/admin/app/article/list";
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
                this.showlist = to.path === "/admin/app/article/list";
                if(this.showlist) this.getList();
            },
            screenWidth (val) {
                console.log(val);
                this.screenWidth = val
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
        display: flex;
        flex-direction: column;
    }
    .suit_fot_tpl:first-child{
        border-radius: 0;
    }
    .suit_fot_tpl:last-child{
        border-bottom: none;
    }
    .suit_fot_tpl .bottom_side{
        display: flex;
        flex-wrap: nowrap;
        flex-direction: row;
        justify-content: space-between;
    }
    .pagination_nav{
        display: flex;
        flex-direction: row;3
        justify-content: center;
    }
</style>