// 检查人

<template>
  <div class="examiner">
    <div class="supTop-nav">
      <i class="el-icon-arrow-left" @click="goBack" />
      <div>检查人</div>
      <div @click="OKHandle">确定</div>
    </div>
    <div class="examiner-content">
      <div v-if="list.length === 0" class="not-data">
        <div>
          <img src="@/assets/noData.png" alt="" />
          <div class="text">{{ serveText }}</div>
        </div>
      </div>
      <div class="org-item" v-for="(item, index) in list" :key="item.id">
        <div class="orgs" @click.stop="openHandled(item)">
          <i class="el-icon-caret-right"></i>
          {{ item.name }}
        </div>
        <div v-if="item.opened === true">
          <div
            class="depts-item"
            v-for="(sec, secIndex) in item.userList"
            :key="sec.id"
            @click.stop="
              sec.type === 'gov' ? checkedSec(sec) : openSecHandle(sec)
            "
          >
            <div class="depts">
              <i class="el-icon-caret-right" v-if="sec.userList"></i>
              <div v-else>
                <img
                  src="../../assets/checked.svg"
                  alt="nochecked"
                  v-if="sec.checked === true"
                  class="icon-img"
                />
                <img
                  src="../../assets/nochecked.svg"
                  alt="checked"
                  v-else
                  class="icon-img"
                />
              </div>
              {{ sec.name }}
            </div>
            <div v-if="sec.opened === true" class="deplist-item">
              <div
                class="depts-list"
                v-for="(thr, thrIndex) in sec.userList"
                :key="thr.id"
                @click.stop="
                  thr.type === 'dept'
                    ? checkedDept(index, secIndex, thr)
                    : checkedThird(index, secIndex, thrIndex, thr)
                "
              >
                <img
                  src="../../assets/checked.svg"
                  alt="nochecked"
                  v-if="thr.checked === true"
                  class="icon-img"
                />
                <img
                  src="../../assets/nochecked.svg"
                  alt="checked"
                  v-else
                  class="icon-img"
                />
                {{ thr.name }}
              </div>
            </div>
          </div>
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
  name: "Examiner",
  data() {
    return {
      list: [],
      allList: [], //
      show: false,
      serveText: ""
    };
  },
  created() {
    this.show = true;
    this.getUsersList();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    // 获取可添加的检查人
    getUsersList() {
      this.axios({
        url: "/app/insp/gov/usersListWithUserAuth",
        method: "GET"
      })
        .then(res => {
          let exlist = JSON.parse(sessionStorage.getItem("examinerList"));
          let alreadyList = exlist.splice(1, exlist.length - 1);
          let arr = [];
          let data = res.data.data;
          data.map((item, index) => {
            item.opened = false;
            item.firstIndex = index;
            if (item.userList) {
              item.userList.map((j, k) => {
                j.firstIndex = index;
                j.secondIndex = k;
                j.opened = false;
                j.checked = false;
                if (j.onlyId === undefined) {
                  j.onlyId = index + "-" + k;
                }
                if (j.userList && j.userList.length > 0) {
                  j.userList.map((m, n) => {
                    m.firstIndex = index;
                    m.secondIndex = k;
                    m.thirdIndex = n;
                    m.checked = false;
                    if (m.onlyId === undefined) {
                      m.onlyId = index + "-" + k + "-" + n;
                    }
                    arr.push(m);
                  });
                } else {
                  arr.push(j);
                }
              });
            }
          });
          alreadyList.map(item => {
            if (item.firstIndex && item.secondIndex && item.thirdIndex) {
              data[item.firstIndex].userList[item.secondIndex].userList[
                item.thirdIndex
              ].checked = true;
            } else if (item.firstIndex && item.secondIndex) {
              data[item.firstIndex].userList[
                item.secondIndex
              ].userList[0].checked = true;
            } else {
              data[item.firstIndex].userList[0].checked = true;
            }
          });
          this.list = res.data.data;
          this.allList = arr;
          this.show = false;
          if (this.list.length === 0) {
            this.serveText = "没有数据";
          }
        })
        .catch(err => {
          this.show = false;
          this.serveText = err.message;
        });
    },
    // 打开
    openHandled(i) {
      this.list.map(item => {
        if (i.id === item.id) {
          item.opened = !item.opened;
        }
      });
    },
    // 打开二级
    openSecHandle(i) {
      this.list.map(item => {
        item.userList.map(j => {
          if (i.id === j.id) {
            j.opened = !j.opened;
          }
        });
      });
    },
    // 选中二级
    checkedSec(i) {
      this.list.map(item => {
        item.userList.map(j => {
          if (j.id === i.id) {
            j.checked = !j.checked;
          }
        });
      });
    },
    // 选中部门
    checkedDept(i, secI) {
      if (this.list[i].userList[0].checked !== true) {
        this.list[i].userList[secI].userList.map(ind => {
          ind.checked = false;
        });
        this.list[i].userList[secI].userList[0].checked = !this.list[i]
          .userList[secI].userList[0].checked;
      }
    },
    // 选中三级
    checkedThird(i, secI, thrI) {
      if (this.list[i].userList[0].checked !== true) {
        if (this.list[i].userList[secI].userList[0].checked === true) {
          this.list[i].userList[secI].userList[0].checked = false;
          this.list[i].userList[secI].userList[thrI].checked = !this.list[i]
            .userList[secI].userList[0].checked;
        } else {
          this.list[i].userList[secI].userList[thrI].checked = !this.list[i]
            .userList[secI].userList[0].checked;
        }
      }
    },
    // 确定
    OKHandle() {
      this.show = true;
      let newArr = this.allList.filter(item => item.checked === true);
      let arr = JSON.parse(sessionStorage.getItem("examinerList"));
      let defaultArr = arr.splice(0, 1);
      newArr.map(item => {
        let obj = "";
        if (item.type === "gov") {
          obj = {
            id: item.id,
            deptId: "",
            deptName: "",
            onlyId: item.onlyId,
            duty: "company",
            inspUserType: "",
            orgId: item.id,
            orgName: item.name,
            userId: "",
            userName: "",
            canDel: true,
            firstIndex: item.firstIndex
          };
        } else if (item.type === "dept") {
          obj = {
            id: item.id,
            deptId: item.id,
            deptName: item.name,
            onlyId: item.onlyId,
            duty: "company",
            inspUserType: "",
            orgId: this.list[item.firstIndex].userList[0].id,
            orgName: this.list[item.firstIndex].userList[0].name,
            userId: "",
            userName: "",
            canDel: true,
            firstIndex: item.firstIndex,
            secondIndex: item.secondIndex
          };
        } else {
          obj = {
            id: item.id,
            deptId: this.list[item.firstIndex].userList[item.secondIndex].id,
            deptName: this.list[item.firstIndex].userList[item.secondIndex]
              .name,
            onlyId: item.onlyId,
            duty: "company",
            inspUserType: "",
            orgId: this.list[item.firstIndex].id,
            orgName: this.list[item.firstIndex].name,
            userId: item.id,
            userName: item.name,
            canDel: true,
            firstIndex: item.firstIndex,
            secondIndex: item.secondIndex,
            thirdIndex: item.thirdIndex
          };
        }
        if (arr.length >= 1) {
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].onlyId === obj.onlyId) {
              obj.duty = arr[i].duty;
            }
          }
        }
        defaultArr.push(obj);
      });
      sessionStorage.setItem("examinerList", JSON.stringify(defaultArr));
      this.show = false;
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
.examiner {
  height: 100vh;
  display: flex;
  flex: 1;
  flex-direction: column;
  .supTop-nav {
    background-color: #0199ff;
    height: 50px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    justify-content: space-between;
    color: white;
  }
  .el-icon-arrow-left {
    font-size: 20px;
  }
  .examiner-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-x: hidden;
    background: white;
    .org-item {
      width: 100%;
      display: flex;
      flex-direction: column;
      color: #333;
      i,
      .icon-img {
        margin-right: 10px;
        width: 16px;
        height: 16px;
      }
      .orgs {
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        padding-left: 15px;
        border-bottom: 1px solid #eee;
      }
      .depts-item {
        width: 100%;
        display: flex;
        align-items: center;
        flex-direction: column;
        background: #f2f2f2;
      }
      .depts {
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #ccc;
        background: #f2f2f2;
        i,
        .icon-img {
          margin-left: 30px;
        }
      }
      .deplist-item {
        width: 100%;
      }
      .depts-list {
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #ccc;
        background: #f2f2f2;
        i,
        .icon-img {
          margin-left: 60px;
        }
      }
    }
  }
}
</style>
