// 点位详情
<template>
  <div class="pointDetail">
    <div class="am-title">
      <i class="el-icon-arrow-left" @click="goBack" />
      <div>{{ title }}</div>
      <div style="width: 20px" />
    </div>

    <div class="point-options">
      <div :class="status === 0 ? 'has' : 'not'" @click="setStatus(0)">
        实时监测
      </div>
      <div :class="status === 1 ? 'has' : 'not'" @click="setStatus(1)">
        视频监控
      </div>
    </div>

    <div class="point-content">
      <div class="equips" v-if="status === 0">
        <div v-show="equipsList.length === 0" class="not-data">
          <div>
            <img src="@/assets/noData.png" alt="" />
            <div class="text">{{ serveText }}</div>
          </div>
        </div>

        <div class="equips-content" v-for="item in equipsList" :key="item.id">
          <div class="equips-item-top">
            <div class="top-left">{{ item.equipName }}</div>
            <div class="top-right">
              {{
                item.equipType === "G0"
                  ? "罐"
                  : item.equipType === "Q0"
                  ? "气"
                  : "装"
              }}
            </div>
          </div>

          <div class="equips-item-content">
            <div class="equipsImg">
              <img
                src="@/assets/production_point_pot.png"
                alt=""
                v-if="item.equipType === 'G0' || item.equipType === 'P0'"
              />
              <img
                src="@/assets/production_point_gas.png"
                alt=""
                v-if="item.equipType === 'Q0'"
              />
            </div>
            <div class="equips-info">
              <div
                v-for="i in item.targetList"
                :key="i.id"
                class="info-item"
                @click="equipment(item.equipName, i.id)"
              >
                <span>{{ i.targetName }}：</span>
                <span class="unit">{{ i.targetValue }}{{ i.unit }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="cameras" v-show="status === 1">
        <!-- <video :src="videoURL" controls="controls" id="video" /> -->
        <div id="video">
          <video
            id="videoPlayer"
            controls
            preload="auto"
            height="100%"
            width="100%"
            class="video-js vjs-default-skin vjs-big-play-centered"
          >
            <source :src="videoURL" type="application/x-mpegURL" />
          </video>
        </div>
        <div class="videoTitle">视频通道列表</div>
        <div class="video-list">
          <van-pull-refresh
            v-model="refreshing"
            @refresh="onRefresh"
            :style="{ minHeight: '100%' }"
          >
            <van-list
              v-model="loading"
              :finished="finished"
              :finished-text="finishText"
              @load="onLoad"
            >
              <div v-show="videoList.length === 0" class="not-data">
                <div>
                  <img src="@/assets/noData.png" alt="" />
                  <div class="text">{{ serveText }}</div>
                </div>
              </div>

              <div
                v-for="(item, index) in videoList"
                :key="index"
                :class="snCode === item.sn ? 'checked' : 'videoList-item'"
                @click="setSN(item)"
              >
                {{ item.name }}
              </div>
            </van-list>
          </van-pull-refresh>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.pointDetail {
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

  .point-options {
    display: flex;
    height: 50px;
    box-shadow: 0px 1px 3px #d3d3d3;
    .not {
      width: 50%;
      height: 50px;
      text-align: center;
      line-height: 50px;
      color: #757575;
    }
    .has {
      width: 50%;
      height: 50px;
      text-align: center;
      line-height: 50px;
      color: #157aee;
      border-bottom: 1px solid #157aee;
    }
  }

  .point-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-x: hidden;
    .equips {
      display: flex;
      flex-direction: column;
      flex: 1;
      padding: 15px 15px 0;
      background-color: #f2f2f2;
      .not-data {
        height: 100%;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        justify-content: center;
        div {
          width: 100%;
          text-align: center;
          img {
            width: 40%;
          }
          .text {
            width: 100%;
            font-size: 18px;
            font-weight: 700;
            text-align: center;
            letter-spacing: 2px;
          }
        }
      }
      .equips-content {
        border-radius: 5px;
        margin-bottom: 15px;
        background-color: white;
        flex-shrink: 0;
        padding: 0 0 20px 15px;
        .equips-item-top {
          display: flex;
          justify-content: space-between;
          .top-right {
            height: 30px;
            width: 20px;
            text-align: center;
            line-height: 30px;
            background-color: #4499f6;
            border-top-right-radius: 5px;
            color: white;
          }
          .top-left {
            font-size: 20px;
            margin: 20px 0 15px 0;
          }
        }
        .equips-item-content {
          display: flex;
          .equipsImg {
            width: 100px;
            height: 80px;
            margin-right: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #e0e9f3;
            img {
              width: 60px;
              height: 50px;
            }
          }
          .equips-info {
            .info-item {
              border-bottom: 1px dashed #d3d3d3;
              padding-bottom: 3px;
              .unit {
                color: #1db762;
              }
            }
          }
        }
      }
    }
    .cameras {
      display: flex;
      flex-direction: column;
      flex: 1;
      #video {
        width: 100%;
        height: 200px;
      }
      .videoPlayer-dimensions {
        width: 100%;
        height: 100%;
      }
      .video-js {
        width: 100%;
        height: 100%;
      }
      .videoTitle {
        height: 50px;
        line-height: 50px;
        padding-left: 15px;
        background-color: #f8f8f8;
        color: #1ad6e2;
        border-bottom: 1px solid #d3d3d3;
      }
      .video-list {
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow-x: hidden;
        flex-wrap: wrap;
        background-color: #ffffff;
        .van-list {
          height: 100%;
          .not-data {
            height: 100%;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            justify-content: center;
            div {
              width: 100%;
              text-align: center;
              img {
                width: 40%;
              }
              .text {
                width: 100%;
                font-size: 18px;
                font-weight: 700;
                text-align: center;
                letter-spacing: 2px;
              }
            }
          }
        }
        .van-pull-refresh {
          overflow: auto;
        }
        .videoList-item {
          display: inline-block;
          width: 50%;
          height: 50px;
          text-align: center;
          line-height: 50px;
          border: 1px solid #d3d3d3;
          border-left: none;
          border-top: none;
        }
        .checked {
          display: inline-block;
          width: 50%;
          height: 50px;
          text-align: center;
          line-height: 50px;
          border: 1px solid #d3d3d3;
          border-left: none;
          border-top: none;
          background-color: #14d6e2;
          color: white;
        }
      }
    }
  }
}
</style>

<script>
export default {
  name: "PointDetail",
  data() {
    return {
      title: "",
      status: 0,
      id: "",
      companyCode: "",
      snCode: "",
      // 上拉加载 下拉刷新
      loading: false,
      finished: false,
      refreshing: false,
      lastPage: false,
      finishText: "",
      // 页码
      pageNum: 1,
      equipsList: [],
      serveText: "",
      // 视频路径
      videoURL: "http://ivi.bupt.edu.cn/hls/cctv1hd.m3u8",
      // 视频通道列表
      videoList: [],
      player: null,
    };
  },
  created() {
    this.title = localStorage.getItem("title");
    this.id = localStorage.getItem("id");
    this.companyCode = localStorage.getItem("companyCode");
    if (this.status === 0) {
      this.getEquips();
    } else {
      this.getCameras();
    }
  },
  mounted() {
    setTimeout(() => this.setVideo(), 500);
  },
  methods: {
    setVideo() {
      setTimeout(() => {
        this.$nextTick(() => {
          const options = {
            autoplay: true,
          };
          this.player = this.$video(
            "videoPlayer",
            options,
            function onPlayerReady() {
              console.log("onPlayerReady", this);
            }
          );
        });
      }, 4000);
    },
    goBack() {
      this.$router.go(-1);
    },
    // 切换
    setStatus(val) {
      this.status = val;
      if (this.status === 0) {
        this.getEquips();
      } else {
        this.onRefresh();
      }
    },
    // 实时监测数据
    getEquips() {
      this.axios({
        method: "GET",
        url: `/monitor/units/hazard/${this.id}/equips`,
      })
        .then((res) => {
          // console.log("获取成功", res);
          if (res.data.data.length === 0) {
            this.serveText = "没有数据";
          }
          this.equipsList = res.data.data;
        })
        .catch((err) => {
          console.log("获取失败", err);
          this.serveText = err.message;
        });
    },
    // 摄像头信息
    getCameras() {
      this.axios({
        url: "/monitor/units/points/cameras/list-search",
        method: "GET",
        params: {
          companyCode: this.companyCode,
          hazardId: this.id,
          pageNum: this.pageNum,
          pageSize: 10,
        },
      })
        .then((res) => {
          // console.log("获取成功", res);
          if (this.refreshing) {
            setTimeout(() => {
              this.refreshing = false;
            }, 1000);
          }
          if (res.data.data.rows.length === 0) {
            this.finishText = "";
            this.serveText = "没有数据";
          } else {
            this.finishText = "没有更多了";
          }
          let newList = res.data.data.rows;
          if (this.pageNum >= res.data.data.pages) {
            this.lastPage = true;
            this.finished = true;
            this.videoList = this.videoList.concat(newList);
          } else {
            this.lastPage = false;
            this.finished = false;
            this.videoList = this.videoList.concat(newList);
          }
          this.loading = false;
        })
        .catch((err) => {
          console.log("获取失败", err);
          this.serveText = err.message;
        });
    },
    // 根据sn号获取视频播放地址
    getURL() {
      this.axios({
        method: "GET",
        url: `/monitor/camera/live-stream-url/${this.snCode}`,
      })
        .then((res) => {
          console.log("获取成功", res);
          this.videoURL = res.data.data.url;
        })
        .catch((err) => {
          console.log("获取失败", err);
        });
    },
    setSN(item) {
      this.snCode = item.sn;
      this.getURL();
    },
    // 下拉刷新
    onRefresh() {
      // 清空列表数据
      this.finished = false;
      this.refreshing = true;
      this.pageNum = 1;
      this.lastPage = false;
      this.videoList = [];

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.getCameras();
    },
    // 上拉加载
    onLoad() {
      setTimeout(() => {
        if (!this.lastPage) {
          this.pageNum = this.pageNum + 1;
          this.getCameras();
        }
      }, 1000);
    },
    // 设备详情
    equipment(name, id) {
      this.$router.push({
        path: "equipment",
        query: {
          title: name,
          id,
        },
      });
    },
  },
  destroyed() {
    this.player.dispose();
  },
};
</script>