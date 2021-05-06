// 选择隐患清单
<template>
  <div class="choose-factory">
    <div class="supTop-nav">
      <i class="el-icon-arrow-left" @click="goBack" />
      <div>选择隐患清单</div>
      <div @click="toAddNew(0)">跳过</div>
    </div>
    <!-- 搜索框 -->
    <div class="search-part">
      <div class="input-box">
        <input
          type="text"
          class="search-input"
          v-model="searchVal"
          placeholder="请输入清单名称"
        />
        <div class="icon-box" @click="getdangerList">
          <i class="el-icon-search searchIcon"></i>
        </div>
      </div>
    </div>
    <!-- 查询数据 -->
    <div class="data-box">
      <div v-if="list.length === 0" class="not-data">
        <div>
          <img src="@/assets/noData.png" alt="" />
          <div class="text">{{ serveText }}</div>
        </div>
      </div>
      <div
        v-else
        class="data-item"
        v-for="item in list"
        :key="item.id"
        @click="toAddNew(item)"
      >
        <div class="item-title">{{ item.name }}</div>
        <div class="item-content">{{ item.remark }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChooseList",
  data() {
    return {
      searchVal: "",
      serveText: "",
      list: [] // 数据数组
    };
  },
  created() {
    this.getdangerList();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    // 去新增
    toAddNew(i) {
      if (i == 0) {
        sessionStorage.setItem("dangerlist", JSON.stringify([]));
      } else {
        sessionStorage.setItem("dangerlist", JSON.stringify(i));
      }
      sessionStorage.setItem("list", JSON.stringify([]));
      sessionStorage.setItem("examinerList", JSON.stringify([]));
      this.$router.push({
        path: "/addnew",
        query: { i }
      });
    },
    // 获取隐患清单
    getdangerList() {
      this.axios({
        url: "/api/insp/template/list",
        method: "GET",
        params: {
          search: this.searchVal,
          code: "governmentApp"
        }
      })
        .then(res => {
          console.log(res.data.data);
          this.list = res.data.data;
          if (this.list.length === 0) {
            this.serveText = "没有数据";
          }
        })
        .catch(err => {
          this.serveText = err.message;
        });
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
  padding: 15px;
  .data-item {
    font-size: 14px;
    width: 100%;
    border-bottom: 1px solid #ccc;
    padding: 0 0 10px;
    margin-bottom: 10px;
    .item-title {
      color: #333;
      font-weight: 900;
    }
    .item-content {
      margin: 5px 0 0;
      color: #9f9f9f;
    }
  }
}
</style>
