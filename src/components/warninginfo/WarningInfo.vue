// 预警信息
<template>
  <div class="warning-info">
    <div class="supTop-nav">
      <i class="el-icon-arrow-left" @click="goBack" />
      <div>预警信息</div>
      <div style="width: 20px"></div>
    </div>
    <div class="warning-content">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div class="item" v-for="item in list" :key="item.id">
            <div class="item-toptime">发布时间：{{ item.createdOn }}</div>
            <div class="item-info">
              <div class="info-content">
                <div class="info-title">{{ item.warningTitle }}</div>
                <div class="info-middle">{{ item.warningContent }}</div>
                <div class="info-detail">
                  <p class="info-middle">发布单位：</p>
                  <p class="black-font">{{ item.issued }}</p>
                </div>
                <div class="info-detail">
                  <p class="info-middle">预警类型：</p>
                  <p class="black-font">{{ item.warningType }}</p>
                </div>
                <div class="info-detail">
                  <p class="info-middle">预警级别：</p>
                  <p class="black-font">{{ item.warningLevelStr }}</p>
                </div>
              </div>
              <div class="seedetail" @click="toWarningDetail(item.id)">
                <span>查看详情</span>
                <van-icon name="arrow" />
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
  name: "WarningInfo",
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      pageNum: 1,
      lastPage: false, // 最后一页
    };
  },
  created() {
    this.getWarningList();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    // 获取灾情列表
    getWarningList() {
      this.axios({
        url: "/natural/disaster/warning/page",
        method: "GET",
        params: {
          pageNum: this.pageNum,
          pageSize: 10,
        },
      })
        .then((res) => {
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
    // 加载数据
    onLoad() {
      setTimeout(() => {
        if (!this.lastPage) {
          this.pageNum = this.pageNum + 1;
          this.getWarningList();
        }
      }, 1000);
    },
    // 下拉刷新
    onRefresh() {
      // 清空列表数据
      this.finished = false;
      this.list = [];
      this.pageNum = 1;
      this.lastPage = false;
      this.refreshing = true;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.getWarningList();
    },
    // 预警详情
    toWarningDetail(i) {
      sessionStorage.setItem("warningId", i);
      this.$router.push({
        path: "/warningdetail",
      });
    },
  },
};
</script>

<style lang="less" scoped>
.warning-info {
  // width: 100%;
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
  .warning-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
    background: #eee;
    overflow-x: hidden;
    padding: 0 15px;
    .item {
      width: 100%;
      display: flex;
      flex-direction: column;
      .item-toptime {
        width: 100%;
        height: 50px;
        padding: 0 0 10px;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        color: #666;
        font-size: 14px;
      }
      .item-info {
        width: 100%;
        background: white;
        border-radius: 3px;
        .info-content {
          width: 100%;
          padding: 15px;
          .info-title {
            width: 100%;
            margin: 0 0 10px;
            color: #333;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .info-middle {
            color: #666;
            font-size: 14px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .info-detail {
            width: 100%;
            display: flex;
            align-items: center;
            margin-top: 5px;
          }
          .black-font {
            color: #333;
            font-size: 15px;
            display: flex;
            flex: 1;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
        .seedetail {
          width: 100%;
          height: 45px;
          padding: 0 15px;
          border-top: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
    }
  }
}
</style>