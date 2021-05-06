// 课程详情
<template>
  <div class="project-detail">
    <div class="supTop-nav">
      <i class="el-icon-arrow-left" @click="goBack" />
      <div>{{data.publicityName}}</div>
      <p style="width: 20px"></p>
    </div>
    <!-- 查询数据 -->
    <div class="data-box">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <div class="project-info">
          <div class="item-mid">
            <span class="item-title">培训对象：</span>
            <span class="item-content">{{data.trainees}}</span>
          </div>
          <div class="item-foot">
            <div class="foot-item">
              <span class="item-title">课程数</span>
              <div class="item-title">
                <span class="item-content">{{data.coursesNumber}}</span>个
              </div>
            </div>
            <div class="foot-item">
              <span class="item-title">总课时</span>
              <div class="item-title">
                <span class="item-content">{{data.classHoursTotal}}</span>分钟
              </div>
            </div>
            <div class="foot-item">
              <span class="item-title">总学时</span>
              <div class="item-title">
                <span class="item-content">{{data.classHours}}</span>分钟
              </div>
            </div>
            <div class="foot-item">
              <span class="item-title">累计学时</span>
              <div class="item-title">
                <span class="item-content">{{data.learnedTimeAll}}</span>分钟
              </div>
            </div>
          </div>
        </div>
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div class="data-item" v-for="item in list" :key="item.id">
            <div class="item-top">{{item.courseName}}</div>
            <div class="item-mid">
              <span class="item-title">课程时长：</span>
              <span class="item-content item-part"
                >{{item.learnTime}}<span class="little-font">分钟</span></span
              >
              <span class="item-title">已学时长：</span>
              <span class="item-content"
                >{{item.leranTimeAll}}<span class="little-font">分钟</span></span
              >
            </div>
            <div class="foot-btn">
              <div @click="toSeeFile(item)">讲义</div>
              <div @click="toVideo(item)">视频</div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProjectDetail",
  data() {
    return {
      data:"",
      // 下拉刷新
      list: [], // 数据数组
      pageNum: 1,
      loading: false,
      finished: false,
      refreshing: false,
      lastPage: false, // 最后一页
    };
  },
  created() {
    this.data = JSON.parse(sessionStorage.getItem("trainingId"));
    this.getTrainDetail();
  },
  methods: {
    // 返回
    goBack() {
      this.$router.go(-1);
    },
    // 获取详细列表
    getTrainDetail() {
      this.axios({
        url: "/course-management/pageUser",
        method: "GET",
        params: {
          pageNum: this.pageNum,
          pageSize: 10,
          trainingId: this.data.trainingId,
        },
      })
        .then((res) => {
          console.log(res)
          if (this.refreshing) {
            this.refreshing = false;
          }
          let newList = res.data.data.rows;
          if (this.pageNum >= res.data.data.pages) {
            this.lastPage = true;
            this.finished = true;
            this.list = res.data.data.rows;
          } else {
            this.lastPage = false;
            this.finished = false;
            this.list = this.list.concat(newList);
          }
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onLoad() {
      setTimeout(() => {
        if (!this.lastPage) {
          this.pageNum = this.pageNum + 1;
          this.getTrainDetail();
        }
      }, 1000);
    },
    // 刷新数据
    onRefresh() {
      // 清空列表数据
      this.finished = false;
      this.list = [];
      this.pageNum = 1;
      this.refreshing = true;
      this.lastPage = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.getTrainDetail();
    },
    // 视频学习
    toVideo(i) {
      sessionStorage.setItem("videoId", JSON.stringify(i));
      this.$router.push({
        path:"/studyvideo"
      })
    },
    // 讲义学习
    toSeeFile(i) {
      sessionStorage.setItem("videoId", JSON.stringify(i));
      this.$router.push({
        path:"/studyhandout"
      })
    }
 },
};
</script>

<style lang="less" scoped>
.project-detail {
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
    div{
      width: 85%;
      text-align: center;
    }
  }
  .data-box {
    width: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow-x: hidden;
    .project-info {
      width: 100%;
      padding: 15px;
      border-bottom: 1px solid #eee;
    }
    .data-item {
      font-size: 14px;
      width: 100%;
      border-bottom: 1px solid #ccc;
      padding: 10px 15px;
      display: flex;
      flex-direction: column;
      .item-top {
        width: 100%;
        font-weight: bold;
      }
      .foot-btn {
        width: 100%;
        display: flex;
        color: rgb(77, 108, 233);
        div {
          width: 70px;
          padding: 5px 10px;
          border-radius: 40px;
          text-align: center;
          border: 1px solid rgb(77, 108, 233);
          margin-right: 15px;
        }
      }
    }
    .item-mid {
      width: 100%;
      display: flex;
      height: 25px;
      align-items: center;
    }
    .item-title {
      color: #999;
    }
    .item-content {
      color: #666;
    }
    .item-foot {
      width: 100%;
      display: flex;
      .foot-item {
        width: 25%;
        height: 50px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
      }
    }
    .little-font {
      font-size: 10px;
    }
    .item-part {
      margin-right: 15px;
    }
  }
}
</style>
