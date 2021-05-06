<template>
  <div class="study-video">
    <div class="supTop-nav">
      <i class="el-icon-arrow-left" @click="goBack" />
      <div>{{ data.courseName }}</div>
      <p style="width: 20px"></p>
    </div>
    <div class="video-content">
      <div class="learn-time">已学时间：{{ formatLearnTime() }}</div>
      <div class="learn-time">{{ currentPage }} / {{ pageCount }}</div>
      <pdf
        :src="videoFile"
        class="pdf"
        :page="currentPage"
        @num-pages="pageCount = $event"
        @progress="loadedRatio = $event"
      ></pdf>
    </div>
    <div class="foot">
      <div @click="prePage">上一页</div>
      <div class="next" @click="nextPage">下一页</div>
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
import pdf from "vue-pdf";

export default {
  name: "StudyVideo",
  data() {
    return {
      data: "",
      videoId: "", // 文件id
      videoFile: "", // 文件
      learnTime: 0, // 学习时间
      hours: 0, // 学习时间时
      minute: 0, // 学习时间分
      seconds: 0, // 学习时间秒
      currentPage: 1,
      pageCount: 0,
      dialogVisible: false, //
      questions: "",
      howTime: "", // 多长时间放挂机
    };
  },
  components: {
    pdf,
  },
  created() {
    this.data = JSON.parse(sessionStorage.getItem("videoId"));
    this.howTime = Math.floor(this.data.testTimeAll / 5) * 60;
    this.getPdfCode();
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
          .then(() => {})
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
  beforeDestroy() {
    clearInterval(this.timer);
  },

  methods: {
    // 返回
    goBack() {
      this.$router.go(-1);
    },
    // 放挂机弹窗
    getPopup() {
      this.axios({
        url: `/course-management/popup/${this.data.id}`,
        method: "PUT",
      })
        .then((res) => {
          this.questions = res.data.data;
          this.dialogVisible = true;
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
                .then(() => {})
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
    getPdfCode() {
      let that = this;
      this.axios({
        method: "get",
        url:
          "/courses-user/download-file/" +
          JSON.parse(sessionStorage.getItem("videoId")).courseNameId,
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
        responseType: "blob", //设置响应的数据类型为一个包含二进制数据的 Blob 对象，必须设置！！！
      })
        .then((response) => {
          that.videoFile = that.getObjectURL(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    // 将返回的流数据转换为url
    getObjectURL(file) {
      let url = null;
      if (window.createObjectURL != undefined) {
        // basic
        url = window.createObjectURL(file);
      } else if (window.webkitURL != undefined) {
        // webkit or chrome
        try {
          url = window.webkitURL.createObjectURL(file);
        } catch (error) {
          console.log(error);
        }
      } else if (window.URL != undefined) {
        // mozilla(firefox)
        try {
          url = window.URL.createObjectURL(file);
        } catch (error) {
          console.log(error);
        }
      }
      return url;
    },
    // 上一页
    prePage() {
      let page = this.currentPage;
      page = page > 1 ? page - 1 : this.pageCount;
      this.currentPage = page;
    },

    // 下一页
    nextPage() {
      let page = this.currentPage;
      page = page < this.pageCount ? page + 1 : 1;
      this.currentPage = page;
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
    .pdf {
      display: flex;
      flex: 1;
      overflow-x: hidden;
    }
  }
  .learn-time {
    width: 100%;
    height: 50px;
    text-align: center;
    line-height: 50px;
  }
  .foot {
    width: 100%;
    height: 50px;
    display: flex;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    overflow: hidden;
    div {
      width: 50%;
      height: 50px;
      color: white;
      background-color: #0199ff;
      text-align: center;
      line-height: 50px;
    }
    .next {
      border-left: 1px solid white;
    }
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