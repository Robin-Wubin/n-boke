<template>
    <div class="material" v-if="display" @click="hide">
        <b-container @click.stop>
            <b-card no-body>
                <b-tabs small card @input="changTab">
                    <b-tab title="图片" active class="bg-dark">
                        <div class="tab_parent">
                            <div class="images">
                                <div v-for="(item,index) of imageList" class="image_item">
                                    <div class="image">
                                        <b-img center :src="item.url" alt="Thumbnail" />
                                    </div>
                                    <div class="hover">
                                        <i class="fa fa-plus-circle" @click="insertImg(index)"></i>
                                    </div>
                                    <p>{{item.originalname}}</p>
                                </div>
                            </div>

                            <b-pagination align="center" size="sm" :total-rows="image.totalNum" v-model="image.currentPage" :per-page="10" @change="getImageList"></b-pagination>
                        </div>
                        <div class="upload_btn" @click="triggerImageUpload"><i class="fa fa-plus-square "></i> 上传<input id="uploadImage" class="upload" @change='add_img'  type="file" accept="image/*"></div>
                    </b-tab>
                    <b-tab title="音频" class="bg-dark">
                        <div class="tab_parent">
                            <div class="medias">
                                <div v-for="(item,index) of mediaList" :key="index" class="media_item">
                                    <div class="media">
                                        <audio :src="item.url" controls="controls" loop="loop"></audio>
                                    </div>
                                    <p><i class="fa fa-plus mr-2"></i> <a href="javascript:void(0);" @click="insertMedia(index)">{{item.originalname}}</a></p>
                                </div>
                            </div>
                            <b-pagination align="center" size="sm" :total-rows="media.totalNum" v-model="media.currentPage" :per-page="10" @change="getImageList"></b-pagination>
                        </div>
                        <div class="upload_btn" @click="triggerMediaUpload"><i class="fa fa-plus-square "></i> 上传<input id="uploadMedia" class="upload" @change='add_media'  type="file" accept="audio/*"></div>
                    </b-tab>
                    <b-tab title="视频" class="bg-dark">
                        <div class="tab_parent">
                            <div class="medias">
                                <div v-for="(item,index) of videoList" :key="index" class="video_item">
                                    <div class="video">
                                        <video :src="item.url" controls="controls" loop="loop"></video>
                                    </div>
                                    <p><i class="fa fa-plus mr-2"></i> <a href="javascript:void(0);" @click="insertVideo(index)">{{item.originalname}}</a></p>
                                </div>
                            </div>
                            <b-pagination align="center" size="sm" :total-rows="video.totalNum" v-model="video.currentPage" :per-page="10" @change="getImageList"></b-pagination>
                        </div>
                        <div class="upload_btn" @click="triggerVideoUpload"><i class="fa fa-plus-square "></i> 上传<input id="uploadVideo" class="upload" @change='add_video'  type="file" accept="video/*"></div>
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
                display:false,
                imageList:[],
                mediaList:[],
                videoList:[],
                image:{
                    totalNum:1,
                    currentPage:1,
                    accept: 'image/gif, image/jpeg, image/png, image/jpg',
                },
                media:{
                    totalNum:1,
                    currentPage:1,
                    accept: 'audio/basic, audio/midi, audio/x-mid, audio/x-midi, audio/mpeg3, audio/mp3, audio/x-mpeg-3, audio/ogg',
                },
                video:{
                    totalNum:1,
                    currentPage:1,
                    accept: 'video/ogg, video/mp4, video/webm',
                },
                quill:null,
                lastIndex:0
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
            show(quill, index){
                this.quill = quill;
                this.lastIndex = index;
                this.display = true;
            },
            hide(){
                this.display = false;
            },
            getImageList(page){
                let _that = this;
                this.image.currentPage = page;
                this.axios.get('/api/admin/source/image/'+page).then(res=>{
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
            insertImg(index){
                this.hide();
                this.quill.insertEmbed(this.lastIndex, 'image', this.imageList[index].url);
                this.quill.update();
                this.quill.setSelection(1);
            },
            insertMedia(index){
                this.hide();
                this.quill.insertEmbed(this.lastIndex, 'video', this.mediaList[index].url);
                this.quill.update();
                this.quill.setSelection(1);
            },
            insertVideo(index){
                this.hide();
                this.quill.insertEmbed(this.lastIndex, 'video', this.videoList[index].url);
                this.quill.update();
                this.quill.setSelection(1);
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
            triggerImageUpload(){
                document.getElementById("uploadImage").click();
            },
            triggerMediaUpload(){
                document.getElementById("uploadMedia").click();
            },
            triggerVideoUpload(){
                document.getElementById("uploadVideo").click();
            }
        },
        mounted(){
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
        width: 310px;
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
        background: #5252529c;
        color: #FFF;
        text-align: center;
        line-height: 150px;
        font-size: 38px;
        display: none;
        cursor: pointer;
    }
    .image_item:hover .hover{
        display: block;
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
        width: 310px;
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
        background: #FFF;
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
        color: #007bff;
        background-color: #fff;
        border: 1px solid #dee2e6;
        border-radius: 25px;
        font-size: 12px;
        cursor: pointer;
        position: absolute;
        overflow: hidden;
        top: -15px;
        right: 0;
        width: 50px;
        height: 50px;
        line-height: 50px;
        text-align: center;
    }
    .upload_btn input[type=file]
    {
        position:absolute;
        z-index:1;
        width:100%;
        font-size:50rem;
        opacity:0;
        cursor:pointer;
    }
</style>