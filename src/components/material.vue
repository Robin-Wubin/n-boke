<template>
    <div class="material" v-if="display" @click="hide">
        <b-container @click.stop>
            <b-card no-body>
                <b-tabs small card @input="changTab">
                    <b-tab title="图片" active class="bg-dark">
                        <source-tab v-if="tabIndex===0" :tab_type="0" :is_components="true" :lastIndex="lastIndex" :quill="quill" @hide="hide" @update="update" :groupList="groupList"></source-tab>
                    </b-tab>
                    <b-tab title="音频" class="bg-dark">
                        <source-tab v-if="tabIndex===1" :tab_type="1" :is_components="true" :lastIndex="lastIndex" :quill="quill" @hide="hide" @update="update" :groupList="groupList"></source-tab>
                    </b-tab>
                    <b-tab title="视频" class="bg-dark">
                        <source-tab v-if="tabIndex===2" :tab_type="2" :is_components="true" :lastIndex="lastIndex" :quill="quill" @hide="hide" @update="update" :groupList="groupList"></source-tab>
                    </b-tab>
                </b-tabs>
            </b-card>
        </b-container>
    </div>
</template>

<script>
    import sourceTab from './source_tab'
    export default {
        name: "material",
        components: {
            sourceTab
        },
        data(){
            return {
                tabIndex:0,
                quill:null,
                lastIndex:0,
                display:false,
                groupList:[]
            }
        },
        methods:{
            changTab (index) {
                this.tabIndex = index;
            },
            show(quill, index){
                this.quill = quill;
                this.lastIndex = index;
                this.display = true;
                document.getElementsByTagName("body")[0].setAttribute("style","overflow:hidden");
            },
            hide(){
                this.display = false;
                document.getElementsByTagName("body")[0].setAttribute("style","overflow:auto");
            },
            update(group){
                console.log(group);
                this.groupList = group;
            }
        },
        mounted(){
        },
        beforeMount(){
            let that = this;
            this.axios.get('/api/admin/source/type/list').then(response => {
                that.groupList = response.data.data;
            }).catch(error => {
                return that.$eventHub.$emit('alert', {
                    type:"warning"
                    , message:"获取分组列表出错!"
                });
            })
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
        display: flex;
    }
    .card-body{
        max-height: 515px;
        overflow-y: scroll;
        position: relative;
    }
</style>