<template>
    <div class="my_footer_container">
        <div class="social_link">
            <a><i class="fa fa-weibo"></i></a>
            <!--<a><i class="fa fa-weixin"></i></a>-->
            <a><i class="icon-zhihu-square-fill"></i></a>
            <!--<a><i class="fa fa-qq"></i></a>-->
            <a><i class="fa fa-github"></i></a>
            <a><i class="fa fa-facebook-square"></i></a>
            <!--<a><i class="fa fa-twitter"></i></a>-->
        </div>
        <b-container>
            <p>Theme is Pinghsu by Chakhsu</p>
            <p>Powered by Typecho</p>
            <p>© 2018 周春宇的博客</p>
        </b-container>
    </div>
</template>

<script>
    export default {
        name: "myFooter"
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