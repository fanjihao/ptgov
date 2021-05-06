// 我的
<template>
  <div class="my">
    <div class="top">
      <div class="top-title">
        <div style="width:20px;"></div>
        <div class="t-title">个人中心</div>
        <div class="t-exit" @click="exit">退出</div>
      </div>

      <div class="top-info">
        <img src="@/assets/head.png" />
        <div class="t-info" @click="toPersonInfo">
          <div>{{ user.name }}({{ user.username }})</div>
          <div class="t-phone">{{ user.mobile }}</div>
        </div>
      </div>

      <div class="top-name">
        <div>
          <div class="t-name">邮箱</div>
          <div class="t-nameDetail">
            {{ user.email ? user.email : "-" }}
          </div>
        </div>
        <div>
          <div class="t-name">部门</div>
          <div class="t-nameDetail">
            {{ user.department ? user.department.name : "-" }}
          </div>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="c-update" @click="toSetPassword">
        <div class="c-u-left">
          <img src="@/assets/setPass.png" />
          <span>修改密码</span>
        </div>
        <i class="el-icon-arrow-right" />
      </div>
      <div class="c-update" @click="toVersionUpdate">
        <div class="c-u-left">
          <img src="@/assets/versionUpdate.png" />
          <span>版本更新</span>
        </div>
        <i class="el-icon-arrow-right" />
      </div>
    </div>
  </div>
</template>

<style lang="less">
.my {
  .top {
    height: 200px;
    color: white;
    background-image: url("../assets/myBanner.png");
    background-size: 100% 100%;
    .top-title {
      height: 50px;
      width: 100%;
      align-items: center;
      padding: 0 15px;
      display: flex;
      justify-content: space-between;
    }
    .top-info {
      padding: 12px;
      display: flex;
      align-items: center;
      margin-top: 10px;
      img {
        width: 60px;
        height: 60px;
        border-radius: 30px;
        margin-right: 10px;
      }
      .t-info {
        .t-phone {
          font-size: 11px;
          margin: 5px 0;
        }
        .t-email {
          font-size: 11px;
        }
      }
    }
    .top-name {
      width: 100%;
      height: 60px;
      padding: 0 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .t-name {
        font-size: 11px;
        margin-bottom: 5px;
      }
      .t-nameDetail {
        font-size: 13px;
      }
    }
  }

  .content {
    // border-bottom: 1px solid;
    .c-update {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #d3d3d3;
      height: 50px;
      align-items: center;
      padding: 0 15px;
      .c-u-left {
        display: flex;
        align-items: center;
        img {
          width: 16px;
          height: 16px;
          margin-right: 5px;
        }
      }
    }
  }
}
</style>

<script>
export default {
  name: "My",
  data() {
    return {
      personInfo: "",
      unit: "",
      user: ""
    };
  },
  created() {
    this.getPersonInfo();
  },
  methods: {
    exit() {
      this.$router.push({
        path: "/Login"
      });
    },
    toSetPassword() {
      this.$router.push({ path: "/setPassword" });
    },
    toVersionUpdate() {
      // this.$router.push({path: "/versionUpdate"})
    },
    toPersonInfo() {
      this.$router.push({
        path: "/personInfo",
        query: {
          personInfo: this.personInfo
        }
      });
    },
    getPersonInfo() {
      this.axios({
        url: "/authenticated/web-context",
        methods: "GET",
        params: {
          applicationCode: "governmentApp"
        }
      })
        .then(res => {
          console.log("获取当前用户信息成功", res);
          this.personInfo = res.data.data;
          this.user = res.data.data.user;
          this.unit = res.data.data.unit;
        })
        .catch(err => {
          console.log("获取当前用户信息失败", err);
        });
    }
  }
};
</script>
