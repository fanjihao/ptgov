<template>
  <div class="study-video">
    <div class="supTop-nav">
      <i class="el-icon-arrow-left" @click="goBack" />
      <div>{{ data.courseName }}</div>
      <p style="width: 20px"></p>
    </div>
    <div class="video-content">
      <video :src="videoFile" controls="controls" @playing="startPlay"></video>
      <div class="learn-time">已学时间：{{ formatLearnTime() }}</div>
    </div>
    <!-- 放挂机弹窗 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      :show-close="false"
      top="30vh"
      width="80%"
      custom-class="inspect-modal"
    >
      <div class="modal">
        <div class="question">{{ questions.subject }}</div>
        <div class="answer" @click="submitAnswer">
          {{ questions.rightAnswer }}
        </div>
        <div class="answer" @click="submitAnswer">
          {{ questions.wrongAnswer }}
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "StudyVideo",
  data() {
    return {
      data: "",
      videoId: "", // 文件id
      videoFile: "", // 视频文件
      learnTime: 0, // 学习时间
      hours: 0, // 学习时间时
      minute: 0, // 学习时间分
      seconds: 0, // 学习时间秒
      howTime: "", // 多长时间放挂机
      questions: "", // 问题
      dialogVisible: false, //
    };
  },
  created() {
    this.data = JSON.parse(sessionStorage.getItem("videoId"));
    this.howTime = Math.floor(this.data.testTimeAll / 5) * 60;
    this.videoId = JSON.parse(sessionStorage.getItem("videoId")).courseNameId;
    let token = localStorage.getItem("token");
    this.videoFile =
      "http://192.167.6.85:88/dah-cem-api/courses-user/download-video/" +
      this.videoId +
      "?Authorization=" +
      token;
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },

  methods: {
    // 返回
    goBack() {
      this.$router.go(-1);
    },
    // 开始播放
    startPlay() {
      this.timer = setInterval(() => {
        this.learnTime = this.learnTime + 1;
        if (this.learnTime % 60 === 0) {
          this.axios({
            url: `/course-management/learn-on/${this.data.id}`,
            method: "PUT",
            data: {
              coursesId: this.data.courseNameId,
            },
          })
            .then(() => {
            })
            .catch((err) => {
              console.log(err);
            });
        }
        if (this.learnTime % this.howTime === 0) {
          clearInterval(this.timer);
          this.getPopup();
        }
      }, 1000);
    },
    formatLearnTime() {
      if (this.learnTime < 60) {
        this.hours = 0;
        this.minute = 0;
        this.seconds = this.learnTime;
      } else if (this.learnTime >= 60 && this.learnTime < 3600) {
        this.hours = 0;
        this.minute = Math.floor(this.learnTime / 60);
        this.seconds = this.learnTime % 60;
      }
      let H = this.hours < 10 ? "0" + this.hours : this.hours;
      let M = this.minute < 10 ? "0" + this.minute : this.minute;
      let S = this.seconds < 10 ? "0" + this.seconds : this.seconds;
      let str = H + ":" + M + ":" + S;
      return str;
    },
    // 放挂机弹窗
    getPopup() {
      this.axios({
        url: `/course-management/popup/${this.data.id}`,
        method: "PUT",
      })
        .then((res) => {
          if (res.data.code === 200) {
            this.questions = res.data.data;
            this.dialogVisible = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 挂机提交答案
    submitAnswer() {
      this.axios({
        url: `/course-management/questionTest/${this.questions.id}`,
        method: "PUT",
      })
        .then(() => {
          this.dialogVisible = false;
          this.timer = setInterval(() => {
            this.learnTime = this.learnTime + 1;
            if (this.learnTime % 60 === 0) {
              this.axios({
                url: `/course-management/learn-on/${this.data.id}`,
                method: "PUT",
                data: {
                  coursesId: this.data.courseNameId,
                },
              })
                .then(() => {
                })
                .catch((err) => {
                  console.log(err);
                });
            }
            if (this.learnTime % this.howTime === 0) {
              this.dialogVisible = true;
              clearInterval(this.timer);
            }
          }, 1000);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 模态框关闭val
    handleClose() {
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="less" scoped>
.study-video {
  width: 100vw;
  background: white;
  display: flex;
  flex-direction: column;
  height: 100vh;
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
    div {
      width: 85%;
      text-align: center;
    }
  }
  .video-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-x: hidden;
  }
  .learn-time {
    width: 100%;
    height: 100px;
    text-align: center;
    line-height: 100px;
  }
  .modal {
    width: 100%;
    background: white;
    display: flex;
    flex-direction: column;
    padding: 10px;
    align-items: center;
    .question {
      width: 100%;
      padding: 12px;
      text-align: center;
    }
    .answer {
      width: 80%;
      height: 40px;
      margin-bottom: 10px;
      border-radius: 20px;
      border: 1px solid rgb(77, 107, 233);
      color: #666;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>