// 修改个人信息
<template>
  <div class="personInfo">
    <div class="am-title">
      <i class="el-icon-arrow-left" @click="goBack" />
      <div>个人资料</div>
      <div @click="save">保存</div>
    </div>
    <div class="pi-content-item">
      <div class="left">姓名：</div>
      <input type="text" placeholder="请输入" v-model="name" />
    </div>
    <div class="pi-content-item">
      <div class="left">手机号：</div>
      <input type="text" placeholder="请输入" v-model="phone" />
    </div>
    <div class="pi-content-item">
      <div class="left">邮箱：</div>
      <input type="text" placeholder="请输入" v-model="email" />
    </div>
    <div class="pi-content-item">
      <div class="left">账号：</div>
      <input type="text" :value="username" readonly />
    </div>
    <div class="pi-content-item">
      <div class="left">所属公司：</div>
      <input type="text" :value="unitname" readonly />
    </div>

    <van-popup v-model="show" class="loading">
      <van-loading size="40" color="#177cf0" :style="{ marginRight: '10px' }" />
      <div :style="{ fontSize: '18px' }">数据加载中，请稍后</div>
    </van-popup>
  </div>
</template>

<style lang="less">
.personInfo {
  width: 100vw;
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
  .pi-content-item {
    width: 100%;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #d3d3d3;
    font-size: 14px;
    .left {
      width: 30%;
      height: 50px;
      line-height: 50px;
      text-align: right;
    }
    input {
      width: 70%;
      border: none;
      outline: none;
      line-height: 50px;
    }
  }
  .loading {
    width: 80%;
    height: 60px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    padding: 0 15px;
  }
}
</style>

<script>
export default {
  name: "Standard",
  data() {
    return {
      name: "",
      phone: "",
      email: "",
      username: "",
      unitname: "",
      show: false
    };
  },
  created() {
    let personInfo = this.$route.query.personInfo;
    this.name = personInfo.user.name;
    this.phone = personInfo.user.mobile;
    this.email = personInfo.user.email;
    this.username = personInfo.user.username;
    this.unitname = personInfo.unit.name;
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    save() {
      this.show = true;
      this.axios({
        url: `/authenticated/user/app?email=${this.email}&name=${this.name}&mobile=${this.phone}`,
        method: "PUT"
      })
        .then(res => {
          console.log("修改个人信息成功", res);
          this.show = false;
          this.$router.go(-1);
          this.$toast({
            message: "保存成功"
          });
        })
        .catch(err => {
          console.log("修改个人信息失败", err);
        });
    }
  }
};
</script>
