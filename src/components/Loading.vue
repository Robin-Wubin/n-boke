<template>
    <div class="loading" :style="{
    'margin': height+'px auto',
    'opacity' : opacity,
    'display' : display
  }">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
    </div>
</template>

<script>
    export default {
        name: "Loading",
        data(){
            return {
                height:100,
                opacity:1,
                display: 'block'
            }
        },
        methods:{
            finished () {
                let timer, i=0, taht=this;
                timer = setInterval(function(){
                    taht.height -= 10;
                    taht.opacity -= 0.1;
                    i++;
                    if(i === 10){
                        clearInterval(timer);
                        taht.display = 'none';
                    }
                }, 30);
            },
            start () {
                this.height = 100;
                this.opacity = 1;
                this.display = 'block';
            }
        }

    }
</script>

<style scoped>
    .loading{
        width: 80px;
        height: 40px;
    }
    .loading span{
        display: inline-block;
        width: 8px;
        height: 100%;
        border-radius: 4px;
        background: lightgreen;
        -webkit-animation: load 1s ease infinite;
    }
    @-webkit-keyframes load{
        0%,100%{
            height: 40px;
            background: lightgreen;
        }
        50%{
            height: 70px;
            margin: -15px 0;
            background: lightblue;
        }
    }
    .loading span:nth-child(2){
        -webkit-animation-delay:0.2s;
    }
    .loading span:nth-child(3){
        -webkit-animation-delay:0.4s;
    }
    .loading span:nth-child(4){
        -webkit-animation-delay:0.6s;
    }
    .loading span:nth-child(5){
        -webkit-animation-delay:0.8s;
    }
</style>