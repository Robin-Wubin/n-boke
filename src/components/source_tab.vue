<template>
    <div>
        <div>
            <b-row class="flex_space_between">
                <div>
                    <b-dropdown size="sm" id="ddown1" :text="groupIndex == null ? '选择分组' : group_list[groupIndex].name" class="m-md-2">
                        <b-dropdown-item v-for="(item, index) of group_list" :key="index" @click="selectGroup(index)">{{item.name}}</b-dropdown-item>
                        <b-dropdown-divider></b-dropdown-divider>
                        <b-dropdown-item v-b-modal.modalForGroup>新建分组</b-dropdown-item>
                    </b-dropdown>
                    <span v-if="groupIndex!==null">
                                    <b-button size="sm" variant="secondary" class="mr-2" @click="resetGroup()">
                                        <i class="fa fa-times"></i>
                                    </b-button>
                                    <b-button size="sm" variant="secondary" @click="deleteGroup(group_list[groupIndex]._id)">
                                        <i class="fa fa-trash-o"></i>
                                    </b-button>
                                </span>
                </div>
                <div>
                    <b-button size="sm" variant="success" @click="triggerUpload()" class="upload_btn">
                        <i class="fa fa-plus-square "></i> 上传
                        <input id="upload" class="upload" @change='add_source'  type="file" :accept="acceptType">
                    </b-button>
                </div>
            </b-row>
            <loading ref="load"></loading>
            <div v-if="list.length > 0" class="tab_parent">
                <div v-if="tab_type===0" class="images">
                    <div v-for="(item,index) of list" class="image_item">
                        <div class="image">
                            <b-img center :src="item.url" alt="Thumbnail" />
                        </div>
                        <div class="hover">
                            <b-button size="sm" variant="danger" @click="deleteSource(index)">
                                <i class="fa fa-trash-o"></i>
                            </b-button>
                            <b-dropdown v-if="group_list.length > 0" variant="secondary" size="sm" no-caret>
                                <template slot="button-content">
                                    <i class="fa fa-reorder"></i>
                                </template>
                                <b-dropdown-header>移动到分组</b-dropdown-header>
                                <b-dropdown-item v-for="(group, group_i) of group_list" :key="group_i" @click="setSource(index, group._id)" v-if="group._id!==item.group">{{group.name}}</b-dropdown-item>
                            </b-dropdown>
                        </div>
                        <p v-if="is_components"><i class="fa fa-plus mr-2"></i> <a href="javascript:void(0);" @click="insert(index)">{{item.originalname}}</a></p>
                        <p v-if="!is_components"><a href="javascript:void(0);">{{item.originalname}}</a></p>
                    </div>
                </div>
                <div v-if="tab_type===1" class="medias">
                    <div v-for="(item,index) of list" :key="index" class="media_item">
                        <div class="media">
                            <audio :src="item.url" controls="controls" loop="loop"></audio>
                        </div>
                        <div class="ctrl">
                            <b-button size="sm" variant="danger" @click="deleteSource(index)">
                                <i class="fa fa-trash-o"></i>
                            </b-button>
                            <p v-if="is_components">
                                <i class="fa fa-plus mr-2"></i> <a href="javascript:void(0);" @click="insert(index)">{{item.originalname}}</a>
                            </p>
                            <p v-if="!is_components">
                                <a href="javascript:void(0);">{{item.originalname}}</a>
                            </p>
                            <b-dropdown v-if="group_list.length > 0" variant="secondary" size="sm" no-caret>
                                <template slot="button-content">
                                    <i class="fa fa-reorder"></i>
                                </template>
                                <b-dropdown-header>移动到分组</b-dropdown-header>
                                <b-dropdown-item v-for="(group, group_i) of group_list" :key="group_i" @click="setSource(index, group._id)" v-if="group._id!==item.group">{{group.name}}</b-dropdown-item>
                            </b-dropdown>
                        </div>

                    </div>
                </div>
                <div v-if="tab_type===2" class="medias">
                    <div v-for="(item,index) of list" :key="index" class="video_item">
                        <div class="video">
                            <video :src="item.url" controls="controls" loop="loop"></video>
                        </div>
                        <div class="ctrl">
                            <b-button size="sm" variant="danger" @click="deleteSource(index)">
                                <i class="fa fa-trash-o"></i>
                            </b-button>
                            <p v-if="is_components">
                                <i class="fa fa-plus mr-2"></i> <a href="javascript:void(0);" @click="insert(index)">{{item.originalname}}</a>
                            </p>
                            <p v-if="!is_components">
                                <a href="javascript:void(0);">{{item.originalname}}</a>
                            </p>
                            <b-dropdown v-if="group_list.length > 0" variant="secondary" size="sm" no-caret>
                                <template slot="button-content">
                                    <i class="fa fa-reorder"></i>
                                </template>
                                <b-dropdown-header>移动到分组</b-dropdown-header>
                                <b-dropdown-item v-for="(group, group_i) of group_list" :key="group_i" @click="setSource(index, group._id)" v-if="group._id!==item.group">{{group.name}}</b-dropdown-item>
                            </b-dropdown>
                        </div>
                    </div>
                </div>
                <b-pagination align="center" size="sm" :total-rows="totalNum" v-model="currentPage" :per-page="perPage" @change="getList"></b-pagination>
            </div>
            <div v-if="list.length === 0" class="blanket">
                <i class="fa fa-child"></i>&nbsp;&nbsp;&nbsp;&nbsp;没有素材
            </div>
        </div>
        <b-modal id="modalForGroup" size="sm" ref="modalForGroup" title="添加分组" @ok="handleOk" @shown="clearName">
            <form @submit.stop.prevent="handleSubmit">
                <b-form-input type="text" size="sm" placeholder="请输入要添加的分组" v-model="temp_type"></b-form-input>
            </form>
        </b-modal>

    </div>
</template>

<script>
    import loading from './Loading.vue'
    export default {
        name: "source_tab",
        components: {
            loading
        },
        data(){
            let data = {
                temp_type: "",
                loading:true,
                list:[],
                totalNum:1,
                currentPage:1,
                groupIndex: null,
                group_list: this.groupList
            };
            console.log(this.tab_type);
            switch(this.tab_type){
                case 0:
                    data.perPage=8;
                    data.accept='image/gif, image/jpeg, image/png, image/jpg';
                    data.acceptType='image/*';
                    break;
                case 1:
                    data.perPage=10;
                    data.accept='audio/basic, audio/midi, audio/x-mid, audio/x-midi, audio/mpeg3, audio/mp3, audio/x-mpeg-3, audio/ogg';
                    data.acceptType='audio/*';
                    break;
                case 2:
                    data.perPage=10;
                    data.accept='video/ogg, video/mp4, video/webm';
                    data.acceptType='video/*';
                    break;
            }
            return data;
        },
        props:{
            tab_type:{
                type: Number,
                required: true,
                default: 0
            },
            is_components:{
                type: Boolean,
                default: false
            },
            lastIndex:{
                type: Number
            },
            quill:{
                type: Object
            },
            groupList:{
                required: true,
                type: Array
            }
        },
        methods:{
            getList(page){
                let _that = this, url;
                _that.loading = true;
                this.currentPage = page;
                switch(this.tab_type){
                    case 0:
                        url = '/api/admin/source/image/';
                        break;
                    case 1:
                        url = '/api/admin/source/media/';
                        break;
                    case 2:
                        url = '/api/admin/source/video/';
                        break;
                }
                this.axios.get(url + page + (this.groupIndex !== null ? "?type=" + this.group_list[this.groupIndex]._id:"")).then(res=>{
                    if(res.data.code === "0000"){
                        _that.totalNum = res.data.data.totalNum;
                        _that.list = res.data.data.list;
                        _that.loading = false;
                        _that.$refs.load.finished();
                    } else {
                        console.error(res);
                    }
                }).catch(res=>{
                    console.error(res);
                });
            },
            add_source(event){
                let that = this, typeName, sizeLimit, sizeName, url;
                let img1=event.target.files[0];
                let type=img1.type;//文件的类型，判断是否是图片
                let size=img1.size;//文件的大小，判断图片的大小

                switch(this.tab_type){
                    case 0:
                        typeName = '图片';
                        sizeLimit = 3145728;
                        sizeName = "3M";
                        url = "/api/admin/article/upload/image";
                        break;
                    case 1:
                        typeName = '音频';
                        sizeLimit = 6 * 1024 * 1024;
                        sizeName = "6M";
                        url = "/api/admin/article/upload/media";
                        break;
                    case 2:
                        typeName = '视频';
                        sizeLimit = 50 * 1024 * 1024;
                        sizeName = "50M";
                        url = "/api/admin/article/upload/video";
                        break;
                }
                if(this.accept.indexOf(type) === -1){
                    return that.$eventHub.$emit('alert', {
                        type:"warning"
                        , message:"请选择我们支持的" + typeName + "格式!"
                    });
                }
                if(size>sizeLimit){
                    return that.$eventHub.$emit('alert', {
                        type:"warning"
                        , message:"请选择" + sizeName + "以内的" + typeName + "!"
                    });
                }
                let form = new FormData();
                form.append('file',img1,img1.name);
                this.axios.post(url,form,{
                    headers:{'Content-Type':'multipart/form-data'}
                }).then(response => {
                    that.getList(that.currentPage);
                }).catch(error => {
                    return that.$eventHub.$emit('alert', {
                        type:"warning"
                        , message:"上传" + typeName + "出错!"
                    });
                })
            },
            triggerUpload(){
                document.getElementById("upload").click();
            },
            handleOk (evt) {
                // Prevent modal from closing
                evt.preventDefault();
                if (!this.temp_type) {
                    alert('Please enter your name')
                } else {
                    this.handleSubmit()
                }
            },
            handleSubmit () {
                let that = this;
                this.axios.post('/api/admin/source/type/new', {name:this.temp_type}).then(response => {
                    that.group_list = response.data.data;
                    this.$emit('update', that.group_list);
                    console.log(response);
                    that.clearName();
                    that.$refs.modalForGroup.hide();
                }).catch(error => {
                    return that.$eventHub.$emit('alert', {
                        type:"warning"
                        , message:"获取分组列表出错!"
                    });
                })
            },
            clearName () {
                this.temp_type = ''
            },
            deleteSource (index){
                let sourceInfo, that = this, url;
                sourceInfo = this.list[index];
                this.axios.post('/api/admin/source/delete', {_id:sourceInfo._id}).then(response => {
                    that.getList(that.currentPage);
                }).catch(error => {
                    return that.$eventHub.$emit('alert', {
                        type:"warning"
                        , message:"删除资源出错!"
                    });
                })
            },
            setSource (index, type_id){
                let sourceInfo, that = this;
                sourceInfo = this.list[index];
                this.axios.post('/api/admin/source/set', {_id:sourceInfo._id, type:type_id}).then(response => {
                    that.getList(that.currentPage);
                }).catch(error => {
                    return that.$eventHub.$emit('alert', {
                        type:"warning"
                        , message:"删除资源出错!"
                    });
                })
            },
            selectGroup (index){
                this.groupIndex = index;
                this.getList(1);
            },
            resetGroup (){
                this.groupIndex = null;
                this.getList(1);
            },
            deleteGroup (id){
                let that = this;
                this.axios.post('/api/admin/source/type/delete', {_id:id}).then(response => {
                    if(response.data.code ==="0000"){
                        that.group_list = response.data.data;
                        this.$emit('update', that.group_list);
                        that.groupIndex = null;
                        that.getList(that.currentPage);
                    } else {
                        return that.$eventHub.$emit('alert', {
                            type:"warning"
                            , message:response.data.msgCN
                        });
                    }
                }).catch(error => {
                    return that.$eventHub.$emit('alert', {
                        type:"warning"
                        , message:"删除分组出错!"
                    });
                })
            },
            insert(index){
                let type;
                if(this.is_components && this.quill){
                    switch(this.tab_type){
                        case 0:
                            type = 'image';
                            break;
                        case 1:
                            type = 'audio';
                            break;
                        case 2:
                            type = 'video';
                            break;
                    }
                    this.quill.insertEmbed(this.lastIndex, type, this.list[index].url);
                    this.quill.update();
                    this.quill.setSelection(this.lastIndex + 1);
                    this.$emit('hide');
                }
            },
        },
        beforeMount(){
            this.getList(1);
        }
    }
</script>

<style scoped>
    .images, .medias{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-around;
    }
    .image_item{
        width: 150px;
        border-radius: 5px;
        font-size: 12px;
        margin: 0.5rem 1rem;
        position: relative;
    }
    .media_item{
        width: 300px;
        border-radius: 5px;
        font-size: 12px;
        margin: 0.5rem 1rem;
        position: relative;
    }
    .video_item{
        width: 250px;
        border-radius: 5px;
        font-size: 12px;
        margin: 0.5rem 1rem;
        position: relative;
    }
    .image_item .hover, .video_item .hover{
        width: 150px;
        height: 150px;
        position: absolute;
        top: 0;
        background: rgba(39, 35, 39, 0.48);
        color: #FFF;
        display: none;
        justify-content: space-between;
        align-items: flex-start;
        padding: 10px;
        font-size: 20px;
    }
    .image_item .hover i, .video_item .hover i{
        cursor: pointer;
    }
    .image_item:hover .hover, .video_item:hover .hover{
        display: flex;
    }
    .image_item p{
        width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin: 0.2rem 0 0 0;
        padding: 5px;
        text-align: center;
        color: #FFF;
        border-radius: 0.3rem;
        background: #f1f3f4;
    }
    .media_item .ctrl, .video_item .ctrl{
        width: 300px;
        margin: 0.2rem 0 0 0;
        text-align: center;
        color: #FFF;
        border-radius: 0.3rem;
        background: #f1f3f4;
        display: flex;
        flex-direction: row;
        padding: 0;
        justify-content: space-between;
    }
    .video_item .ctrl{
        width: 250px;
    }
    .media_item .ctrl>p, .video_item .ctrl>p{
        width: 230px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 34px;
        margin: 0;
    }
    .media_item p>.fa, .video_item p>.fa, .image_item p>.fa{
        color: #4e4e4e;
        display: none;
    }
    .media_item p:hover>.fa, .video_item p:hover>.fa, .image_item p:hover>.fa{
        display: inline-block;
    }
    .image{
        width: 150px;
        height: 150px;
        padding: 5px;
        border-radius: 5px;
        border: 2px solid #b1b1b1;
        background: #FFF;
    }
    .media{
        margin-bottom: 5px;
    }
    .image img{
        max-height: 100%;
        max-width: 100%;
        margin: 50%;
        box-sizing: border-box;
        transform: translateY(-50%);
    }
    .video{
        width: 250px;
        height: 250px;
        padding: 5px;
        border-radius: 5px;
        border: 2px solid #b1b1b1;
        background: #12161b;
        overflow: hidden;
    }
    .video video{
        max-height: 100%;
        max-width: 100%;
        margin: 50%;
        box-sizing: border-box;
        transform: translateX(-50%) translateY(-50%);
    }
    .upload_btn{
        font-size: 12px;
        overflow: hidden;
        text-align: center;
        margin: 10px auto;
    }
    .upload_btn input[type=file]
    {
        position: absolute;
        display: none;
    }
    .flex_space_between{
        justify-content: space-between;
    }
    .dropdown-item{
        font-size: 14px;
    }
    .blanket{
        font-size: 14px;
        line-height: 250px;
        text-align: center;
        color: #CCC;
    }
</style>