// 新增
<template>
  <div class="addhydrant">
    <div class="supTop-nav">
      <i class="el-icon-arrow-left" @click="goBack" />
      <div>新增</div>
      <div @click="submit">提交</div>
    </div>
    <div class="standard">
      <div class="standard-top">
        <span class="title">检查明细：</span>
        <input
          type="text"
          class="standard-input"
          v-model="standardVal"
          placeholder="必填项"
        />
      </div>
      <div class="hydrant-state">
        <span class="title">消防栓状态：</span>
        <div class="state-box">
          <div>
            <el-radio v-model="state" label="mfhs001">正常</el-radio>
            <el-radio v-model="state" label="mfhs002">损坏</el-radio>
            <el-radio v-model="state" label="mfhs003">无水</el-radio>
          </div>
          <div>
            <el-radio v-model="state" label="mfhs004">锈死</el-radio>
            <el-radio v-model="state" label="mfhs005">顶盖丢失</el-radio>
          </div>
        </div>
      </div>
      <div class="title photo">现场照片</div>
      <div class="photolist">
        <van-uploader
          v-model="fileList"
          multiple
          :max-count="4"
          :after-read="afterRead"
        />
      </div>
      <van-popup v-model="show" class="loading">
        <van-loading
          size="40"
          color="#177cf0"
          :style="{ marginRight: '10px' }"
        />
        <div :style="{ fontSize: '18px' }">加载中，请稍后</div>
      </van-popup>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddHydrant",
  data() {
    return {
      standardVal: "",
      state: "mfhs001", // 消防栓状态
      fileList: [], // 图片集合
      data: "",
      show: false,
      imgList: []
    };
  },
  created() {
    this.axios({
      url: `/municipal/fire/hydrant/${sessionStorage.getItem("hydrantId")}`,
      method: "GET"
    })
      .then(res => {
        this.data = res.data.data;
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    // 文件上传
    afterRead(file) {
      console.log(file);
      this.show = true;
      let liveparams = new FormData();
      let siteArr = [];
      for (let i = 0; i < this.fileList.length; i++) {
        liveparams.append("file", this.fileList[i].file);
        let obj = {
          url: this.fileList[i].content,
          name: this.fileList[i].file.name
        };
        siteArr.push(obj);
      }
      this.axios({
        url: "/authenticated/temp-files-upload",
        method: "POST",
        data: liveparams
      })
        .then(res => {
          this.show = false;
          this.imgList = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 提交
    submit() {
      if (this.standardVal === "") {
        this.$toast({
          message: "监督管理：请输入必填项",
          position: "bottom"
        });
      } else {
        this.show = true;
        let data = JSON.parse(sessionStorage.getItem("hydetail"));
        let code = "";
        if (data.provinceCode) {
          code = data.provinceCode;
        }
        if (data.cityCode) {
          code = data.cityCode;
        }
        if (data.countyCode) {
          code = data.countyCode;
        }
        if (data.streetCode) {
          code = data.streetCode;
        }
        if (data.communityCode) {
          code = data.communityCode;
        }
        console.log(data);
        let user = JSON.parse(localStorage.getItem("user"));
        this.axios({
          url: "/app/municipal/fire/hydrant",
          method: "POST",
          data: {
            area: data.area,
            areaForm: {
              cityCode: data.areaForm.cityCode,
              communityCode: data.areaForm.communityCode,
              countyCode: data.areaForm.countyCode,
              provinceCode: data.areaForm.provinceCode,
              streetCode: data.areaForm.streetCode
            },
            checkContent: this.standardVal,
            checkPosition: data.location,
            checkState: this.state,
            checkTime: this.format.formatDate(),
            checker: user.name,
            checkerPhone: user.mobile,
            fileInfoList: this.imgList,
            fireHydrantArea: code,
            fireHydrantCode: code,
            fireHydrantId: data.id,
            fireHydrantState: this.state,
            id: data.id,
            latitude: data.latitude,
            longitude: data.longitude,
            reviewContent: "",
            reviewTime: "",
            reviewer: ""
          }
        })
          .then(res => {
            if (res.data.code === 200) {
              this.show = false;
              this.$router.replace({
                path: "/firehydrantdetail"
              });
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  }
};
</script>

<style lang="less">
.addhydrant {
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
  .standard {
    width: 100%;
    background: white;
    display: flex;
    flex-direction: column;
    flex: 1;
    .standard-top {
      width: 100%;
      height: 50px;
      border-bottom: 1px solid #d0d0d0;
      display: flex;
      align-items: center;
      padding: 0 15px;
      .standard-input {
        border: none;
        height: 100%;
        width: 70%;
        font-size: 14px;
      }
    }
    .hydrant-state {
      width: 100%;
      border-bottom: 1px solid #d0d0d0;
      display: flex;
      height: 90px;
      justify-content: space-between;
      padding: 15px;
      .title {
        width: 30%;
      }
      .state-box {
        width: 70%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-size: 14px;
        div {
          display: flex;
        }
      }
    }
    .photo {
      padding: 15px;
    }
    .photolist {
      padding: 0 15px;
    }
  }
}
</style>
