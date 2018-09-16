<template>
    <div>
        <div class="main_container">
            <b-breadcrumb class="bread_head" :items="breadcrumb"/>
            <loading ref="loadGroup"></loading>
            <b-card v-if="!loading" no-body>
                <b-tabs small card @input="changTab">
                    <b-tab title="图片" active class="bg-dark">
                        <source-tab v-if="tabIndex===0" :tab_type="0" :groupList="groupList" @update="update"></source-tab>
                    </b-tab>
                    <b-tab title="音频" class="bg-dark">
                        <source-tab v-if="tabIndex===1" :tab_type="1" :groupList="groupList" @update="update"></source-tab>
                    </b-tab>
                    <b-tab title="视频" class="bg-dark">
                        <source-tab v-if="tabIndex===2" :tab_type="2" :groupList="groupList" @update="update"></source-tab>
                    </b-tab>
                </b-tabs>
            </b-card>
        </div>
    </div>
</template>

<script>
    import sourceTab from '../../../../components/source_tab'
    import loading from '../../../../components/Loading.vue'
    export default {
        name: "index",
        components: {
            sourceTab, loading
        },
        data(){
            return {
                tabIndex:0,
                breadcrumb: [{
                    text: 'Source',
                    href: '/admin/app/source/index'
                }]
                ,groupList:[]
                ,loading:true
            }
        },
        methods:{
            changTab (index) {
                this.tabIndex = index;
            },
            update(group){
                console.log(group);
                this.groupList = group;
            }
        },
        beforeMount(){
            let that = this;
            this.axios.get('/api/admin/source/type/list').then(response => {
                that.groupList = response.data.data;
                that.loading = false;
                that.$refs.loadGroup.finished();
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
    .bread_head{
        margin-bottom: 0;
        border-radius: 0;
    }
</style>