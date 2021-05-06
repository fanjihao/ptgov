// 监督检查
<template>
  <div class="supervise">
    <div class="supTop-nav">
      <i class="el-icon-arrow-left" @click="goBack" />
      <div>监督检查记录</div>
      <div @click="toAddNew">新增</div>
    </div>
    <div
      class="disflex"
      v-if="screenVisiable"
      @click.stop="screenShowHandle"
    ></div>
    <!-- 弹出框 -->
    <div class="modal-content" id="modal-content">
      <div class="flex-content">
        <p class="modal-title">时间选择</p>
        <div class="sc-time">
          <div
            class="sc-time-item"
            @click="
              (timeShow = true),
                (timeStatus = 'start'),
                (currentDate = new Date(
                  Date.parse(startDate.replace(/-/g, '/'))
                ))
            "
          >
            <div>{{ startDate }}</div>
            <i class="el-icon-caret-bottom" />
          </div>
          <div class="sc-time-line"></div>
          <div
            class="sc-time-item"
            @click="
              (timeShow = true),
                (timeStatus = 'end'),
                (currentDate = new Date(Date.parse(endDate.replace(/-/g, '/'))))
            "
          >
            <div>{{ endDate }}</div>
            <i class="el-icon-caret-bottom" />
          </div>
        </div>
        <!-- 时间筛选模态框 -->
        <van-popup v-model="timeShow" position="bottom">
          <van-datetime-picker
            type="date"
            title="选择时间"
            item-height="30"
            :formatter="formatter"
            @confirm="getDateTime"
            @cancel="timeShow = false"
            :min-date="minDate"
            v-model="currentDate"
          />
        </van-popup>
        <p class="modal-title">隐患级别</p>
        <div class="modal-check">
          <div
            :class="dangerLevel == '' ? 'check-btn' : 'nocheck-btn'"
            @click="dangerLevelHandle('')"
          >
            全部
          </div>
          <div
            :class="dangerLevel === 'low' ? 'check-btn' : 'nocheck-btn'"
            @click="dangerLevelHandle('low')"
          >
            一般隐患
          </div>
          <div
            :class="dangerLevel === 'serious' ? 'check-btn' : 'nocheck-btn'"
            @click="dangerLevelHandle('serious')"
          >
            重大隐患
          </div>
        </div>
        <p class="modal-title">发现隐患</p>
        <div class="modal-check">
          <div
            :class="foundDanger === '' ? 'check-btn' : 'nocheck-btn'"
            @click="foundDangerHandle('')"
          >
            全部
          </div>
          <div
            :class="foundDanger === true ? 'check-btn' : 'nocheck-btn'"
            @click="foundDangerHandle(true)"
          >
            是
          </div>
          <div
            :class="foundDanger === false ? 'check-btn' : 'nocheck-btn'"
            @click="foundDangerHandle(false)"
          >
            否
          </div>
        </div>
        <p class="modal-title">待复查</p>
        <div class="modal-check">
          <div
            :class="waitReview === '' ? 'check-btn' : 'nocheck-btn'"
            @click="waitReviewHandle('')"
          >
            全部
          </div>
          <div
            :class="waitReview === true ? 'check-btn' : 'nocheck-btn'"
            @click="waitReviewHandle(true)"
          >
            是
          </div>
          <div
            :class="waitReview === false ? 'check-btn' : 'nocheck-btn'"
            @click="waitReviewHandle(false)"
          >
            否
          </div>
        </div>
      </div>
      <div class="modal-foot">
        <div class="foot-cancel" @click="screenShowHandle">取消</div>
        <div class="foot-sure" @click="screenOkHandle">确定</div>
      </div>
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
        <div class="icon-box" @click="searchHandle">
          <i class="el-icon-search searchIcon"></i>
        </div>
      </div>
      <div class="btn-box" @click="openScreenModal">
        筛选
        <i class="el-icon-caret-bottom"></i>
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
      <van-pull-refresh v-else v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div
            class="data-item"
            @click="toDetail(item.id)"
            v-for="item in list"
            :key="item.id"
            :title="item"
          >
            <p class="item-title">{{ item.unitName }}</p>
            <p class="item-content">
              共检查<span class="item-num">{{ item.itemNum }}</span
              >项内容，发现<span class="item-num">{{ item.hdNum }}</span
              >处隐患，
              <span v-if="item.unHandledHdNum === 0"> 已全部消除 </span>
              <span v-else
                ><span class="item-num">{{ item.unHandledHdNum }}</span
                >处隐患未消除</span
              >
            </p>
            <div class="item-foot">
              <img src="@/assets/time.svg" alt="time" class="time-img" />
              <p>检查时间：{{ item.startTime }}</p>
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
  name: "Supervise",
  data() {
    return {
      searchVal: "",
      screenVisiable: false,
      dangerLevel: "", // 隐患等级
      foundDanger: "", // 发现隐患
      waitReview: "", // 待复查
      show: false,
      serveText: "",
      // 时间选择
      timeShow: false,
      minDate: new Date(2018, 0, 1),
      startDate: "",
      endDate: "",
      timeStatus: "",
      currentDate: "",
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
    const date = new Date();
    let Y = date.getFullYear();
    let M =
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1;
    let D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    const nowDate = Y + "-" + M + "-" + D;
    this.endDate = nowDate;
    let oneweekdate = new Date(date - 7 * 24 * 3600 * 1000);
    let y = oneweekdate.getFullYear();
    let m =
      oneweekdate.getMonth() + 1 < 10
        ? "0" + (oneweekdate.getMonth() + 1)
        : oneweekdate.getMonth() + 1;
    let d =
      oneweekdate.getDate() < 10
        ? "0" + oneweekdate.getDate()
        : oneweekdate.getDate();
    const formatwdate = y + "-" + m + "-" + d;
    this.startDate = formatwdate;
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    // 获取监督检查记录列表数据
    getData() {
      this.axios({
        url: "/app/insp/gov/list",
        method: "GET",
        params: {
          checkTimeStart: this.startDate,
          checkTimeEnd: this.endDate,
          hdLevel: this.dangerLevel,
          isHd: this.foundDanger,
          unitName: this.searchVal,
          waitReview: this.waitReview,
          pageNum: this.pageNum
        }
      })
        .then(res => {
          console.log(res.data.data.rows);
          this.show = false;
          if (this.refreshing) {
            setTimeout(() => {
              this.refreshing = false;
            }, 500);
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
          this.show = false;
          this.serveText = err.message;
        });
    },
    onLoad() {
      setTimeout(() => {
        if (!this.lastPage) {
          this.pageNum = this.pageNum + 1;
          this.getData();
        }
      }, 1000);
    },
    // 刷新数据
    onRefresh() {
      // 清空列表数据
      this.finished = false;
      this.refreshing = true;
      this.lastPage = false;
      this.list = [];
      this.pageNum = 1;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.getData();
    },
    // 跳转详情
    toDetail(i) {
      sessionStorage.setItem("recordId", i);
      this.$router.push({
        path: "/superviseDetail"
      });
    },
    // 弹出筛选框
    openScreenModal() {
      this.screenVisiable = true;
      document.getElementById("modal-content").style.left = "20vw";
    },
    // 点击遮罩层
    screenShowHandle() {
      document.getElementById("modal-content").style.left = "100vw";
      // 先滑回modal，再隐藏遮罩
      setTimeout(() => {
        this.screenVisiable = false;
      }, 500);
    },
    // 点击模态框确定
    screenOkHandle() {
      this.list = [];
      this.show = true;
      this.getData();
      this.screenShowHandle();
    },
    // 点击搜索
    searchHandle() {
      this.list = [];
      this.show = true;
      this.getData();
    },
    dangerLevelHandle(i) {
      this.dangerLevel = i;
    },
    foundDangerHandle(i) {
      this.foundDanger = i;
    },
    waitReviewHandle(i) {
      this.waitReview = i;
    },
    // 新增
    toAddNew() {
      this.$router.push({
        path: "/choosefactory"
      });
    },
    formatter(type, val) {
      if (type === "year") {
        return val + "年";
      }
      if (type === "month") {
        return val + "月";
      }
      if (type === "day") {
        return val + "日";
      }
      return val;
    },
    getDateTime(value) {
      const date = new Date(value);
      let Y = date.getFullYear();
      let M =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      let D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      const setDate = Y + "-" + M + "-" + D;
      if (this.timeStatus === "start") {
        const endDate = new Date(Date.parse(this.endDate.replace(/-/g, "/")));
        if (date.getTime() >= endDate.getTime()) {
          this.timeShow = false;
          this.$toast({
            message: "结束时间不能小于开始时间",
            position: "bottom"
          });
        } else {
          this.startDate = setDate;
          this.timeShow = false;
          this.isLoading = true;
        }
      } else {
        const startDate = new Date(
          Date.parse(this.startDate.replace(/-/g, "/"))
        );
        if (date.getTime() <= startDate.getTime()) {
          this.timeShow = false;
          this.$toast({
            message: "结束时间不能小于开始时间",
            position: "bottom"
          });
        } else {
          this.endDate = setDate;
          this.timeShow = false;
          this.isLoading = true;
        }
      }
    }
  },
  mounted() {
    document.getElementById("modal-content").style.left = "100vw";
    this.show = true;
    this.getData();
  }
};
</script>

<style lang="less" scoped>
.supervise {
  position: relative;
  height: 100vh;
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  .el-icon-arrow-left {
    font-size: 20px;
  }
  .disflex {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    position: absolute;
    top: 50px;
    z-index: 100;
  }
  .modal-content {
    width: 80%;
    height: 100%;
    background: white;
    position: absolute;
    top: 50px;
    left: 100vw;
    transition: all 0.5s linear;
    padding: 15px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 50px;
    z-index: 999;
    .flex-content {
      width: 100%;
    }
    .modal-title {
      font-weight: 900;
      font-size: 14px;
    }
    .modal-check {
      width: 100%;
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .check-btn {
        width: 80px;
        height: 35px;
        border: 1px solid #4367fd;
        color: #4367fd;
        background: rgba(67, 103, 253, 0.3);
        line-height: 35px;
        text-align: center;
        border-radius: 30px;
        font-size: 14px;
      }
      .nocheck-btn {
        width: 80px;
        height: 35px;
        color: #666;
        background: #f5f5f5;
        line-height: 35px;
        text-align: center;
        border-radius: 30px;
        font-size: 14px;
      }
    }
    .modal-foot {
      width: 100%;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      .foot-cancel {
        width: 45%;
        height: 40px;
        text-align: center;
        line-height: 40px;
        border-radius: 30px;
        background: #f5f5f5;
        color: #666;
        box-shadow: 0px 2px 10px 1px #d7d7d7;
      }
      .foot-sure {
        width: 45%;
        height: 40px;
        text-align: center;
        line-height: 40px;
        border-radius: 30px;
        background: #4499f6;
        color: white;
        box-shadow: 0px 2px 10px 1px #d7d7d7;
      }
    }
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
  .time-img {
    width: 20px;
    height: 20px;
    margin-right: 5px;
  }
}
.search-part {
  width: 100vw;
  background: white;
  padding: 10px 15px;
  box-shadow: 0px 2px 10px 1px #e5e5e5;
  display: flex;
  box-sizing: border-box;
  .input-box {
    background: #f2f2f2;
    height: 45px;
    width: 80%;
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
  .btn-box {
    width: 20%;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999999;
  }
}
.data-box {
  width: 100%;
  padding: 12px 15px;
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow-x: hidden;
  .data-item {
    font-size: 14px;
    width: 100%;
    border-bottom: 1px solid #ccc;
    padding: 10px 0;
    .item-title {
      color: #333;
      font-weight: 900;
    }
    .item-content {
      margin: 5px 0;
      color: #666;
      .item-num {
        color: #008d1c;
      }
    }
    .item-foot {
      width: 100%;
      display: flex;
      align-items: center;
      color: #666;
    }
  }
}
.sc-time {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  .sc-time-item {
    width: 110px;
    height: 35px;
    border-radius: 20px;
    background-color: #f5f5f5;
    color: #646464;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    div {
      font-size: 13px;
    }
  }
  .sc-time-line {
    height: 1px;
    width: 20px;
    margin: 10px;
    background-color: #5e5e5e;
  }
}
</style>
