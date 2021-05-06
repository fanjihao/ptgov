// 在线监测
<template>
  <div class="onlineMonitoring">
    <div class="am-title">
      <i class="el-icon-arrow-left" @click="goBack" />
      <div>{{data.name}}</div>
      <div style="width: 20px" />
    </div>
    <div class="online-content">
      <van-pull-refresh
        v-model="refreshing"
        @refresh="onRefresh"
        :style="{ minHeight: '80vh' }"
      >
        <van-list
          v-model="loading"
          :finished="finished"
          @load="onLoad"
        >
          <div v-show="list.length === 0" class="not-data">
            <div>
              <img src="@/assets/noData.png" alt="" />
              <div class="text">{{serveText}}</div>
            </div>
          </div>

          <div v-for="item in list" :key="item.id" class="item" @click="pointDetail(item)">
            <div class="item-level-red item-level" v-if="item.hazardRank === '1'">【一级】</div>
            <div class="item-level-orange item-level" v-if="item.hazardRank === '2'">【二级】</div>
            <div class="item-level-yellow item-level" v-if="item.hazardRank === '3'">【三级】</div>
            <div class="item-level-blue item-level" v-if="item.hazardRank === '4'">【四级】</div>
            <div>{{item.hazardName}}</div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<style lang="less">
.onlineMonitoring {
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
  .online-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-x: hidden;
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
    .item{
      display: flex;
      height: 50px;
      padding: 0 20px 0 0 ;
      border-bottom: 1px solid #D3D3D3;
      align-items: center;
      .item-level{
        margin: 0 10px 0 20px;
      }
      .item-level-red{
        color: #FF595D;
      }
      .item-level-orange{
        color: #FF8D1C;
      }
      .item-level-yellow{
        color: #f4af1b;
      }
      .item-level-blue{
        color: #00aeff;
      }
    }
  }
}
</style>

<script>
export default {
  name: "OnlineMonitoring",
  data() {
    return {
      data:"",
      // 上拉加载 下拉刷新
      loading: false,
      finished: false,
      refreshing: false,
      lastPage: false,
      // 页码
      pageNum: 1,
      finishText: "",
      list: [],
      serveText: ''
    };
  },
  created() {
    this.getList();
    this.data = JSON.parse(sessionStorage.getItem("chooseFactory"));
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    // 下拉刷新
    onRefresh() {
      // 清空列表数据
      this.finished = false;
      this.refreshing = true;
      this.pageNum = 1;
      this.lastPage = false;
      this.list = [];

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.getList();
    },
    // 上拉加载
    onLoad() {
      setTimeout(() => {
        if (!this.lastPage) {
          this.pageNum = this.pageNum + 1;
          this.getList();
        }
      }, 1000);
    },

    // 获取点位列表
    getList() {
      this.axios({
        url: "/monitor/access-points/list-page",
        method: "GET",
        params: {
          pageNum: this.pageNum,
          pageSize: 10,
          unitId:JSON.parse(sessionStorage.getItem("chooseFactory")).id
        },
      })
        .then((res) => {
          if (this.refreshing) {
            setTimeout(() => {
              this.refreshing = false;
            }, 1000);
          }
          if (res.data.data.rows.length === 0) {
            this.finishText = "";
            this.serveText = '没有数据'
          } else {
            this.finishText = "没有更多了";
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
          console.log("获取失败", err);
          this.serveText = err.message
        });
    },

    // 点位详情
    pointDetail(item) {
      localStorage.setItem('title',item.hazardName)
      localStorage.setItem('id',item.hazardCode)
      localStorage.setItem('companyCode',item.companyCode)
      this.$router.push({
        path: "/pointdetail"
      })
    }
  },
};
</script>