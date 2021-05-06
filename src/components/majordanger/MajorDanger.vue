// 监督检查
<template>
  <div class="supervise">
    <div class="supTop-nav">
      <i class="el-icon-arrow-left" @click="goBack" />
      <div>重大隐患确认</div>
      <div style="width: 20px"></div>
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
            @confirm="getDate"
            @cancel="timeShow = false"
            :min-date="minDate"
            v-model="currentDate"
          />
        </van-popup>
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
        <div class="icon-box" @click="onRefresh">
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
      <van-pull-refresh v-if="list" v-model="refreshing" @refresh="onRefresh">
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
            @click="toDangerDetail(item)"
          >
            <div class="item-title">
              <div class="common-danger" v-if="item.level === 'low'">
                一般隐患
              </div>
              <div class="serious-danger" v-else>重大隐患</div>
              <div class="already-rectify" v-if="item.showHandledText">
                已整改
              </div>
              <span>{{ item.orgName }}</span>
            </div>
            <div class="item-content">
              <span>隐患描述：</span>
              <p style="display:flex;flex:1;">{{ item.detail }}</p>
            </div>
            <div class="item-content">
              <span>检查人：</span>
              <p>{{ item.userName }}</p>
            </div>
            <div class="item-content">
              <span>检查时间：</span>
              <p>{{ item.checkTime }}</p>
            </div>
            <div class="rectify-term">{{ item.handleSituation }}</div>
            <div class="item-foot">
              <div
                class="item-operation"
                @click.stop="toVerifyDanger(item)"
                v-if="item.showVerifyBtn"
              >
                隐患核实
              </div>
              <div
                class="item-operation"
                @click.stop="toReview(item)"
                v-if="item.showCheckingBtn"
              >
                复查验收
              </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
      <div class="not-data" v-else>
        <div>
          <img src="@/assets/noData.png" alt="" />
          <div class="text">{{ serveText }}</div>
        </div>
      </div>
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
      // 时间选择
      timeShow: false,
      minDate: new Date(2018, 0, 1),
      startDate: "",
      endDate: "",
      timeStatus: "",
      currentDate: "",
      show: false,
      serveText: "",
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
    this.show = true;
    this.getMajorList();
    // }
  },
  methods: {
    goBack() {
      sessionStorage.setItem("hdList", JSON.stringify([]));
      this.$router.go(-1);
    },
    // 获取数据
    getMajorList() {
      this.axios({
        url: "/app/hd/serious/gov/list-page",
        method: "GET",
        params: {
          checkTimeEnd: this.endDate,
          checkTimeStart: this.startDate,
          pageNum: this.pageNum,
          pageSize: 10,
          unitName: this.searchVal
        }
      })
        .then(res => {
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
          this.loading = false;
          if (this.list.length === 0) {
            this.serveText = "没有数据";
          }
          sessionStorage.setItem("hdList", JSON.stringify(this.list));
        })
        .catch(err => {
          this.show = false;
          this.loading = false;
          this.serveText = err.message;
        });
    },
    onLoad() {
      setTimeout(() => {
        if (!this.lastPage) {
          this.pageNum = this.pageNum + 1;
          this.getMajorList();
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
      this.getMajorList();
    },
    // 跳转详情
    toDetail(i) {
      this.$router.push({
        path: "/superviseDetail",
        query: { i }
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
      this.getMajorList();
      this.screenShowHandle();
    },
    // 隐患详情
    toDangerDetail(i) {
      sessionStorage.setItem("hdId", i.id);
      this.$router.push({
        path: "/dangerdetail"
      });
    },
    // 隐患核实
    toVerifyDanger(i) {
      sessionStorage.setItem("hdId", i.id);
      this.$router.push({
        path: "/verifydanger"
      });
    },
    // 复查验收
    toReview(i) {
      sessionStorage.setItem("hdId", i.id);
      this.$router.push({
        path: "/reviewaccepte"
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
    getDate(value) {
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
  }
};
</script>

<style lang="less" scoped>
.supervise {
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
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
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow-x: hidden;
  .data-item {
    font-size: 14px;
    width: 100%;
    border-bottom: 1px solid #ccc;
    padding: 15px;
    .item-title {
      width: 100%;
      display: flex;
      align-items: center;
      color: #333;
      font-weight: 900;
      div {
        width: 70px;
        height: 25px;
        color: white;
        text-align: center;
        line-height: 25px;
        font-size: 13px;
        font-weight: 500;
        border-radius: 20px;
        margin-right: 5px;
      }
      .common-danger {
        background: #4499f6;
      }
      .serious-danger {
        background: #ff4948;
      }
      .already-rectify {
        background: #1db761;
      }
    }
    .item-content {
      color: #666;
      margin-top: 5px;
      display: flex;
      align-items: center;
      p {
        color: #333;
      }
    }
    .rectify-term {
      color: #333;
      margin-top: 5px;
    }
    .item-foot {
      width: 100%;
      display: flex;
      align-items: center;
      margin-top: 5px;
      div {
        width: 70px;
        height: 27px;
        border-radius: 20px;
        border: 2px solid #4d6bed;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        color: #4d6bed;
      }
    }
  }
}
</style>
