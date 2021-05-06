// 选择生产经营单位
<template>
  <div class="choose-factory">
    <div class="supTop-nav">
      <i class="el-icon-arrow-left" @click="goBack" />
      <div>选择生产经营单位</div>
      <div style="width: 20px"></div>
    </div>
    <!-- 搜索框 -->
    <div class="search-part">
      <div class="input-box">
        <input
          type="text"
          class="search-input"
          v-model="searchVal"
          placeholder="请输入企业名称"
        />
        <div class="icon-box" @click="onRefresh">
          <i class="el-icon-search searchIcon"></i>
        </div>
      </div>
    </div>
    <!-- 查询数据 -->
    <div class="data-box">
      <div v-if="list.length === 0 && loading === false" class="not-data">
        <div>
          <img src="@/assets/noData.png" alt="" />
          <div class="text">{{ serveText }}</div>
        </div>
      </div>
      <van-pull-refresh v-else v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div
            class="data-item"
            v-for="item in list"
            :key="item.id"
            @click="toChooseList(item)"
          >
            <div class="item-title">{{ item.name }}</div>
            <div class="item-mid">
              <p>行业类别：</p>
              <span>{{ item.industryTypeName }}</span>
            </div>
            <div class="item-foot">
              <p>地址：</p>
              <span>{{ item.address }}</span>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <van-popup v-model="show" class="loading">
      <van-loading size="40" color="#177cf0" :style="{ marginRight: '10px' }" />
      <div :style="{ fontSize: '18px' }">数据加载中，请稍后</div>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: "ChooseFactory",
  data() {
    return {
      searchVal: "", // 搜索值
      serveText: "",
      show: false,
      // 下拉刷新
      list: [], // 数据数组
      pageNum: 1,
      loading: false,
      finished: false,
      refreshing: false,
      lastPage: false // 最后一页
    };
  },
  created() {
    this.show = true;
    this.getFactory();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    // 跳转详情
    toChooseList(i) {
      sessionStorage.setItem("unit", JSON.stringify(i));
      this.$router.push({
        path: "/chooselist",
        query: { i }
      });
    },
    // 获取单位列表
    getFactory() {
      this.axios({
        url: "/unit/pageWithUserAuth",
        method: "GET",
        params: {
          pageNum: this.pageNum,
          pageSize: 10,
          search: this.searchVal
        }
      })
        .then(res => {
          console.log(res.data.data, "sssssssssssssss");
          this.show = false;
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
          if (this.list.length === 0) {
            this.serveText = "没有数据";
          }
          this.loading = false;
        })
        .catch(err => {
          this.serveText = err.message;
        });
    },
    onLoad() {
      setTimeout(() => {
        if (!this.lastPage) {
          this.pageNum = this.pageNum + 1;
          this.getFactory();
        }
      }, 1000);
    },
    // 刷新数据
    onRefresh() {
      // 清空列表数据
      this.loading = true;
      this.finished = false;
      this.refreshing = true;
      this.lastPage = false;
      this.list = [];
      this.pageNum = 1;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.getFactory();
    }
  }
};
</script>

<style lang="less" scoped>
.choose-factory {
  position: relative;
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
}
.search-part {
  width: 100vw;
  background: white;
  padding: 15px;
  box-shadow: 0px 2px 10px 1px #e5e5e5;
  display: flex;
  box-sizing: border-box;
  .input-box {
    background: #f2f2f2;
    height: 45px;
    width: 100%;
    border-radius: 5px;
    display: flex;
    .search-input {
      border: none;
      width: 85%;
      height: 100%;
      background: #f2f2f2;
      border-radius: 5px;
      padding-left: 10px;
    }
    .icon-box {
      width: 15%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .searchIcon {
        font-size: 20px;
        color: #ababab;
      }
    }
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
    padding: 15px;
    color: #999;
    .item-title {
      color: #333;
      font-weight: 900;
    }
    .item-mid {
      width: 100%;
      display: flex;
      height: 30px;
      align-items: center;
    }
    .item-foot {
      display: flex;
      width: 100%;
      p {
        width: 13%;
      }
      span {
        width: 85%;
      }
    }
  }
}
</style>
