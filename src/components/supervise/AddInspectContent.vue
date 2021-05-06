// 添加检查内容
<template>
  <div class="addinspect">
    <div class="supTop-nav">
      <i class="el-icon-arrow-left" @click="goBack" />
      <div>检查明细</div>
      <div @click="addHandle">确定</div>
    </div>
    <div class="addinspect-content">
      <div class="standard-top">
        <span class="title">检查明细：</span>
        <el-input
          type="text"
          class="standard-input"
          v-model="standardVal"
          placeholder="必填项"
        ></el-input>
      </div>
      <div class="content-detail">
        <div class="inspect-result onsite-photo">
          <span class="title">检查结果：</span>
          <el-radio v-model="status" label="0">合格</el-radio>
          <el-radio v-model="status" label="1">隐患</el-radio>
        </div>
        <div class="scene-photo">
          <div class="title">现场照片</div>
          <van-uploader
            :after-read="afterRead"
            v-model="onsiteFileList"
            multiple
            :max-count="10"
          />
        </div>
        <div class="standard-top middle" v-if="status == '1'" ref="descript">
          <span class="title">隐患描述：</span>
          <el-input
            type="text"
            class="standard-input"
            v-model="dangerDescript"
            placeholder="必填项"
          ></el-input>
        </div>
        <div class="inspect-result" v-if="status == '1'">
          <span class="title">隐患级别：</span>
          <el-radio v-model="dangerLevel" label="low">一般</el-radio>
          <el-radio
            v-model="dangerLevel"
            label="serious"
            @change="ChangeDangerLevel"
            >重大</el-radio
          >
        </div>
        <div class="rectify-type" v-if="status == '1'">
          <span class="title">整改类型：</span>
          <el-radio v-model="rectifyType" label="deadline" size="small"
            >限期整改</el-radio
          >
          <el-radio
            v-model="rectifyType"
            label="spot"
            :disabled="dangerLevel == 'serious'"
            >现场整改</el-radio
          >
        </div>
        <div class="last-type" v-if="status == '1'">
          <el-radio v-model="rectifyType" label="stop_business"
            >停业整顿</el-radio
          >
        </div>
        <div class="standard-top" v-if="status == '1' && rectifyType != 'spot'">
          <span class="title">整改期限：</span>
          <span @click="timeShow = true">{{ rectifyperiod }}</span>
        </div>
        <!-- 时间筛选模态框 -->
        <van-popup v-model="timeShow" position="bottom">
          <van-datetime-picker
            type="date"
            title="选择时间"
            item-height="30"
            :formatter="formatter"
            @confirm="getDateTime"
            @cancel="timeShow = false"
            :min-date="minDate"
            v-model="currentDate"
          />
        </van-popup>
        <div class="inspect-result" v-if="rectifyType == 'spot'" ref="measure">
          <span class="title">整改措施：</span>
          <el-input
            type="text"
            class="standard-input"
            v-model="handleMeasure"
            placeholder="必填项"
          ></el-input>
        </div>
        <div class="scene-photo" v-if="rectifyType == 'spot'">
          <div class="title">整改照片</div>
          <van-uploader
            :after-read="afterRead"
            v-model="rectifyFileList"
            multiple
            :max-count="10"
          />
        </div>
        <van-popup v-model="loadingshow" class="loading">
          <van-loading
            size="40"
            color="#177cf0"
            :style="{ marginRight: '10px' }"
          />
          <div :style="{ fontSize: '18px' }">数据加载中，请稍后</div>
        </van-popup>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.addinspect {
  height: 100vh;
  min-height: 100vh;
  display: flex;
  flex: 1;
  flex-direction: column;
  background: #eee;
  div {
    flex-shrink: 0;
  }
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
  .addinspect-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
    // overflow-x: hidden;
  }
  .standard-top {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    background: white;
    padding: 0 15px;
  }
  .standard-input {
    height: 50px;
    line-height: 50px;
    width: 70%;
    .el-input__inner {
      border: none;
    }
  }
  .content-detail {
    // width: 100%;
    display: flex;
    flex-direction: column;
    background: white;
    flex: 1;
    margin-top: 10px;
    .inspect-result {
      width: 100%;
      height: 50px;
      display: flex;
      align-items: center;
      padding-left: 15px;
      border-top: 1px solid #eee;
      .title {
        margin-right: 20px;
      }
    }
    .scene-photo {
      width: 100%;
      display: flex;
      padding: 0 15px 15px;
      border-top: 1px solid #eee;
      flex-direction: column;
      .title {
        width: 100%;
        height: 50px;
        line-height: 50px;
        font-size: 14px;
      }
    }
    .onsite-photo {
      border-bottom: none;
    }
    .upload-btn {
      width: 80px;
      height: 80px;
      border: 1px solid;
      border-radius: 10px;
    }
    .middle {
      border-top: 1px solid #eee;
    }
    .rectify-type {
      width: 100%;
      height: 50px;
      display: flex;
      padding-left: 15px;
      align-items: center;
      border-top: 1px solid #eee;
      .title {
        margin-right: 20px;
      }
    }
    .last-type {
      width: 100%;
      padding-left: 105px;
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid #eee;
    }
  }
}
</style>

<script>
export default {
  name: "AddInspectContent",
  data() {
    return {
      data: "",
      standardVal: "", // 检查明细
      dangerDescript: "", // 隐患描述
      status: "0",
      dangerLevel: "low", // 隐患等级
      rectifyType: "deadline", // 整改类型
      onsiteFileList: [], // 现场照片
      rectifyFileList: [], // 整改照片
      livePhotos: [], // 保存的现场照片
      rectifyperiod: "", // 整改期限
      handleMeasure: "", // 整改措施
      timeShow: false,
      minDate: new Date(),
      currentDate: "",
      loadingshow: false
    };
  },
  created() {
    if (sessionStorage.getItem("inspdetail") != 0) {
      let data = JSON.parse(sessionStorage.getItem("inspdetail"));
      this.standardVal = data.name;
      this.data = data;
      if (this.data.state === "隐患") {
        this.status = "1";
      }
      if (this.data.state === "合格") {
        this.status = "0";
      }
      if (this.data.id) {
        let list = JSON.parse(sessionStorage.getItem("list"));
        list.map(item => {
          if (item.id === this.data.id) {
            this.data = item;
          }
        });
      }
      if (this.data.hd) {
        this.dangerLevel = this.data.hd.level;
        this.dangerDescript = this.data.hd.detail;
        this.rectifyType = this.data.hd.handleType;
        this.rectifyperiod = this.data.hd.deadlineTime;
        this.handleMeasure = this.data.hd.handleMeasure;
      }
      if (this.data.localLiveImg) {
        let arr = [];
        for (let i = 0; i < this.data.localLiveImg.length; i++) {
          let obj = {
            url: this.data.localLiveImg[i].url,
            isImage: true,
            name: this.data.localLiveImg[i].name
          };
          arr.push(obj);
        }
        this.onsiteFileList = arr;
      }
      if (this.data.localAfterImg) {
        let arr = [];
        for (let i = 0; i < this.data.localAfterImg.length; i++) {
          let obj = {
            url: this.data.localAfterImg[i].url,
            isImage: true,
            name: this.data.localAfterImg[i].name
          };
          arr.push(obj);
        }
        this.rectifyFileList = arr;
      }
    }
    let date = new Date();
    this.rectifyperiod =
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1 >= 10
        ? date.getMonth() + 1
        : "0" + (date.getMonth() + 1)) +
      "-" +
      (date.getDate() >= 10 ? date.getDate() : "0" + date.getDate());
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    // 修改隐患等级
    ChangeDangerLevel() {
      if (this.dangerLevel == "serious" && this.rectifyType == "spot") {
        this.rectifyType = "deadline";
      }
    },
    afterRead() {
      console.log(this.onsiteFileList);
    },
    // 上传图片
    addHandle() {
      if (this.status === "0" && this.standardVal === "") {
        this.$toast({
          message: "监督管理：请输入必填项",
          position: "bottom"
        });
      } else if (
        this.status == "1" &&
        (this.standardVal == "" || this.dangerDescript == "")
      ) {
        this.$toast({
          message: "监督管理：请输入必填项",
          position: "bottom"
        });
      } else if (
        this.status == "1" &&
        this.rectifyType == "spot" &&
        (this.standardVal == "" ||
          this.dangerDescript == "" ||
          this.handleMeasure == "")
      ) {
        this.$toast({
          message: "监督管理：请输入必填项",
          position: "bottom"
        });
      } else {
        this.loadingshow = true;
        let liveparams = new FormData();
        let afterHandparams = new FormData();
        let siteArr = [];
        let afterArr = [];
        for (let i = 0; i < this.onsiteFileList.length; i++) {
          liveparams.append("file", this.onsiteFileList[i].file);
          let obj = {
            url: this.onsiteFileList[i].content,
            name: this.onsiteFileList[i].file.name
          };
          siteArr.push(obj);
        }
        for (let i = 0; i < this.rectifyFileList.length; i++) {
          afterHandparams.append("file", this.rectifyFileList[i].file);
          let obj = {
            url: this.rectifyFileList[i].content,
            name: this.rectifyFileList[i].file.name
          };
          afterArr.push(obj);
        }
        if (this.status === "0") {
          this.axios({
            url: "/authenticated/temp-files-upload",
            method: "POST",
            data: liveparams
          })
            .then(resone => {
              let live = resone;
              let insplist = JSON.parse(sessionStorage.getItem("list"));
              let obj = {
                content: this.standardVal,
                name: this.standardVal,
                hd: {
                  afterHandledPhotos: [],
                  checkTime: this.format.formatDate(),
                  deadlineTime: this.rectifyperiod,
                  detail: this.dangerDescript,
                  handleFinishedTime: "",
                  handleMeasure: this.handleMeasure,
                  handleType: this.rectifyType,
                  handled: this.status === "0" ? true : false,
                  handledTime: "",
                  latitude: "",
                  level: this.dangerLevel,
                  longitude: "",
                  responsibleName: ""
                },
                state: this.status === "0" ? "合格" : "隐患",
                livePhotos: live.data,
                localLiveImg: siteArr,
                result: this.status === "0" ? true : false
              };
              if (sessionStorage.getItem("inspdetail") != 0) {
                insplist.map(item => {
                  if (item.id === this.data.id) {
                    item.content = this.standardVal;
                    item.name = this.standardVal;
                    item.hd = {
                      afterHandledPhotos: [],
                      localAfterImg: afterArr,
                      checkTime: this.format.formatDate(),
                      deadlineTime: this.rectifyperiod,
                      detail: this.dangerDescript,
                      handleFinishedTime: "",
                      handleMeasure: this.handleMeasure,
                      handleType: this.rectifyType,
                      handled: this.status === "0" ? true : false,
                      handledTime: "",
                      latitude: "",
                      level: this.dangerLevel,
                      longitude: "",
                      responsibleName: ""
                    };
                    item.state = this.status === "0" ? "合格" : "隐患";
                    item.livePhotos = live.data;
                    item.localLiveImg = siteArr;
                    item.result = this.status === "0" ? true : false;
                  }
                });
              } else {
                obj.addnew = true;
                obj.id = new Date() + Math.random() * 10;
                insplist.push(obj);
              }
              sessionStorage.setItem("list", JSON.stringify(insplist));
              this.loadingshow = false;
              this.$router.go(-1);
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          this.axios({
            url: "/authenticated/temp-files-upload",
            method: "POST",
            data: liveparams
          })
            .then(resone => {
              let live = resone;
              this.axios({
                url: "/authenticated/temp-files-upload",
                method: "POST",
                data: afterHandparams
              })
                .then(res => {
                  let insplist = JSON.parse(sessionStorage.getItem("list"));
                  let obj = {
                    content: this.standardVal,
                    name: this.standardVal,
                    hd: {
                      afterHandledPhotos: res.data,
                      localAfterImg: afterArr,
                      checkTime: this.format.formatDate(),
                      deadlineTime: this.rectifyperiod,
                      detail: this.dangerDescript,
                      handleFinishedTime: "",
                      handleMeasure: this.handleMeasure,
                      handleType: this.rectifyType,
                      handled: this.status === "0" ? true : false,
                      handledTime: "",
                      latitude: "",
                      level: this.dangerLevel,
                      longitude: "",
                      responsibleName: ""
                    },
                    state: this.status === "0" ? "合格" : "隐患",
                    livePhotos: live.data,
                    localLiveImg: siteArr,
                    result: this.status === "0" ? true : false
                  };
                  if (sessionStorage.getItem("inspdetail") != 0) {
                    insplist.map(item => {
                      if (item.id === this.data.id) {
                        item.content = this.standardVal;
                        item.name = this.standardVal;
                        item.hd = {
                          afterHandledPhotos: res.data,
                          localAfterImg: afterArr,
                          checkTime: this.format.formatDate(),
                          deadlineTime: this.rectifyperiod,
                          detail: this.dangerDescript,
                          handleFinishedTime: "",
                          handleMeasure: this.handleMeasure,
                          handleType: this.rectifyType,
                          handled: this.status === "0" ? true : false,
                          handledTime: "",
                          latitude: "",
                          level: this.dangerLevel,
                          longitude: "",
                          responsibleName: ""
                        };
                        item.state = this.status === "0" ? "合格" : "隐患";
                        item.livePhotos = live.data;
                        item.localLiveImg = siteArr;
                        item.result = this.status === "0" ? true : false;
                      }
                    });
                  } else {
                    obj.addnew = true;
                    obj.id = new Date() + Math.random() * 10;
                    insplist.push(obj);
                  }
                  sessionStorage.setItem("list", JSON.stringify(insplist));
                  this.loadingshow = false;
                  this.$router.go(-1);
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
    },
    formatter(type, val) {
      if (type === "year") {
        return val + "年";
      }
      if (type === "month") {
        return val + "月";
      }
      if (type === "day") {
        return val + "日";
      }
      return val;
    },
    getDateTime(value) {
      const date = new Date(value);
      let Y = date.getFullYear();
      let M =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      let D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      const setDate = Y + "-" + M + "-" + D;
      this.rectifyperiod = setDate;
      this.timeShow = false;
    }
  }
};
</script>
