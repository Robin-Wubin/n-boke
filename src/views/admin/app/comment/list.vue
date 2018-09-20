<template>
    <div>
        <div v-if="showlist" class="main_container">
            <b-breadcrumb class="bread_head" :items="breadcrumb"/>
            <b-list-group class="suit_fot">
                <loading ref="load"></loading>
                <b-list-group-item v-if="list.length > 0" v-for="(item,index) of list" :key="index" class="suit_fot_tpl">
                    <div class="info mb-2">
                        <span><img :src="item.headImg" height="32px" class="mr-2"><a class="mt-2" :href="item.site ? item.site : 'javascript:void(0);'" :target="item.site ? '_blank':''">{{item.name}}</a> </span>
                        <div><a :href="'/article/' + item.articleId" target="_blank">#{{item.article[0].title}}#</a></div>
                        <span> <a :href="'mailto:' + item.email">{{item.email}}</a> </span>
                    </div>
                    <div class="message" v-html="item.comment"></div>
                    <div class="message time">
                        <a href="javascript:void(0);" @click="deleteComment(item)" class="del"><i class="fa fa-trash"></i></a>
                        {{item.time | formatTime("YMDHMS")}}
                    </div>

                    <ol v-if="item.children && item.children.length > 0">
                        <li v-for="(child,i) of item.children" :key="i">
                            <div class="info mb-2">
                                <span><img :src="child.headImg" height="32px" class="mr-2"><a class="mt-2" :href="child.site ? child.site : 'javascript:void(0);'" :target="child.site ? '_blank':''">{{child.name}}</a> </span>
                                <span> <a :href="'mailto:' + child.email">{{child.email}}</a> </span>
                            </div>
                            <div class="message">
                                <span class="comment-author-at" v-if="!child.del"><a href="javascript:void(0);">@{{child.reply.toName}}</a></span>
                                <div v-html="child.comment"></div>
                            </div>
                            <div class="message time">
                                <a href="javascript:void(0);" @click="deleteComment(child)" class="del"><i class="fa fa-trash"></i></a>
                                {{child.time | formatTime("YMDHMS")}}
                            </div>
                        </li>
                    </ol>
                </b-list-group-item>
                <b-list-group-item v-if="list.length=== 0" class="suit_fot_tpl">
                    <div style="font-size: 14px;line-height: 250px;text-align: center;color: #CCC;">
                        <i class="fa fa-child"></i>&nbsp;&nbsp;&nbsp;&nbsp;没有评论
                    </div>
                </b-list-group-item>
            </b-list-group>
        </div>
        <b-pagination-nav v-if="showlist && totalPage>0" class="pagination_nav" :link-gen="linkGen" :number-of-pages="totalPage" v-model="page" />
        <router-view v-if="!showlist"></router-view>
    </div>
</template>

<script>
    import loading from '../../../../components/Loading.vue'
    export default {
        name: "list",
        components: {
            loading
        },
        data () {
            return {
                breadcrumb: [{
                    text: 'Comment',
                    href: '/admin/app/comment/list'
                }],
                loading: true,
                page: parseInt(this.$route.params.page ? this.$route.params.page : 1),
                totalPage: 1,
                showlist: true,
                list:[]
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
                this.axios.get('/api/admin/comment/list?page=' + page ).then(res=>{
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
            deleteComment(item){
                let _that = this;
                this.axios.post('/api/admin/comment/delete', {_id:item._id}).then(res=>{
                    if(res.data.code === "0000"){
                        _that.getList();
                    } else {
                        console.error(res);
                    }
                }).catch(res=>{
                    console.error(res);
                });
            }
        },
        beforeMount(){
            this.showlist = /\/admin\/app\/comment\/list(\/\d)*/.test(this.$store.state.route.path);
        },
        mounted(){
            this.getList();
        },
        watch: {
            $route (to, from) {
                this.showlist = /\/admin\/app\/comment\/list(\/\d+)*/.test(to.path);
                if(this.showlist) this.getList();
            }
        }
    }
</script>

<style scoped>
    .main_container {
        border: none;
        background: #f6f6f6;
    }
    .bread_head{
        margin-bottom: 0;
        border-radius: 0;
        border: 1px solid rgba(0,0,0,0.125);
    }
    .suit_fot_tpl{
        display: flex;
        flex-direction: column;
        padding: 0.75rem 1.25rem 0;
        margin: 25px 0;
        border-radius: 3px;
        -webkit-box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        border: 1px solid rgba(0,0,0,0.125);
    }
    .suit_fot_tpl .info{
        line-height: 32px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .suit_fot_tpl .message{
        padding: 0.5rem 0;
        border-top: 1px solid rgba(51, 51, 51, 0.1);
        position: relative;
    }
    .suit_fot_tpl .message .comment-author-at {
        float: left;
        margin-right: 5px;
    }
    .message>div{
        display: inline;
    }
    .message a.del{
        position: absolute;
        left: 0;
        margin-left: 15px;
        display: none;
    }
    .suit_fot_tpl:hover>.message>a.del, .suit_fot_tpl>ol>li:hover>.message>a.del{
        display: block;
    }
    .pagination_nav{
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
    .suit_fot_tpl .time{
        font-size: 12px;
        text-align: right;
        background: #00000005;
        padding: 8px 15px;
        margin: 0 -1.25rem;
    }
    .suit_fot_tpl ol{
        padding: 0 0.7rem 0.7rem;
        list-style-type: none;
        margin: 0 -1.25rem;
        background: rgb(223, 223, 223);
        border-top: 1px solid rgba(51,51,51,0.04);
    }
    .suit_fot_tpl ol li{
        background: #fff;
        padding: 0.7rem 1.25rem 0;
        border: 1px solid rgba(0,0,0,0.125);
        border-radius: 3px;
        -webkit-box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        margin-top: 0.7rem;
    }
</style>