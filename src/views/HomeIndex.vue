<template>
  <div class="home-index">
    <div class="top-logo">
      <img src="../assets/home-bg.png" alt="" class="bg-banner" />
      <div class="login-top content">
        <div>
          <img
            src="../assets/login-logo.png"
            alt=""
            style="width: 55px; height: 55px"
          />
        </div>
        <span>监督管理</span>
      </div>
    </div>
    <div class="home-middle">
      <div class="fn-modal">
        <div class="fnmodal-top">
          <span>隐患排查</span>
        </div>
        <div class="func-box">
          <div class="item-btn" @click="toSupervise">
            <el-image
              :src="require('../assets/supervise.png')"
              alt=""
              class="icon-img"
              fit="contain"
            />
            <span>监督检查</span>
          </div>
          <div class="item-btn" @click="toMajorDanger">
            <el-image
              :src="require('../assets/highdanger.png')"
              alt=""
              class="icon-img"
              fit="contain"
            />
            <span>重大隐患确认</span>
          </div>
        </div>
      </div>
      <div class="fn-modal">
        <div class="fnmodal-top">
          <span>基础设施</span>
        </div>
        <div class="func-box">
          <div class="item-btn" @click="toFirlHydrant">
            <el-image
              :src="require('../assets/firehydrant.png')"
              alt=""
              class="icon-img"
              fit="contain"
            />
            <span>市政消防栓</span>
          </div>
        </div>
      </div>
      <div class="fn-modal">
        <div class="fnmodal-top">
          <span>培训</span>
        </div>
        <div class="func-box">
          <div class="item-btn" @click="toTrainProject">
            <el-image
              :src="require('../assets/study.png')"
              alt=""
              class="icon-img"
              fit="contain"
            />
            <span>在线学习</span>
          </div>
        </div>
      </div>
      <div class="fn-modal">
        <div class="fnmodal-top">
          <span>自然灾害</span>
        </div>
        <div class="func-box">
          <div class="item-btn" @click="toWarningInfo">
            <el-image
              :src="require('../assets/warning.png')"
              alt=""
              class="icon-img"
              fit="contain"
            />
            <span>预警信息</span>
          </div>
          <div class="item-btn" @click="toRiskInfoList">
            <el-image
              :src="require('../assets/safe.png')"
              alt=""
              class="icon-img"
              fit="contain"
            />
            <span>风险信息</span>
          </div>
          <div class="item-btn" @click="toDisasterList">
            <el-image
              :src="require('../assets/video.png')"
              alt=""
              class="icon-img"
              fit="contain"
            />
            <span>灾情直报</span>
          </div>
        </div>
      </div>
      <div class="fn-modal">
        <div class="fnmodal-top">
          <span>监测预警</span>
        </div>
        <div class="func-box">
          <div class="item-btn" @click="toMonitorMap">
            <el-image
              :src="require('../assets/map.png')"
              alt=""
              class="icon-img"
              fit="contain"
            />
            <span>监控地图</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    // 监督检查
    toSupervise() {
      this.$router.push({
        path: "/supervise"
      });
    },
    // 重大隐患确认
    toMajorDanger() {
      this.$router.push({
        path: "/majordanger"
      });
    },
    // 市政消防栓
    toFirlHydrant() {
      this.$router.push({
        path: "/firehydrantlist"
      });
    },
    // 预警信息
    toWarningInfo() {
      this.$router.push({
        path: "/warninginfo"
      });
    },
    // 灾情列表
    toDisasterList() {
      this.$router.push({
        path: "/disasterlist"
      });
    },
    // 风险点列表
    toRiskInfoList() {
      this.$router.push({
        path: "/riskinfolist"
      });
    },
    // 我的培训项目
    toTrainProject() {
      this.$router.push({
        path: "/trainproject"
      });
    },
    // 监控地图
    toMonitorMap() {
      this.$router.push({
        path: "/monitormap"
      });
    }
  }
};
</script>

<style lang="less" scoped>
.home-index {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  .home-middle {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-x: hidden;
    padding-bottom: 20px;
    flex-shrink: 0;
  }
  .top-logo {
    width: 100vw;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    flex-shrink: 0;
    .bg-banner {
      width: 100%;
      position: absolute;
      z-index: -1;
      left: 0;
      top: 0;
    }
  }
  .icon-img {
    width: 30px;
    height: 30px;
  }
}
.login-top {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  div {
    width: 55px;
    height: 55px;
    border-radius: 30px;
  }
  span {
    color: white;
    font-size: 20px;
    font-weight: bold;
    margin-top: 15px;
  }
}
.fn-modal {
  width: 90%;
  padding: 0 15px;
  flex-shrink: 0;
  .fnmodal-top {
    width: 95%;
    height: 50px;
    line-height: 50px;
    span {
      font-weight: bold;
    }
  }
  .func-box {
    width: 95%;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    .item-btn {
      height: 60px;
      width: 86px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;
      margin: 0 10px;
      span {
        font-size: 14px;
      }
    }
  }
}
</style>
