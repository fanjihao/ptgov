<template>
  <div class="login">
    <div class="login-top content">
      <div>
        <img
          src="../assets/login-logo.png"
          alt=""
          style="width: 55px; height: 55px"
        />
      </div>
      <span>监督管理</span>
    </div>
    <div class="login-center content">
      <div class="login-form">
        <el-input
          placeholder="账号"
          prefix-icon="el-icon-user"
          v-model="account"
        >
        </el-input>
        <el-input
          placeholder="密码"
          prefix-icon="el-icon-lock"
          show-password
          v-model="password"
        >
        </el-input>
      </div>
      <div class="login-btn" @click="toLogin">
        <span>登录</span>
      </div>
    </div>
    <van-popup v-model="show" class="loading" :close-on-click-overlay="false">
      <van-loading size="40" color="#177cf0" :style="{ marginRight: '10px' }" />
      <div :style="{ fontSize: '18px' }">数据加载中，请稍后</div>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: "Login",
  components: {},
  data() {
    return {
      account: "",
      password: "",
      show: false
    };
  },
  created() {
    // let str = window.location.href.split("code=")[1].split("#/")[0];
    // this.account = str;
    // this.axios({
    //   url: `/login/ssp/code?code=${str}&type=government`,
    //   method: "POST"
    // })
    //   .then(res => {
    //     this.$toast({
    //       message: "获取code成功!",
    //       position: "bottom"
    //     });
        // localStorage.setItem("token", "ZThiNThmNGYtNDM4OS00OWViLWJkMGItMDMwYTM4MDIwM2MxLjMwY2IxNDQwLWI0");
        // this.getUserInfo();
    //   })
    //   .catch(err => {
    //     console.log(err);
    //     this.$toast({
    //       message: err.message,
    //       position: "bottom"
    //     });
    //   });
  },
  methods: {
    toLogin() {
      this.show = true;
      let formdata = new FormData();
      formdata.append("username", this.account);
      formdata.append("password", this.password);
      this.axios({
        url: "/login/aso/password",
        method: "POST",
        data: formdata
      })
        .then(res => {
          localStorage.setItem("token", res.data.access_token);
          this.getUserInfo();
        })
        .catch(err => {
          this.show = false;
          this.$toast({
            message: err.message,
            position: "bottom"
          });
        });
    },
    // 获取用户个人信息
    getUserInfo() {
      this.axios({
        url: "/authenticated/web-context",
        method: "GET",
        params: {
          applicationCode: "governmentApp"
        }
      })
        .then(res => {
          this.$toast({
            message: "登录成功!",
            position: "bottom"
          });
          localStorage.setItem("user", JSON.stringify(res.data.data.user));
          localStorage.setItem(
            "government",
            JSON.stringify(res.data.data.government)
          );
          localStorage.setItem("provincecode", res.data.data.provinceCode);
          if (res.data.data.cityCode) {
            if (res.districtCode) {
              localStorage.setItem("code", res.data.data.districtCode);
            } else {
              localStorage.setItem("code", res.data.data.cityCode);
            }
          }
          this.show = false;
          this.$router.push({ path: "/home" });
        })
        .catch(err => {
          console.log(err);
          this.$toast({
            message: "获取用户信息失败",
            position: "bottom"
          });
        });
    }
  }
};
</script>

<style lang="less" scoped>
.login {
  // width: 100%;
  height: 100%;
  min-height: 100vh;
  // background: #69acfc;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  background-image: url(../assets/login-bg.png);
  .content {
    width: 100%;
    height: 200px;
  }
  .login-top {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    div {
      width: 55px;
      height: 55px;
      border-radius: 30px;
      overflow: hidden;
    }
    span {
      color: white;
      font-size: 36px;
      font-weight: bold;
    }
  }
  .login-center {
    width: 100%;
    height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    .login-form {
      width: 80%;
      height: 45%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .login-btn {
      width: 78%;
      height: 20%;
      border-radius: 5px;
      box-shadow: 2px 3px 5px 4px rgba(0, 0, 0, 0.05);
      display: flex;
      align-items: center;
      justify-content: center;
      background: #569aff;
      span {
        color: white;
        font-weight: bold;
      }
    }
  }
}
</style>
