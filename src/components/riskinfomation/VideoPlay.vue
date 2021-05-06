<template>
  <div class="videoplay">
    <div class="supTop-nav">
      <i class="el-icon-arrow-left" @click="goBack" />
      <div>视频播放</div>
      <div style="width: 20px"></div>
    </div>
    <div class="video-content" v-if="type === '1'">
      <video id="mp4Player" :src="url" controls="controls">
        <source :src="url" type="application/x-mpegURL" />
      </video>
    </div>
    <div class="point-content" v-else-if="type === '2'">
      <div class="cameras">
        <div id="video">
          <video
            id="videoPlayer"
            controls
            preload="auto"
            height="100%"
            width="100%"
            class="video-js vjs-default-skin vjs-big-play-centered"
          >
            <source :src="url" type="application/x-mpegURL" />
          </video>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Video",
  data() {
    return {
      url: "",
      type: "1"
    };
  },
  created() {
    this.url = this.$route.query.url;
    let videoT = this.$route.query.type;
    console.log(videoT, this.url);
    if (videoT && videoT.indexOf("m3u8") !== -1) {
      this.type = "2";
    } else {
      this.type = "1";
    }
  },
  mounted() {
    setTimeout(() => this.setVideo(), 500);
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    setVideo() {
      setTimeout(() => {
        this.$nextTick(() => {
          const options = {
            autoplay: true
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
    }
  }
};
</script>

<style lang="less" scoped>
.videoplay {
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
  .video-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-x: hidden;
    #mp4Player {
      width: 100%;
      height: 100%;
    }
  }

  .point-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-x: hidden;
    width: 100%;
    .cameras {
      display: flex;
      flex-direction: column;
      width: 100%;
      flex: 1;
      #video {
        width: 100%;
        height: 200px !important;
      }
      .videoPlayer-dimensions {
        width: 100%;
        height: 200px !important;
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
