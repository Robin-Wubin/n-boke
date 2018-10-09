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
            <p>Theme is Pinghsu by Chakhsu</p>
            <p>Powered by N-Boke</p>
            <p>© 2018 <span>{{(user_info && user_info.nickname) ? user_info.nickname : "未具名"}}</span>的博客</p>
        </b-container>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    export default {
        name: "myFooter",
        computed: {
            ...mapGetters({
                user_info: 'getUserInfo'
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
}
    .social_link{
        display: flex;
        flex-direction: row;
        justify-content: center;
        color: #5f5f5f;
        align-items: center;
        padding: 25px 0;
        border-bottom: 1px solid rgba(184,197,214,.2);
        margin-bottom: 2.5em;
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
</style>