// 预警详情
<template>
  <div class="warning-detail">
    <div class="supTop-nav">
      <i class="el-icon-arrow-left" @click="goBack" />
      <div>预警详情</div>
      <div style="width: 20px"></div>
    </div>
    <div class="detail-content">
      <div class="content-top">
        <div class="warn-logo">
          <img src="../../assets/warning_icon.png" alt="icon" fit="contain" />
        </div>
        <div class="warn-title">
          <p class="detail-title">{{ data.warningTitle }}</p>
          <p class="detail-cont">{{ data.issued }}</p>
          <p class="detail-cont">{{ data.createdOn }}</p>
        </div>
      </div>
      <div class="content-attr">
        <p class="detail-cont">预警类型：{{ data.warningType }}</p>
        <p class="detail-cont">预警级别：{{ data.warningLevelStr }}</p>
      </div>
      <div class="content">{{ data.warningContent }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "WarningDetail",
  data() {
    return {
      data: "", // 页面数据
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
  mounted() {
    let warningId = sessionStorage.getItem("warningId");
    this.axios({
      url: "/natural/disaster/warning/date",
      method: "GET",
      params: {
        warningId,
      },
    })
      .then((res) => {
        this.data = res.data.data;
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>

<style lang="less" scoped>
.warning-detail {
  height: 100vh;
  display: flex;
  flex: 1;
  flex-direction: column;
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
  .detail-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
    background: white;
    overflow-x: hidden;
    padding: 0 15px;
    .content-top {
      width: 100%;
      padding: 10px 0;
      border-bottom: 1px solid #eee;
      display: flex;
      .warn-logo {
        width: 100px;
        height: 60px;
        img{
          width: 100%;
          height: 100%;
        }
      }
      .warn-title {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding-left: 10px;
        p {
          width: 100%;
        }
        .detail-title {
          font-size: 16px;
          color: #333;
        }
      }
    }
    .detail-cont {
      font-size: 14px;
      color: #666;
    }
    .content-attr {
      width: 100%;
      height: 70px;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      margin-top: 15px;
    }
    .content {
      width: 100%;
      padding-top: 5px;
      font-size: 14px;
      color: #333;
    }
  }
}
</style>