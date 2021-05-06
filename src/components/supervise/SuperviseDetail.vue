<template>
  <div class="supervise-detail">
    <div class="supTop-nav">
      <i class="el-icon-arrow-left" @click="goBack" />
      <div>详情</div>
      <div style="width: 20px"></div>
    </div>
    <div class="detail-info">
      <div class="info-top">
        <div>
          <p class="info-title">检查内容</p>
          <p class="info-content">{{ recordData.inspName }}</p>
        </div>
        <div>
          <p class="info-title">检查时间</p>
          <p class="info-content">
            {{ recordData.startTime }} ~ {{ recordData.endTime }}
          </p>
        </div>
        <div>
          <p class="info-title">检查人</p>
          <p
            class="info-content"
            v-for="(item, index) in recordData.inspUsers"
            :key="index"
          >
            {{ item }}
          </p>
        </div>
        <div v-if="recordData.documents">
          <p class="info-title">检查文书</p>
          <p
            class="info-content"
            v-for="(item, index) in recordData.documents"
            :key="index"
          >
            {{ item.fileName }}
          </p>
        </div>
        <div v-else>
          <p class="info-title">检查文书</p>
          <p>-</p>
        </div>
      </div>
      <div class="info-foot">
        <div class="foot-nav">
          <p>检查明细:</p>
          <div>
            <span @click="dialogVisible = true">{{ screenText }}</span>
            <i class="el-icon-caret-bottom"></i>
          </div>
        </div>
        <div
          class="foot-item"
          v-for="deitem in showList"
          :key="deitem.id"
          @click="toInspectDetail(deitem)"
        >
          <p>{{ deitem.content }}</p>
          <div class="result-true" v-if="deitem.result">合格</div>
          <div class="result-false" v-else>隐患</div>
        </div>
      </div>
    </div>
    <!-- 点击全部-筛选明细 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      :show-close="false"
      top="40vh"
      width="80%"
      custom-class="inspect-modal"
    >
      <div class="modal-text" @click="changeScreenText('全部')">全部</div>
      <div class="modal-text modal-mid-text" @click="changeScreenText('合格')">
        合格
      </div>
      <div class="modal-text" @click="changeScreenText('隐患')">隐患</div>
    </el-dialog>
  </div>
</template>

<style lang="less">
.supervise-detail {
  height: 100vh;
  display: flex;
  flex: 1;
  flex-direction: column;
  .supTop-nav {
    width: 100%;
    background-color: #0199ff;
    height: 50px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    justify-content: space-between;
    color: white;
    i {
      font-size: 20px;
    }
  }
  .detail-info {
    width: 100%;
    background: #ededed;
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow-x: hidden;
    .info-top {
      width: 100%;
      // height: 200px;
      background: white;
      margin-bottom: 10px;
      flex-shrink: 0;
      padding: 15px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      > div {
        margin-bottom: 10px;
      }
    }
    .info-title {
      color: #9f9f9f;
      font-size: 13px;
      margin-bottom: 5px;
    }
    .info-content {
      font-size: 14px;
      color: #333;
    }
    .info-foot {
      width: 100%;
      background: white;
      display: flex;
      flex: 1;
      overflow-x: hidden;
      padding: 0 15px 10px;
      flex-direction: column;
      .foot-nav {
        width: 100%;
        height: 50px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        p {
          font-weight: 550;
        }
        div {
          display: flex;
          background: #f5f5f5;
          height: 35px;
          align-items: center;
          justify-content: center;
          border-radius: 30px;
          width: 80px;
          color: #666;
        }
      }
      .foot-item {
        width: 100%;
        border-radius: 10px;
        height: 50px;
        border: 1px solid #ededed;
        background: #fbfbfb;
        padding: 0 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        p {
          color: #666;
        }
        div {
          font-size: 14px;
          color: white;
          width: 60px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          border-radius: 20px;
        }
        .result-true {
          background: #4499f6;
        }
        .result-false {
          background: #ff4948;
        }
      }
    }
  }
  .el-dialog {
    border-radius: 5px;
  }
}
.inspect-modal {
  width: 50%;
  overflow: hidden;
  .modal-text {
    width: 100%;
    height: 50px;
    line-height: 50px;
    padding-left: 15px;
  }
  .modal-mid-text {
    border-top: 1px solid #d0d0d0;
    border-bottom: 1px solid #d0d0d0;
  }
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__body {
    padding: 0;
  }
}
</style>

<script>
export default {
  name: "superviseDetail",
  data() {
    return {
      dialogVisible: false,
      screenText: "全部",
      recordData: "", // 页面详情数据
      detailList: [], // 检查明细集合
      showList: [] // 检查明细展示集合
    };
  },
  methods: {
    // 返回
    goBack() {
      this.$router.go(-1);
    },
    // 检查明细
    toInspectDetail(i) {
      sessionStorage.setItem("detailinfo", JSON.stringify(i));
      this.$router.push({
        path: "/inspectDetail"
      });
    },
    // 模态框关闭val
    handleClose() {
      this.dialogVisible = false;
    },
    // 修改筛选条件
    changeScreenText(val) {
      this.screenText = val;
      this.dialogVisible = false;
      if (val === "全部") {
        this.showList = this.detailList;
      } else if (val === "合格") {
        this.showList = this.detailList.filter(item => item.result);
      } else {
        this.showList = this.detailList.filter(item => !item.result);
      }
    }
  },
  mounted() {
    let recordId = sessionStorage.getItem("recordId");
    this.axios({
      url: "/app/insp/gov/getById",
      method: "GET",
      params: {
        recordId
      }
    })
      .then(res => {
        console.log("================", res);
        this.recordData = res.data.data;
        this.detailList = res.data.data.detailList;
        this.showList = this.detailList;
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>
