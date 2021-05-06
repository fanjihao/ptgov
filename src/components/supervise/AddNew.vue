// 新增
<template>
  <div class="addnew">
    <div class="supTop-nav">
      <i class="el-icon-arrow-left" @click="goBack" />
      <div>新增</div>
      <div @click="submit">提交</div>
    </div>
    <div class="standard">
      <div class="standard-top">
        <span class="title">检查标准：</span>
        <input
          type="text"
          class="standard-input"
          v-model="standardVal"
          placeholder="请输入检查标准"
        />
      </div>
      <div class="standard-people">
        <div class="examiner content-div">
          <span class="title">检查人</span>
          <div class="add-btn title" @click="toExaminer">添加</div>
        </div>
        <div
          class="duties content-div"
          v-for="(item, index) in examList"
          :key="item.id + index"
        >
          <span
            >{{ item.orgName }}{{ item.deptName ? "/" + item.deptName : ""
            }}{{ item.userName ? "/" + item.userName : "" }}</span
          >
          <div class="btn-box">
            <div>
              <span @click="openDialog(index)" v-if="item.duty === 'host'"
                >主办人</span
              >
              <span @click="openDialog(index)" v-if="item.duty === 'assist'"
                >协办人</span
              >
              <span @click="openDialog(index)" v-if="item.duty === 'leader'"
                >带队领导</span
              >
              <span @click="openDialog(index)" v-if="item.duty === 'company'"
                >参与人</span
              >
              <i class="el-icon-caret-bottom"></i>
            </div>
            <i
              class="el-icon-close"
              @click="delExaminer(index)"
              v-if="item.canDel === true"
            ></i>
          </div>
        </div>
      </div>

      <!-- 点击修改身份 -->
      <el-dialog
        :visible.sync="dialogVisible"
        :before-close="handleClose"
        :show-close="false"
        top="40vh"
        width="80%"
        custom-class="inspect-modal"
      >
        <div
          class="modal-text modal-mid-text"
          @click="changeScreenText('company')"
        >
          参与人
        </div>
        <div
          class="modal-text modal-mid-text"
          @click="changeScreenText('host')"
        >
          主办人
        </div>
        <div
          class="modal-text modal-mid-text"
          @click="changeScreenText('assist')"
        >
          协办人
        </div>
        <div class="modal-text" @click="changeScreenText('leader')">
          带队领导
        </div>
      </el-dialog>
    </div>
    <div class="standard-content">
      <div class="examiner content-div">
        <span class="title">检查内容</span>
        <div class="add-btn title" @click="addInspectContent(0)">添加</div>
      </div>
      <div
        class="duties content-div"
        @click="addInspectContent(item)"
        v-for="item in list"
        :key="item.id"
      >
        <span>{{ item.name }}</span>
        <div class="item-status waitState" v-if="item.state === '待检查'">
          待检查
        </div>
        <div class="item-status qualifState" v-else-if="item.state === '合格'">
          合格
        </div>
        <div class="item-status dangerState" v-else>隐患</div>
      </div>
    </div>
    <div style="width:100%;height:10px;background:#eee;"></div>
    <div class="foot-sign" @click="toSignature">
      <p>现场负责人签名：</p>
      <img
        v-if="alreadySign"
        :src="signBase64"
        style="width:100px;height:100%;"
        alt="sign"
      />
      <p v-else>点击签名</p>
    </div>
    <van-popup v-model="show" class="loading">
      <van-loading size="40" color="#177cf0" :style="{ marginRight: '10px' }" />
      <div :style="{ fontSize: '18px' }">数据加载中，请稍后</div>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: "AddNew",
  data() {
    return {
      data: "",
      standardVal: "",
      dialogVisible: false, // 模态框
      examIndex: "", //
      list: [], // 明细集合
      examList: [], // 检查人集合
      show: false,
      alreadySign: "",
      signBase64: ""
    };
  },
  created() {
    if (sessionStorage.getItem("chargeSignFile")) {
      this.alreadySign = JSON.parse(sessionStorage.getItem("chargeSignFile"));
      this.signBase64 = sessionStorage.getItem("signBase64");
    }
    if (this.$route.query.i != 0) {
      let data = JSON.parse(sessionStorage.getItem("dangerlist"));
      this.data = data;
      this.standardVal = data.name;
      this.axios({
        url: "/api/insp/unit/template/item/list",
        method: "GET",
        params: {
          templateId: this.data.id
        }
      })
        .then(res => {
          let data = res.data.data;
          let arr = JSON.parse(sessionStorage.getItem("list"));
          if (arr.length === 0) {
            data.map(item => {
              item.state = "待检查";
            });
          } else {
            data.map(item => {
              item.state = "待检查";
              for (let i = 0; i < arr.length; i++) {
                if (item.id === arr[i].id) {
                  item.state = arr[i].state;
                }
              }
            });
            for (let i = 0; i < arr.length; i++) {
              if (arr[i].addnew) {
                data.push(arr[i]);
              }
            }
          }
          this.list = data;
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      this.standardVal = sessionStorage.getItem("newlist") || "";
      let arr = JSON.parse(sessionStorage.getItem("list"));
      this.list = arr;
    }
    let length = JSON.parse(sessionStorage.getItem("list")).length;
    if (length <= 0) {
      let arr = [];
      sessionStorage.setItem("list", JSON.stringify(arr));
    }
    let government = JSON.parse(localStorage.getItem("government"));
    let user = JSON.parse(localStorage.getItem("user"));
    let newarr = [];
    let nowUser = {
      deptId: "",
      deptName: user.department,
      duty: "host",
      inspUserType: "",
      orgId: government.id,
      orgName: government.name,
      userId: user.id,
      userName: user.name,
      id: user.id,
      canDel: false
    };
    let examArr = JSON.parse(sessionStorage.getItem("examinerList"));
    if (examArr.length <= 0) {
      newarr.push(nowUser);
    }
    let allExamArr = newarr.concat(examArr);
    sessionStorage.setItem("examinerList", JSON.stringify(allExamArr));
    this.examList = allExamArr;
  },
  methods: {
    goBack() {
      this.$router.go(-1);
      let arr = [];
      sessionStorage.setItem("list", JSON.stringify(arr));
      sessionStorage.setItem("newlist", "");
      sessionStorage.setItem("chargeSignFile", "");
      sessionStorage.setItem("signBase64", "");
    },
    // 添加检查内容
    addInspectContent(i) {
      sessionStorage.setItem("inspdetail", JSON.stringify(i));
      sessionStorage.setItem("newlist", this.standardVal);
      let arr = JSON.parse(sessionStorage.getItem("list"));
      let isExistence = false;
      arr.map(item => {
        if (item.id === i.id) {
          isExistence = true;
        }
      });
      if (!isExistence && i != 0) {
        arr.push(i);
      }
      sessionStorage.setItem("list", JSON.stringify(arr));
      this.$router.push({
        path: "/addinspectcontent"
      });
    },
    // 添加检查人
    toExaminer() {
      sessionStorage.setItem("newlist", this.standardVal);
      this.$router.push({
        path: "/examiner"
      });
    },
    openDialog(i) {
      this.examIndex = i;
      this.dialogVisible = true;
    },
    handleClose() {
      // 模态框关闭val
      this.dialogVisible = false;
    },
    changeScreenText(val) {
      // 修改账号身份
      if (val === "host") {
        this.examList.map(item => {
          if (item.duty === "host") {
            item.duty = "company";
          }
        });
      }
      console.log(this.examIndex);
      this.examList[this.examIndex].duty = val;
      sessionStorage.setItem("examinerList", JSON.stringify(this.examList));
      this.dialogVisible = false;
    },
    // 删除检查人
    delExaminer(i) {
      let examArr = JSON.parse(sessionStorage.getItem("examinerList"));
      examArr.splice(i, 1);
      sessionStorage.setItem("examinerList", JSON.stringify(examArr));
      this.examList.splice(i, 1);
    },
    // 去签名
    toSignature() {
      sessionStorage.setItem("newlist", this.standardVal);
      this.$router.push({
        path: "/signature"
      });
    },
    // 提交
    submit() {
      let insplist = JSON.parse(sessionStorage.getItem("list"));
      insplist.hd = {
        afterHandledPhotos: [],
        checkTime: "",
        deadlineTime: "",
        detail: "",
        handleFinishedTime: "",
        handleMeasure: "",
        handleType: "",
        handled: true,
        handledTime: "",
        latitude: "",
        level: "",
        longitude: "",
        responsibleName: ""
      };
      let hostArr = this.examList.filter(item => item.duty === "host");
      if (this.standardVal === "") {
        this.$toast({
          message: "监督管理：检查标准不能为空",
          position: "bottom"
        });
      } else if (insplist.length <= 0) {
        this.$toast({
          message: "监督管理：至少巡检一项检查内容",
          position: "bottom"
        });
      } else if (hostArr.length === 0) {
        this.$toast({
          message: "监督管理：至少包含一位巡查主办人",
          position: "bottom"
        });
      } else if (this.alreadySign === "") {
        this.$toast({
          message: "监督管理：请负责人签名",
          position: "bottom"
        });
      } else {
        this.show = true;
        let unit = JSON.parse(sessionStorage.getItem("unit"));
        let standard = JSON.parse(sessionStorage.getItem("dangerlist"));
        this.axios({
          url: "/app/insp/gov/save",
          method: "POST",
          data: {
            chargeSignFile: this.alreadySign,
            details: insplist,
            endTime: this.format.formatDate(),
            inspName: this.standardVal,
            inspRecordUsers: this.examList,
            latitude: "",
            longitude: "",
            standardId: standard.id,
            startTime: this.format.formatDate(),
            unitId: unit.id,
            unitName: unit.name
          }
        })
          .then(res => {
            if (res.data.code === 200) {
              this.show = true;
              sessionStorage.setItem("examinerList", JSON.stringify([]));
              sessionStorage.setItem("signBase64", "");
              sessionStorage.setItem("chargeSignFile", "");
              this.$router.go(-3);
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
.addnew {
  position: relative;
  height: 100vh;
  display: flex;
  flex: 1;
  flex-direction: column;
  background: #eeeeee;
  .el-icon-arrow-left {
    font-size: 20px;
  }
  .el-icon-close {
    color: red;
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
      }
    }
    .standard-people {
      width: 100%;
      padding: 0 15px 10px;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      align-items: center;
    }
  }
  .duties {
    color: #999;
    padding: 0 10px;
    border: 1px solid #ededed;
    border-radius: 10px;
    background: #fbfbfb;
    margin-bottom: 10px;
  }
  .content-div {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .item-status {
      width: 60px;
      height: 25px;
      border-radius: 20px;
      font-size: 13px;
      text-align: center;
      line-height: 25px;
      color: white;
    }
    .waitState {
      background: #ccc;
    }
    .qualifState {
      background: rgb(68, 153, 246);
    }
    .dangerState {
      background: rgb(255, 73, 71);
    }
  }
  .standard-content {
    background: white;
    width: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 0 15px;
    overflow-x: hidden;
    margin-top: 10px;
    .duties {
      margin-bottom: 10px;
    }
  }
  .add-btn {
    width: 90px;
    height: 30px;
    line-height: 30px;
    background: #f5f5f5;
    border-radius: 15px;
    text-align: center;
    box-shadow: 0px 2px 3px 1px #d7d7d7;
  }
  .btn-box {
    width: 30%;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #999999;
  }
  .el-dialog {
    border-radius: 10px;
  }
  .modal-mid-text {
    border-top: none;
    border-bottom: 1px solid #d0d0d0;
  }
  .foot-sign {
    width: 100%;
    height: 50px;
    background: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
  }
}
</style>
