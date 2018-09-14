<template>
    <div>
        <div class="main_container">
            <b-breadcrumb class="bread_head" :items="breadcrumb"/>
            <loading ref="load"></loading>
            <b-card v-if="!loading" no-body>
                <b-tabs small card @input="changTab">
                    <b-tab title="图片" active class="bg-dark">
                        <b-row class="flex_space_between">
                            <div>
                                <b-dropdown size="sm" id="ddown1" :text="image.groupIndex == null ? '选择分组' : groupList[image.groupIndex].name" class="m-md-2">
                                    <b-dropdown-item v-for="(item, index) of groupList" :key="index" @click="selectGroup(0, index)">{{item.name}}</b-dropdown-item>
                                    <b-dropdown-divider></b-dropdown-divider>
                                    <b-dropdown-item v-b-modal.modalForTypes>新建分组</b-dropdown-item>
                                </b-dropdown>
                                <span v-if="image.groupIndex!==null">
                                    <b-button size="sm" variant="secondary" class="mr-2" @click="resetGroup(0)">
                                        <i class="fa fa-times"></i>
                                    </b-button>
                                    <b-button size="sm" variant="secondary" @click="deleteGroup(0, groupList[image.groupIndex]._id)">
                                        <i class="fa fa-trash-o"></i>
                                    </b-button>
                                </span>
                            </div>
                            <div>
                                <b-button size="sm" variant="success" @click="triggerUpload(0)" class="upload_btn">
                                    <i class="fa fa-plus-square "></i> 上传
                                    <input id="uploadImage" class="upload" @change='add_img'  type="file" accept="image/*">
                                </b-button>
                            </div>
                        </b-row>
                        <div v-if="imageList.length > 0" class="tab_parent">
                            <div class="images">
                                <div v-for="(item,index) of imageList" class="image_item">
                                    <div class="image">
                                        <b-img center :src="item.url" alt="Thumbnail" />
                                    </div>
                                    <div class="hover">
                                        <b-button size="sm" variant="danger" @click="deleteSource(0, index)">
                                            <i class="fa fa-trash-o"></i>
                                        </b-button>
                                        <b-dropdown v-if="groupList.length > 0" variant="secondary" size="sm" no-caret>
                                            <template slot="button-content">
                                                <i class="fa fa-reorder"></i>
                                            </template>
                                            <b-dropdown-header>移动到分组</b-dropdown-header>
                                            <b-dropdown-item v-for="(group, group_i) of groupList" :key="group_i" @click="setSource(0, index, group._id)" v-if="group._id!==item.group">{{group.name}}</b-dropdown-item>
                                        </b-dropdown>
                                    </div>
                                    <p>{{item.originalname}}</p>
                                </div>
                            </div>

                            <b-pagination align="center" size="sm" :total-rows="image.totalNum" v-model="image.currentPage" :per-page="10" @change="getImageList"></b-pagination>
                        </div>
                        <div v-if="imageList.length === 0" class="blanket">
                            <i class="fa fa-child"></i>&nbsp;&nbsp;&nbsp;&nbsp;没有素材
                        </div>
                    </b-tab>
                    <b-tab title="音频" class="bg-dark">
                        <div class="tab_parent">
                            <div class="medias">
                                <div v-for="(item,index) of mediaList" :key="index" class="media_item">
                                    <div class="media">
                                        <audio :src="item.url" controls="controls" loop="loop"></audio>
                                    </div>
                                    <p><i class="fa fa-plus mr-2"></i> <a href="javascript:void(0);">{{item.originalname}}</a></p>
                                </div>
                            </div>
                            <b-pagination align="center" size="sm" :total-rows="media.totalNum" v-model="media.currentPage" :per-page="10" @change="getImageList"></b-pagination>
                        </div>
                        <div class="upload_btn" @click="triggerUpload(1)"><i class="fa fa-plus-square "></i> 上传<input id="uploadMedia" class="upload" @change='add_media'  type="file" accept="audio/*"></div>
                    </b-tab>
                    <b-tab title="视频" class="bg-dark">
                        <div class="tab_parent">
                            <div class="medias">
                                <div v-for="(item,index) of videoList" :key="index" class="video_item">
                                    <div class="video">
                                        <video :src="item.url" controls="controls" loop="loop"></video>
                                    </div>
                                    <p><i class="fa fa-plus mr-2"></i> <a href="javascript:void(0);">{{item.originalname}}</a></p>
                                </div>
                            </div>
                            <b-pagination align="center" size="sm" :total-rows="video.totalNum" v-model="video.currentPage" :per-page="10" @change="getVideoList"></b-pagination>
                        </div>
                        <div class="upload_btn" @click="triggerUpload(2)"><i class="fa fa-plus-square "></i> 上传<input id="uploadVideo" class="upload" @change='add_video'  type="file" accept="video/*"></div>
                    </b-tab>
                </b-tabs>
            </b-card>
            <b-modal id="modalForTypes" size="sm" ref="modalForTypes" title="添加分组" @ok="handleOk" @shown="clearName">
                <form @submit.stop.prevent="handleSubmit">
                    <b-form-input type="text" size="sm" placeholder="请输入要添加的分组" v-model="temp_type"></b-form-input>
                </form>
            </b-modal>
        </div>
    </div>
</template>

<script>
    import loading from '../../../../components/Loading.vue'
    export default {
        name: "index",
        components: {
            loading
        },
        data(){
            return {
                breadcrumb: [{
                    text: 'Source',
                    href: '/admin/app/source/index'
                }],
                groupList:[],
                imageList:[],
                mediaList:[],
                videoList:[],
                image:{
                    totalNum:1,
                    currentPage:1,
                    groupIndex: null,
                    accept: 'image/gif, image/jpeg, image/png, image/jpg',
                },
                media:{
                    totalNum:1,
                    currentPage:1,
                    groupIndex: null,
                    accept: 'audio/basic, audio/midi, audio/x-mid, audio/x-midi, audio/mpeg3, audio/mp3, audio/x-mpeg-3, audio/ogg',
                },
                video:{
                    totalNum:1,
                    currentPage:1,
                    groupIndex: null,
                    accept: 'video/ogg, video/mp4, video/webm',
                },
                temp_type: "",
                loading:true
            }
        },
        methods:{
            changTab (index) {
                switch(index){
                    case 0:
                        this.getImageList(1);
                        break;
                    case 1:
                        this.getMediaList(1);
                        break;
                    case 2:
                        this.getVideoList(1);
                        break;
                }
            },
            getImageList(page){
                let _that = this;
                this.image.currentPage = page;
                console.log(this.image.groupIndex, this.image.groupIndex == null, this.groupList);
                this.axios.get('/api/admin/source/image/'+page + (this.image.groupIndex !== null ? "?type=" + this.groupList[this.image.groupIndex]._id:"")).then(res=>{
                    if(res.data.code === "0000"){
                        _that.image.totalNum = res.data.data.totalNum;
                        _that.imageList = res.data.data.list
                    } else {
                        console.error(res);
                    }
                }).catch(res=>{
                    console.error(res);
                });
            },
            getMediaList(page){
                let _that = this;
                this.media.currentPage = page;
                this.axios.get('/api/admin/source/media/'+page).then(res=>{
                    if(res.data.code === "0000"){
                        _that.media.totalNum = res.data.data.totalNum;
                        _that.mediaList = res.data.data.list
                    } else {
                        console.error(res);
                    }
                }).catch(res=>{
                    console.error(res);
                });
            },
            getVideoList(page){
                let _that = this;
                this.video.currentPage = page;
                this.axios.get('/api/admin/source/video/'+page).then(res=>{
                    if(res.data.code === "0000"){
                        _that.video.totalNum = res.data.data.totalNum;
                        _that.videoList = res.data.data.list
                    } else {
                        console.error(res);
                    }
                }).catch(res=>{
                    console.error(res);
                });
            },
            add_img(event){
                let that = this;
                let img1=event.target.files[0];
                let type=img1.type;//文件的类型，判断是否是图片
                let size=img1.size;//文件的大小，判断图片的大小
                if(this.image.accept.indexOf(type) === -1){
                    return that.$eventHub.$emit('alert', {
                        type:"warning"
                        , message:"请选择我们支持的图片格式!"
                    });
                }
                if(size>3145728){
                    return that.$eventHub.$emit('alert', {
                        type:"warning"
                        , message:"请选择3M以内的图片!"
                    });
                }
                let form = new FormData();
                form.append('file',img1,img1.name);
                this.axios.post('/api/admin/article/upload/image',form,{
                    headers:{'Content-Type':'multipart/form-data'}
                }).then(response => {
                    that.getImageList(that.image.currentPage);
                }).catch(error => {
                    return that.$eventHub.$emit('alert', {
                        type:"warning"
                        , message:"上传图片出错!"
                    });
                })
            },
            add_media(event){
                let that = this;
                let img1=event.target.files[0];
                let type=img1.type;//文件的类型，判断是否是图片
                let size=img1.size;//文件的大小，判断图片的大小
                console.log(type);
                if(this.media.accept.indexOf(type) === -1){
                    return that.$eventHub.$emit('alert', {
                        type:"warning"
                        , message:"请选择我们支持的音频格式!"
                    });
                }
                if(size> 6 * 1024 * 1024){
                    return that.$eventHub.$emit('alert', {
                        type:"warning"
                        , message:"请选择6M以内的音频!"
                    });
                }
                let form = new FormData();
                form.append('file',img1,img1.name);
                this.axios.post('/api/admin/article/upload/media',form,{
                    headers:{'Content-Type':'multipart/form-data'}
                }).then(response => {
                    that.getMediaList(that.media.currentPage);
                }).catch(error => {
                    return that.$eventHub.$emit('alert', {
                        type:"warning"
                        , message:"上传音频出错!"
                    });
                })
            },
            add_video(event){
                let that = this;
                let img1=event.target.files[0];
                let type=img1.type;//文件的类型，判断是否是图片
                let size=img1.size;//文件的大小，判断图片的大小
                console.log(type);
                if(this.video.accept.indexOf(type) === -1){
                    return that.$eventHub.$emit('alert', {
                        type:"warning"
                        , message:"请选择我们支持的视频格式!"
                    });
                }
                if(size> 50 * 1024 * 1024){
                    return that.$eventHub.$emit('alert', {
                        type:"warning"
                        , message:"请选择50M以内的视频!"
                    });
                }
                let form = new FormData();
                form.append('file',img1,img1.name);
                this.axios.post('/api/admin/article/upload/video',form,{
                    headers:{'Content-Type':'multipart/form-data'}
                }).then(response => {
                    that.getVideoList(that.video.currentPage);
                }).catch(error => {
                    return that.$eventHub.$emit('alert', {
                        type:"warning"
                        , message:"上传视频出错!"
                    });
                })
            },
            triggerUpload(type){
                switch(type){
                    case 0:
                        document.getElementById("uploadImage").click();
                        break;
                    case 1:
                        document.getElementById("uploadMedia").click();
                        break;
                    case 2:
                        document.getElementById("uploadVideo").click();
                        break;
                }
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
                    that.groupList = response.data.data;
                    console.log(response);
                    that.clearName();
                    that.$refs.modalForTypes.hide();
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
            deleteSource (type,index){
                let sourceInfo, that = this;
                switch(type){
                    case 0:
                        sourceInfo = this.imageList[index];
                        break;
                }
                this.axios.post('/api/admin/source/delete', {_id:sourceInfo._id}).then(response => {
                    switch(type){
                        case 0:
                            that.getImageList(that.image.currentPage);
                            break;
                    }
                }).catch(error => {
                    return that.$eventHub.$emit('alert', {
                        type:"warning"
                        , message:"删除资源出错!"
                    });
                })
            },
            setSource (type,index, type_id){
                let sourceInfo, that = this;
                switch(type){
                    case 0:
                        sourceInfo = this.imageList[index];
                        break;
                }
                this.axios.post('/api/admin/source/set', {_id:sourceInfo._id, type:type_id}).then(response => {
                    switch(type){
                        case 0:
                            that.getImageList(that.image.currentPage);
                            break;
                    }
                }).catch(error => {
                    return that.$eventHub.$emit('alert', {
                        type:"warning"
                        , message:"删除资源出错!"
                    });
                })
            },
            selectGroup (type,index){
                switch(type){
                    case 0:
                        this.image.groupIndex = index;
                        this.getImageList(1);
                        break;
                }
            },
            resetGroup (type){
                switch(type){
                    case 0:
                        this.image.groupIndex = null;
                        this.getImageList(1);
                        break;
                }
            },
            deleteGroup (type, id){
                let that = this;
                this.axios.post('/api/admin/source/type/delete', {_id:id}).then(response => {
                    if(response.data.code ==="0000"){
                        that.groupList = response.data.data;
                        switch(type){
                            case 0:
                                that.image.groupIndex = null;
                                that.getImageList(that.image.currentPage);
                                break;
                        }
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
            }
        },
        beforeMount(){
            let that = this;
            this.axios.get('/api/admin/source/type/list').then(response => {
                that.groupList = response.data.data;
                that.loading = false;
                that.$refs.load.finished();
                console.log(response);
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
    .image_item .hover{
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
    .image_item .hover i{
        cursor: pointer;
    }
    .image_item:hover .hover{
        display: flex;
    }
    .image_item p, .media_item p, .video_item p{
        width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin: 0.2rem 0 0 0;
        background: #ffffff2e;
        padding: 5px;
        border-radius: 0.1rem;
        text-align: center;
        color: #FFF;
    }
    .media_item p{
        width: 300px;
        border-radius: 0.3rem;
        background: #f1f3f4;
    }
    .video_item p{
        width: 250px;
        border-radius: 0.3rem;
        background: #f1f3f4;
    }
    .media_item p>.fa, .video_item p>.fa{
        color: #4e4e4e;
        display: none;
    }
    .media_item p:hover>.fa, .video_item p:hover>.fa{
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
        visibility: hidden;
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