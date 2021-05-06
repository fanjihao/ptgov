// 设备详情
<template>
  <div class="equipment">
    <div class="am-title">
      <i class="el-icon-arrow-left" @click="goBack" />
      <div>{{ title }}</div>
      <div style="width: 20px" />
    </div>

    <div class="equipment-content">
      <div class="info-title">{{ info.targetName }}</div>
      <div class="info-item1">
        <span class="span1">主要负责人/联系电话：</span>
        <span class="span2">{{
          info.principal || info.principalPhone
            ? info.principal + "-" + info.principalPhone
            : "暂无"
        }}</span>
      </div>
      <div class="info-item1">
        <span class="span1">安全负责人/联系电话：</span>
        <span class="span2">{{
          info.responsible || info.responsiblePhone
            ? info.responsible + "-" + info.responsiblePhone
            : "暂无"
        }}</span>
      </div>

      <div
        class="info-date"
        @click="
          (timeShow = true),
            (currentDate = new Date(Date.parse(time.replace(/-/g, '/'))))
        "
      >
        <div class="date">
          <span>{{ time }}</span>
          <i class="el-icon-date" />
        </div>
      </div>

      <van-popup v-model="timeShow" position="bottom">
        <van-datetime-picker
          type="date"
          title="选择时间"
          item-height="30"
          :formatter="formatter"
          @confirm="setDate"
          @cancel="timeShow = false"
          :max-date="maxDate"
          v-model="currentDate"
        />
      </van-popup>

      <div id="charts"></div>

      <van-popup v-model="show" class="loading">
        <van-loading
          size="40"
          color="#177cf0"
          :style="{ marginRight: '10px' }"
        />
        <div :style="{ fontSize: '18px' }">数据加载中，请稍后</div>
      </van-popup>
    </div>
  </div>
</template>

<style lang="less">
.equipment {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100vh;
  .am-title {
    background-color: #137bee;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    color: white;
    height: 50px;
    align-items: center;
    i {
      font-size: 20px;
    }
  }
  .equipment-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-x: hidden;
    background-color: #ffffff;
    padding: 15px;
    .info-title {
      font-size: #333;
      font-weight: 700;
      margin-bottom: 10px;
    }
    .info-item1 {
      display: flex;
      height: 40px;
      align-items: center;
      .span1 {
        color: #666;
      }
      .span2 {
        color: #333;
      }
    }
    .info-date {
      display: flex;
      justify-content: flex-end;
      margin-top: 10px;
      .date {
        width: 50%;
        padding: 5px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        border-radius: 5px;
        background-color: #f7f7f7;
        border: 1px solid #d0d0d0;
        i {
          font-size: 20px;
          color: #bdbaba;
        }
      }
    }
    .van-picker__toolbar {
      background-color: #137bee;
      color: white;
      height: 40px;
      button {
        color: white;
      }
    }
    .van-picker__columns {
      background-color: #ffffff;
    }
    #charts {
      width: 100%;
      height: 300px;
    }
  }
  .loading {
    width: 80%;
    height: 60px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    padding: 0 15px;
  }
}
</style>

<script>
export default {
  name: "Equipment",
  data() {
    return {
      title: "",
      info: "",
      timeShow: false,
      maxDate: new Date(),
      currentDate: "",
      time: "",
      // 图表数据
      xAxis: [],
      yAxis: [],
      show: false
    };
  },
  created() {
    const date = new Date();
    let Y = date.getFullYear();
    let M =
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1;
    let D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    const nowDate = Y + "-" + M + "-" + D;
    this.time = nowDate;
    this.title = this.$route.query.title;
    this.id = this.$route.query.id;
    this.getInfo();
    this.getHis();
  },
  mounted() {
    this.initChart();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    // 获取探测器详情信息
    getInfo() {
      this.axios({
        method: "GET",
        url: "/monitor/units/hazards/target/target-detail",
        params: {
          targetCode: this.id
        }
      })
        .then(res => {
          // console.log("获取成功", res);
          this.info = res.data.data;
        })
        .catch(err => {
          console.log("获取失败", err);
        });
    },
    // 探测器历史记录
    getHis() {
      this.axios({
        method: "GET",
        // url: "/monitor/console/target-history-data",
        url: "/api/monitor/console/target-history-data",
        params: {
          targetCode: this.id,
          searchDay: this.time
        }
      })
        .then(res => {
          console.log("获取成功", res);
          let newData = res.data.data;
          let xList = [],
            yList = [];
          newData.map(item => {
            xList.push(item.time.split(" ")[1]);
            yList.push(item.value);
          });
          this.xAxis = xList;
          this.yAxis = yList;
          console.log(xList, yList);
        })
        .catch(err => {
          console.log("获取失败", err);
        });
    },
    setDate(val) {
      const date = new Date(val);
      let Y = date.getFullYear();
      let M =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      let D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      const nowDate = Y + "-" + M + "-" + D;
      this.time = nowDate;
      this.getHis();
      this.show = true;
      setTimeout(() => {
        this.initChart();
        this.timeShow = false;
        this.show = false;
      }, 1000);
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
    // 初始化图表
    initChart() {
      let echart = this.$echarts.init(document.getElementById("charts"));
      let option = {
        xAxis: {
          type: "category",
          data: this.xAxis,
          splitLine: { show: false }, //去除网格线
          axisLabel: {
            rotate: "80"
          },
          position: "bottom"
        },
        yAxis: {
          type: "category",
          position: "left"
        },
        series: [
          {
            type: "line",
            data: this.yAxis,
            lineStyle: {
              color: "#0aa4ec"
            }
          }
        ],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#ffcc96"
            }
          }
        },
        dataZoom: [
          {
            show: false,
            start: 0,
            end: 100
          },
          {
            type: "inside",
            start: 0,
            end: 100
          },
          {
            show: false,
            yAxisIndex: 0,
            filterMode: "empty",
            width: 30,
            height: "80%",
            showDataShadow: false,
            left: "93%"
          }
        ]
      };
      echart.setOption(option);
    }
  }
};
</script>
