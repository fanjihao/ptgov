// 我的培训项目
<template>
  <div class="train-project">
    <div class="supTop-nav">
      <i class="el-icon-arrow-left" @click="goBack" />
      <div>我的培训项目</div>
      <div style="width: 20px"></div>
    </div>
    <div class="train-tab">
      <div :class="index === false ? 'checked' : 'nocheck'" @click="changeStatus(false)">进行中</div>
      <div :class="index === true ? 'checked' : 'nocheck'" @click="changeStatus(true)">已完成</div>
    </div>
    <!-- 查询数据 -->
    <div class="data-box">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div class="data-item" v-for="item in list" :key="item.id" @click="toDetail(item)">
            <div class="item-top">{{item.publicityName}}</div>
            <div class="item-mid">
              <span class="item-title">培训对象：</span>
              <span class="item-content">{{item.trainees}}</span>
            </div>
            <div class="item-foot">
              <div class="foot-item">
                <span class="item-title">课程数</span>
                <div class="item-title">
                  <span class="item-content">{{item.coursesNumber}}</span>个
                </div>
              </div>
              <div class="foot-item">
                <span class="item-title">总课时</span>
                <div class="item-title">
                  <span class="item-content">{{item.classHoursTotal}}</span>分钟
                </div>
              </div>
              <div class="foot-item">
                <span class="item-title">总学时</span>
                <div class="item-title">
                  <span class="item-content">{{item.classHours}}</span>分钟
                </div>
              </div>
              <div class="foot-item">
                <span class="item-title">累计学时</span>
                <div class="item-title">
                  <span class="item-content">{{item.learnedTimeAll}}</span>分钟
                </div>
              </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
export default {
  name: "TrainProject",
  data() {
    return {
      index: false,
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
    this.getprojectList();
  },
  methods: {
    // 返回
    goBack() {
      this.$router.go(-1);
    },
    // 修改状态
    changeStatus(state) {
      this.index = state;
      this.onRefresh();
    },
    // 获取学习列表
    getprojectList() {
      this.axios({
        url: "/management-user/page",
        method: "GET",
        params: {
          pageNum: this.pageNum,
          pageSize: 10,
          learnStatus: this.index,
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
            this.list = this.list.concat(newList);
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
          this.getprojectList();
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
      this.getprojectList();
    },
    // 详情
    toDetail(i) {
      sessionStorage.setItem("trainingId", JSON.stringify(i));
      this.$router.push({
        path: "/projectdetail",
      });
    },
  },
};
</script>

<style lang="less" scoped>
.train-project {
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
  }
  .train-tab {
    width: 100%;
    height: 50px;
    display: flex;
    div {
      width: 50%;
      height: 50px;
      line-height: 50px;
      text-align: center;
      font-weight: bold;
    }
    .checked {
      color: rgb(0, 153, 255);
      border-bottom: 2px solid rgb(0, 153, 255);
    }
    .nocheck {
      color: #999;
      border: none;
    }
  }
  .data-box {
    width: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow-x: hidden;
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
    }
  }
}
</style>