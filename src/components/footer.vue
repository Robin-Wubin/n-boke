<template>
    <div class="my_footer_container">
        <div class="social_link">
            <div v-for="item in user_info.social" :key="item.name">
                <a v-if="item.type === 'text'" v-b-tooltip.hover :title="item.text + ':' + item.url"><i :class="item.style"></i></a>
                <a v-if="item.type === 'url'" :href="item.url" target="_blank"><i :class="item.style"></i></a>
                <a v-if="item.type === 'image'" v-b-popover.hover.top.html="popoverMethod(item)"><i :class="item.style"></i></a>
            </div>
        </div>
        <b-container>
            <b-row>
                <b-col md="4" class="recent_comment will_hide">
                    <h3 class="meta-title">最近回复</h3>
                    <p v-if="recent_comment.list.length > 0" v-for="(item, index) of recent_comment.list" :key="index"><a :href="'/article/' + item.articleId + '#' + item._id">{{item.name}}&nbsp;:&nbsp;{{item.comment}}</a></p>
                    <p v-if="recent_comment.list.length === 0" >
                        还没有人回复
                    </p>
                </b-col>
                <b-col md="4" class="bl-1">
                    <p class="mb-2"><img :src="user_info.ico ? user_info.ico : '/avatar.png'" height="60"></p>
                    <p>Theme is Pinghsu by Chakhsu</p>
                    <p>Powered by N-Boke</p>
                    <p>© 2018 <span>{{(user_info && user_info.nickname) ? user_info.nickname : "未具名"}}</span>的博客</p>
                </b-col>
                <b-col md="4" class="recent_comment bl-1 will_hide">
                    <h3 class="meta-title">最新文章</h3>
                    <p v-if="recent_post.list.length > 0" v-for="(item, index) of recent_post.list" :key="index"><a :href="'/article/' + item._id">{{item.title}}</a></p>
                    <p v-if="recent_post.list.length === 0" >
                        还没有发表文章
                    </p>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    export default {
        name: "myFooter",
        computed: {
            ...mapGetters({
                user_info: 'getUserInfo',
                recent_comment: 'getRecentComment',
                recent_post: 'getRecentPost'
            })
        },
        methods:{
            popoverMethod(item){
                return '<img src="' + item.url + '" width="256" style="display: block;margin-left: -3px;border-radius: 0.2rem;">'
            }
        }
    }
</script>

<style scoped>
.my_footer_container{
    background: #FFF;
    padding-bottom: 1.5em;
}
    .social_link{
        display: flex;
        flex-direction: row;
        justify-content: center;
        color: #5f5f5f;
        align-items: center;
        padding: 25px 0;
        border-bottom: 1px solid rgba(184,197,214,.2);
        margin-bottom: 1.5em;
    }
    .social_link a{
        margin: 0 25px;
    }
    .my_footer_container .container p {
        text-align: center;
        color: #5f5f5f;
        font-size: 14px;
        margin-bottom: 0.2rem;
    }
.bl-1{
    border-left: none;
}
.will_hide{
    display: none;
}
@media (min-width: 768px){
    .bl-1{
        border-left: 1px solid rgba(184,197,214,.2);
    }
    .will_hide{
        display: block;
    }
}

    .meta-title{
        font-size: 14px;
        font-weight: bold;
        padding: 0 0 10px 0;
        text-decoration: none;
        color: #5f5f5f;
    }
    .recent_comment p{
        text-align: left !important;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>