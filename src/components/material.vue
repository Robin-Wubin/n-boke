<template>
    <div class="material" :style="{
    'display' : display
    }">
        <b-container>
            <b-card no-body>
                <b-tabs small card>
                    <b-tab title="图片" active>
                        Tab Contents 1
                    </b-tab>
                    <b-tab title="音频">
                        Tab Contents 2
                    </b-tab>
                    <b-tab title="视频">
                        Tab Contents 2
                    </b-tab>
                </b-tabs>
            </b-card>
        </b-container>
    </div>
</template>

<script>
    export default {
        name: "material",
        data(){
            return {
                display:"none"
            }
        },
        methods:{
            show(){
                this.display = "flex";
            },
            hide(){
                this.display = "none";
            }
        }
    }
</script>

<style scoped>
    .material{
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: #33333396;
        z-index: 5;
        flex-direction: row;
        align-items: center;
    }
    .window{

    }
</style>