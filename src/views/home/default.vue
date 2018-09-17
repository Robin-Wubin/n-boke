<template>

    <div class="list">
        <b-card v-for="(irem,index) of [0,0,0,0,0,0,0]" :key="index"
                img-src="https://picsum.photos/600/300/?image=25"
                img-alt="Image"
                img-top
                tag="article"
                style="max-width: 20rem;"
                class="n_boke_card">
            <div class="slant reverse-slant bg-deepgrey"></div>
            <div class="slant"></div>
            <div class="card-content">
                <p class="card-text">
                    Some quick example text to build on the card title and make up the bulk of the card's content.
                </p>
                <b-button href="#" variant="primary">Go somewhere</b-button>
            </div>
        </b-card>
    </div>
</template>

<script>
    export default {
        name: "default",
        data(){
            return{
                name: '点我'
            }
        },
        methods: {
            link(){
                this.$router.push('list')
            }
        }
    }
</script>

<style scoped>
    .list{
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        flex-wrap: wrap;
        padding: 50px 0;
    }
    .n_boke_card{
        min-width: 280px;
        margin: 25px 30px !important;
        overflow: hidden;
    }
    .n_boke_card .card-body{
        position: relative;
        padding: 0;
    }
    .n_boke_card .card-content{
        position: relative;
        padding: 0.25em 1.25em 1.25em;
        background: #FFF;
    }
    .slant{
        position: absolute;
        right: 0;
        top: 0;
        left: 0;
        z-index: 0;
        width: 110%;
        min-height: 75pt;
        background-color: #fff;
        -webkit-transform: rotate(7deg) translate(-10px,-20px);
        transform: rotate(7deg) translate(-10px,-20px);
        -ms-transform: rotate(7deg) translate(-10px,-20px);
    }
    .slant.reverse-slant {
        -webkit-transform: rotate(-10deg) translate(10px,-20px);
        -ms-transform: rotate(-10deg) translate(10px,-20px);
        transform: rotate(-10deg) translate(10px,-20px);
        opacity: .7;
        background-color: #f68e5f;
        -webkit-box-shadow: none;
        box-shadow: none;
    }
    .bg-deepgrey {
        background-color: rgba(0,0,0,.5)!important;
    }
</style>