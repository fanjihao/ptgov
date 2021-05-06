// 信息反馈
<template>
  <div class="feedback">
    <div class="supTop-nav">
      <i class="el-icon-arrow-left" @click="goBack" />
      <div>信息反馈</div>
      <div @click="tofeedback">新增</div>
    </div>
    <div class="content">
      <div class="item-box" v-for="item in list" :key="item.id">
        <div class="items">
          <p class="item-title">反馈内容：</p>
          <div class="item-content">{{ item.content }}</div>
        </div>
        <div class="items">
          <p class="item-title">反馈人：</p>
          <div class="item-content">{{ item.feedbackName }}</div>
        </div>
        <div class="items">
          <p class="item-title">反馈时间：</p>
          <div class="item-content">{{ item.feedbackTime }}</div>
        </div>
        <div class="items">
          <p class="item-title">图片：</p>
          <div class="item-content">
            <div v-if="item.img && item.img.length > 0" class="imgs-box">
              <van-image
                :src="format.riskphoto(i.id)"
                alt="imgs"
                class="imgs"
                v-for="(i, index) in item.img"
                @click="openPhoto(item.img, index)"
                :key="i.id"
                fit="cover"
              >
                <template v-slot:loading>
                  <div class="loading-img">图片加载中</div>
                </template>
              </van-image>
            </div>
            <span class="no-photo" v-else>无图片</span>
          </div>
        </div>
        <div class="items">
          <p class="item-title">视频：</p>
          <div v-if="item.video && item.video.length > 0" class="imgs-box">
            <div
              class="videos"
              v-for="i in item.video"
              @click="toVideoPlay(i)"
              :key="i.id"
            >
              <img src="../../assets/disaster_video_icon.png" alt="" />
            </div>
          </div>
          <div class="item-content" v-else>无视频</div>
        </div>
      </div>
    </div>
    <!-- 点击全部-筛选明细 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      :show-close="false"
      top="10vh"
      width="80%"
      custom-class="inspect-modal"
    >
      <div class="modal">
        <div class="modal-top">灾害信息反馈</div>
        <div class="modal-mid">
          <p class="mid-title">反馈内容</p>
          <van-field v-model="value" type="textarea" placeholder="必填项" />
          <p class="mid-title">图片</p>
          <van-uploader
            v-model="fileList"
            multiple
            :max-count="4"
            :after-read="afterRead"
            class="img-arr"
          />
          <p class="mid-title">视频</p>
          <van-uploader
            v-model="videoList"
            accept="video/mp4"
            :max-count="5"
            multiple
            :after-read="afterRead"
            @click-preview="videoPreview"
            capture="camera"
          >
          </van-uploader>
        </div>
        <div class="modal-foot">
          <div @click="addFeedBack">确定</div>
          <div class="cancel" @click="dialogVisible = false">取消</div>
        </div>
      </div>
    </el-dialog>
    <van-popup v-model="show" class="loading">
      <van-loading size="40" color="#177cf0" :style="{ marginRight: '10px' }" />
      <div :style="{ fontSize: '18px' }">数据加载中，请稍后</div>
    </van-popup>
  </div>
</template>

<script>
import { ImagePreview } from "vant";

export default {
  name: "FeedBack",
  data() {
    return {
      dialogVisible: false,
      value: "", // 内容
      fileList: [], // 上传图片
      list: [], // 反馈集合
      uploadUrl: "", //你要上传视频到你后台的地址
      videoList: [],
      show: false,
      disasterRiskFiles: []
    };
  },
  created() {
    this.getFeedBack();
    let isBack = JSON.parse(sessionStorage.getItem("feedBack"));
    if (isBack.visible) {
      this.dialogVisible = isBack.visible;
      this.value = isBack.content;
      this.fileList = isBack.img;
      this.videoList = isBack.video;
    }
  },
  methods: {
    //
    afterRead() {
      let obj = {
        visible: this.dialogVisible,
        content: this.value,
        img: this.fileList,
        video: this.videoList
      };
      sessionStorage.setItem("feedBack", JSON.stringify(obj));
    },
    // 预览
    videoPreview(file) {
      this.$router.push({
        path: "/videoplay",
        query: { url: file.content }
      });
    },
    // 返回
    goBack() {
      sessionStorage.setItem("feedBack", JSON.stringify({}));
      this.$router.go(-1);
    },
    // 信息反馈
    tofeedback() {
      this.dialogVisible = true;
      let obj = {
        visible: this.dialogVisible,
        content: this.value,
        img: this.fileList,
        video: this.videoList
      };
      sessionStorage.setItem("feedBack", JSON.stringify(obj));
    },
    // 模态框关闭val
    handleClose() {
      this.dialogVisible = false;
    },
    // 获取反馈数据
    getFeedBack() {
      let riskId = sessionStorage.getItem("riskinfoId");
      this.axios({
        url: "/natural/disaster/disk/feedback/list",
        method: "GET",
        params: {
          riskId
        }
      })
        .then(res => {
          res.data.data.map(item => {
            if (item.disasterRiskFiles) {
              let arr = item.disasterRiskFiles;
              item.img = [];
              item.video = [];
              for (let i = 0; i < arr.length; i++) {
                if (
                  arr[i].fileType.indexOf("png") !== -1 ||
                  arr[i].fileType.indexOf("jpg") !== -1 ||
                  arr[i].fileType.indexOf("jpeg") !== -1
                ) {
                  item.img.push(arr[i]);
                }
                if (
                  arr[i].fileType.indexOf("mp4") !== -1 ||
                  arr[i].fileType.indexOf("m3u8") !== -1 ||
                  arr[i].fileType.indexOf("flv") !== -1
                ) {
                  item.video.push(arr[i]);
                }
              }
            }
          });
          this.list = res.data.data;
          console.log(this.list);
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 图片预览
    openPhoto(item, index) {
      let arr = [];
      for (let i = 0; i < item.length; i++) {
        arr.push(this.format.photo(item[i].id));
      }
      ImagePreview({
        images: arr,
        startPosition: index,
        closeable: true
      });
    },
    // 去视频播放
    toVideoPlay(i) {
      this.$router.push({
        path: "/videoplay",
        query: { url: this.format.riskphoto(i.id), type: i.fileType }
      });
    },
    // 添加反馈
    addFeedBack() {
      this.show = true;
      this.dialogVisible = false;
      let imgparams = new FormData();
      for (let i = 0; i < this.fileList.length; i++) {
        imgparams.append("file", this.fileList[i].file);
      }
      for (let i = 0; i < this.videoList.length; i++) {
        imgparams.append("file", this.videoList[i].file);
      }
      this.axios({
        url: "/authenticated/temp-files-upload",
        method: "POST",
        data: imgparams
      })
        .then(res => {
          res.data.map(item => {
            let arr = item.fileName.split(".");
            item.fileType = arr[1];
          });
          this.axios({
            url: "/natural/disaster/disk/feedback/save",
            method: "POST",
            data: {
              content: this.value,
              createdBy: "",
              createdOn: this.format.formatDate(),
              disasterRiskFiles: res.data,
              feedbackName: "",
              feedbackTime: this.format.formatDate(),
              id: "",
              modifiedBy: "",
              modifiedOn: this.format.formatDate(),
              riskId: sessionStorage.getItem("riskinfoId")
            }
          })
            .then(res => {
              if (res.data.code === 200) {
                this.show = false;
                sessionStorage.setItem("feedBack", JSON.stringify({}));
                this.value = "";
                this.fileList = [];
                this.videoList = [];
                this.getFeedBack();
              }
              console.log(res);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="less">
.feedback {
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .el-icon-arrow-left {
    font-size: 20px;
  }
  .supTop-nav {
    background-color: #0199ff;
    height: 50px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    justify-content: space-between;
    color: white;
  }
  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-x: hidden;
    background: white;
    padding: 0 15px;
    .item-box {
      width: 100%;
      padding: 10px 0;
      border-bottom: 1px solid #eee;
      .items {
        display: flex;
        margin-bottom: 5px;
        .item-title {
          color: #999;
        }
        .item-content {
          color: #333;
          display: flex;
          flex: 1;
          font-size: 14px;
          .imgs-box {
            width: 100%;
            padding: 10px;
            .imgs {
              width: 65px;
              height: 65px;
              margin-right: 5px;
            }
            .loading-img {
              width: 100%;
              text-align: center;
            }
          }
        }
        .videos {
          width: 65px;
          height: 65px;
          margin-right: 5px;
          text-align: center;
          line-height: 65px;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
  .modal {
    background: white;
    width: 100%;
    height: 100%;
    border-radius: 5px !important;
  }
  .modal-top {
    width: 100%;
    height: 50px;
    line-height: 50px;
    padding: 0 15px;
    border-bottom: 1px solid #eee;
  }
  .modal-mid {
    width: 100%;
    padding: 15px;
    display: flex;
    flex-direction: column;
    .mid-title {
      font-weight: bold;
    }
    textarea {
      border: 1px solid #eee;
      padding: 5px;
      height: 150px;
      background: #f7f7f7;
    }
    .img-arr {
      margin-top: 10px;
    }
  }
  .modal-foot {
    width: 100%;
    height: 50px;
    display: flex;
    border-top: 1px solid #eee;
    color: rgb(68, 153, 246);
    div {
      width: 50%;
      height: 100%;
      line-height: 50px;
      text-align: center;
    }
    .cancel {
      border-left: 1px solid #eee;
    }
  }
  .van-uploader__preview-image,
  .van-uploader__upload,
  .van-uploader__file {
    width: 65px;
    height: 65px;
    margin-right: 2px;
  }
  .van-uploader__preview {
    margin: 0 0px 8px 0 !important;
  }
  .video-pre {
    width: 100%;
    height: 100%;
    background: pink;
  }
}
</style>
