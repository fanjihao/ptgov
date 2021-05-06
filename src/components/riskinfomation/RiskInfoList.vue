// 风险信息
<template>
  <div class="riskinfo-list">
    <div class="supTop-nav">
      <i class="el-icon-arrow-left" @click="goBack" />
      <div>风险点列表</div>
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
        <p class="modal-title">灾情类型</p>
        <div class="modal-check">
          <p class="choose-area" @click="chooseTypeHandle">
            {{ choosedLevel }}
          </p>
          <van-popup v-model="levelshow" round position="bottom">
            <div class="area-picker">
              <div class="picker-top">
                <span @click="disaTypeCancel">取消</span>
                <span @click="disaTypeFinish">确定</span>
              </div>
              <div class="picker-val">
                <div
                  :class="levelTab === 1 ? 'picked' : 'nopick'"
                  @click="changeDisaType(1)"
                >
                  {{
                    levelTab === 1 && !disafirstChoosed ? "请选择" : disafirst
                  }}
                </div>
                <div
                  :class="levelTab === 2 ? 'picked' : 'nopick'"
                  @click="changeDisaType(2)"
                >
                  {{
                    levelTab === 2 && !disasecondChoosed ? "请选择" : disasecond
                  }}
                </div>
                <div
                  :class="levelTab === 3 ? 'picked' : 'nopick'"
                  @click="changeDisaType(3)"
                >
                  {{
                    levelTab === 3 && !disathirdChoosed ? "请选择" : disathird
                  }}
                </div>
              </div>
              <div class="area-list">
                <div
                  v-for="item in levelList"
                  :key="item.code"
                  @click="chooseChildType(item)"
                >
                  {{ item.name }}
                </div>
              </div>
            </div>
          </van-popup>
        </div>
        <p class="modal-title">行政区划</p>
        <div class="modal-check">
          <p class="choose-area" @click="chooseAreaHandle">{{ choosedArea }}</p>
          <van-popup v-model="show" round position="bottom">
            <div class="area-picker">
              <div class="picker-top">
                <span @click="onCancel">取消</span>
                <span @click="onFinish">确定</span>
              </div>
              <div class="picker-val">
                <div
                  :class="codeTab === 1 ? 'picked' : 'nopick'"
                  @click="changeLevelVal(1)"
                >
                  {{ codeTab === 1 && !firstChoosed ? "请选择" : firstLevel }}
                </div>
                <div
                  :class="codeTab === 2 ? 'picked' : 'nopick'"
                  @click="changeLevelVal(2)"
                >
                  {{ codeTab === 2 && !secondChoosed ? "请选择" : secondLevel }}
                </div>
                <div
                  :class="codeTab === 3 ? 'picked' : 'nopick'"
                  @click="changeLevelVal(3)"
                >
                  {{ codeTab === 3 && !thirdChoosed ? "请选择" : thirdLevel }}
                </div>
                <div
                  :class="codeTab === 4 ? 'picked' : 'nopick'"
                  @click="changeLevelVal(4)"
                >
                  {{ codeTab === 4 && !forthChoosed ? "请选择" : forthLevel }}
                </div>
              </div>
              <div class="area-list">
                <div
                  v-for="item in areaList"
                  :key="item.code"
                  @click="chooseChildArea(item)"
                >
                  {{ item.name }}
                </div>
              </div>
            </div>
          </van-popup>
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
          placeholder="请输入灾情标题"
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
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
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
            @click="toDetail(item)"
          >
            <div class="item-top">{{ item.name }}</div>
            <div class="item-mid mid-info">
              <p>行政区划：</p>
              <span>{{ item.districtName }}</span>
            </div>
            <div class="item-mid">
              <p>灾情类型：</p>
              <span>{{ item.disasterTypeStr }}</span>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
export default {
  name: "RiskInfoList",
  data() {
    return {
      searchVal: "",
      screenVisiable: false,
      // 下拉刷新
      list: [], // 数据数组
      pageNum: 1,
      loading: false,
      finished: false,
      refreshing: false,
      lastPage: false, // 最后一页
      // 行政区划
      firstLevel: "", // 城市级
      secondLevel: "", // 区县级
      thirdLevel: "", // 镇级
      forthLevel: "", //村级
      first: "", // 1
      second: "", // 2
      third: "", // 3
      forth: "", //4
      firstChoosed: false, // 1
      secondChoosed: false, // 2
      thirdChoosed: false, // 3
      forthChoosed: false, //4
      choosedArea: "请选择", // 选中的地区
      areaList: [], // 地区集合
      show: false,
      codeTab: 1,
      // 灾情等级
      levelshow: false,
      levelTab: 1,
      disafirst: "", // 全部灾害类型
      disasecond: "", // 一级灾害类型
      disathird: "", // 二级灾害类型
      disaone: {}, // 选中的item
      disatwo: {}, // 选中的item
      disathree: {}, // 选中的item
      disafirstChoosed: false, // 全部灾害类型 选中
      disasecondChoosed: false, // 一级灾害类型 选中
      disathirdChoosed: false, // 二级灾害类型 选中
      choosedLevel: "请选择", // 选中的等级
      levelList: [{ name: "全部", id: 0, code: "adasd-adasd" }], // 等级集合
    };
  },
  created() {
    this.getriskinfoList();
  },
  methods: {
    // 返回
    goBack() {
      this.$router.go(-1);
    },
    // 获取灾情列表
    getriskinfoList() {
      let cityCode, communityCode, countyCode, streetCode;
      streetCode = this.forth.code;
      communityCode = this.third.code;
      countyCode = this.second.code;
      cityCode = this.first.code;
      this.axios({
        url: "/natural/disaster/disk/list-page",
        method: "GET",
        params: {
          pageNum: this.pageNum,
          pageSize: 10,
          search: this.searchVal,
          cityCode,
          communityCode,
          countyCode,
          provinceCode: "",
          streetCode,
          disasterTypeA: this.disatwo.code,
          disasterTypeB: this.disathree.code,
        },
      })
        .then((res) => {
          console.log(res);
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
          this.getriskinfoList();
        }
      }, 1000);
    },
    // 刷新数据
    onRefresh() {
      // 清空列表数据
      this.finished = false;
      this.list = [];
      this.lastPage = false;
      this.pageNum = 1;
      this.refreshing = true;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.getriskinfoList();
    },
    // 跳转详情
    toDetail(i) {
      sessionStorage.setItem("riskinfoId", i.id);
      this.$router.push({
        path: "/riskdetail",
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
      this.getriskinfoList();
      this.screenShowHandle();
    },
    // 点击搜索
    searchHandle() {
      this.list = [];
      this.getriskinfoList();
    },
    // 选择区域
    chooseAreaHandle() {
      this.show = true;
      if (this.codeTab === 1) {
        this.axios({
          url: `/authenticated/dictionary-types/district/${localStorage.getItem(
            "code"
          )}`,
          method: "GET",
        })
          .then((res) => {
            let arr = [];
            arr.push(res.data.data);
            this.areaList = arr;
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (this.codeTab === 2) {
        this.changeLevelVal(2);
      } else if (this.codeTab === 3) {
        this.changeLevelVal(3);
      } else if (this.codeTab === 4) {
        this.changeLevelVal(4);
      }
    },
    chooseChildArea(item) {
      if (this.codeTab === 1) {
        this.firstLevel = item.name;
        this.first = item;
        this.firstChoosed = true;
      } else if (this.codeTab === 2) {
        this.secondLevel = item.name;
        this.second = item;
        this.secondChoosed = true;
      } else if (this.codeTab === 3) {
        this.thirdLevel = item.name;
        this.third = item;
        this.thirdChoosed = true;
      } else if (this.codeTab === 4) {
        this.forthLevel = item.name;
        this.forth = item;
        this.forthChoosed = true;
      }
      if (item.hasChild !== false) {
        this.axios({
          url: `/authenticated/dictionary-types/district/${item.code}/children`,
          method: "GET",
        })
          .then((res) => {
            this.codeTab = this.codeTab + 1;
            this.areaList = res.data.data;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    // 点击上面四级地区选择
    changeLevelVal(i) {
      this.codeTab = i;
      if (i === 1) {
        this.firstLevel = "";
        this.secondLevel = "";
        this.thirdLevel = "";
        this.forthLevel = "";
        this.firstChoosed = false;
        this.secondChoosed = false;
        this.thirdChoosed = false;
        this.forthChoosed = false;
        this.chooseAreaHandle();
      } else if (i === 2) {
        this.secondLevel = "";
        this.thirdLevel = "";
        this.forthLevel = "";
        this.secondChoosed = false;
        this.thirdChoosed = false;
        this.forthChoosed = false;
        this.axios({
          url: `/authenticated/dictionary-types/district/${this.first.code}/children`,
          method: "GET",
        })
          .then((res) => {
            this.areaList = res.data.data;
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (i === 3) {
        this.thirdLevel = "";
        this.forthLevel = "";
        this.thirdChoosed = false;
        this.forthChoosed = false;
        this.axios({
          url: `/authenticated/dictionary-types/district/${this.second.code}/children`,
          method: "GET",
        })
          .then((res) => {
            this.areaList = res.data.data;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    // 点击确定，会触发 finish 事件
    onFinish() {
      this.show = false;
      if (this.firstChoosed) {
        this.choosedArea = this.firstLevel;
      }
      if (this.secondChoosed) {
        this.choosedArea = this.secondLevel;
      }
      if (this.thirdChoosed) {
        this.choosedArea = this.thirdLevel;
      }
      if (this.forthChoosed) {
        this.choosedArea = this.forthLevel;
      }
    },
    // 点击取消，恢复默认值
    onCancel() {
      this.show = false;
      this.codeTab = 1;
      this.first = "";
      this.firstLevel = "";
      this.firstChoosed = false;
      this.second = "";
      this.secondLevel = "";
      this.secondChoosed = false;
      this.third = "";
      this.thirdLevel = "";
      this.thirdChoosed = false;
      this.forth = "";
      this.forthLevel = "";
      this.forthChoosed = false;
    },
    // 灾情类型
    chooseTypeHandle() {
      this.levelshow = true;
      this.changeDisaType(this.levelTab);
    },
    // 点击灾害类型
    chooseChildType(item) {
      if (this.levelTab === 1) {
        this.disafirst = item.name;
        this.disaone = item;
        this.disafirstChoosed = true;
        this.levelTab = 2;
        this.getFirstdisa();
      } else if (this.levelTab === 2) {
        this.disasecond = item.name;
        this.disatwo = item;
        this.disasecondChoosed = true;
        this.levelTab = 3;
        this.getSeconddisa(item.code);
      } else if (this.levelTab === 3) {
        this.disathird = item.name;
        this.disathree = item;
        this.disathirdChoosed = true;
      }
    },
    // 获得第一级类型
    getFirstdisa() {
      this.axios({
        url: `/authenticated/dictionary-types/naturalDisastersType/roots`,
        method: "GET",
      })
        .then((res) => {
          this.levelList = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获得第二级类型
    getSeconddisa(code) {
      this.axios({
        url: `/authenticated/dictionary-types/naturalDisastersType/${code}/children`,
        method: "GET",
      })
        .then((res) => {
          this.levelList = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 点击类型tab
    changeDisaType(i) {
      this.levelTab = i;
      if (i === 1) {
        this.disafirst = "";
        this.disasecond = "";
        this.disathird = "";
        this.disatwo = "";
        this.disathree = "";
        this.disafirstChoosed = false;
        this.disasecondChoosed = false;
        this.disathirdChoosed = false;
        this.levelList = [{ name: "全部", id: 0, code: "adasd-adasd" }];
      } else if (i === 2) {
        this.disasecond = "";
        this.disathird = "";
        this.disathree = "";
        this.disasecondChoosed = false;
        this.disathirdChoosed = false;
      } else if (i === 3) {
        this.thirdLevel = "";
      }
    },
    // 类型选择确认
    disaTypeFinish() {
      this.levelshow = false;
      if (this.disafirstChoosed) {
        this.choosedLevel = this.disafirst;
      }
      if (this.disasecondChoosed) {
        this.choosedLevel = this.disasecond;
      }
      if (this.disathirdChoosed) {
        this.choosedLevel = this.disathird;
      }
    },
    // 类型选择取消
    disaTypeCancel() {
      this.levelshow = false;
      this.codeTab = 1;
      this.disafirst = "";
      this.disaone = "";
      this.disafirstChoosed = false;
      this.disasecond = "";
      this.disatwo = "";
      this.disasecondChoosed = false;
      this.disathird = "";
      this.disathree = "";
      this.disathirdChoosed = false;
      this.levelList = [{ name: "全部", id: 0, code: "adasd-adasd" }];
    },
  },
};
</script>

<style lang="less" scoped>
.riskinfo-list {
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .mid-info {
        margin: 5px 0;
      }
      .item-mid {
        display: flex;
        justify-content: space-between;
        width: 100%;
        color: #999;
        p {
          width: 21%;
        }
        span {
          width: 80%;
          text-align: left;
          color: #333;
        }
      }
    }
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
      margin-bottom: 10px;
    }
    .modal-check {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      .check-btn {
        width: 85px;
        height: 30px;
        border: 1px solid #4367fd;
        color: #4367fd;
        background: rgba(67, 103, 253, 0.3);
        line-height: 30px;
        text-align: center;
        border-radius: 30px;
        font-size: 12px;
        margin-bottom: 10px;
      }
      .nocheck-btn {
        margin-bottom: 10px;
        width: 85px;
        height: 30px;
        color: #666;
        background: #f5f5f5;
        line-height: 30px;
        text-align: center;
        border-radius: 30px;
        font-size: 12px;
      }
      .choose-area {
        margin-bottom: 10px;
        height: 30px;
        padding: 0 20px;
        color: #666;
        background: #f5f5f5;
        line-height: 30px;
        text-align: center;
        border-radius: 30px;
        font-size: 12px;
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
  .area-picker {
    width: 100%;
    height: 300px;
    background: white;
    display: flex;
    flex-direction: column;

    .picker-top {
      width: 100%;
      padding: 10px 15px;
      background-color: #0199ff;
      display: flex;
      justify-content: space-between;
      color: white;
    }
    .picker-val {
      width: 100%;
      height: 40px;
      display: flex;
      border-bottom: 1px solid #eee;
      .nopick {
        width: 50%;
        height: 40px;
        text-align: center;
        line-height: 40px;
        flex-shrink: 1;
      }
      .picked {
        width: 50%;
        height: 40px;
        border-bottom: 2px solid #0199ff;
        color: #0199ff;
        text-align: center;
        line-height: 40px;
        flex-shrink: 1;
      }
    }
    .area-list {
      width: 100%;
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow-x: hidden;
      div {
        width: 100%;
        height: 40px;
        padding: 0 15px;
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
