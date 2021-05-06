<template>
  <div class="setPassword">
    <div class="sp-title">
      <i class="el-icon-arrow-left" @click="goBack" />
      <div>修改密码</div>
      <div>提交</div>
    </div>

    <div class="sp-handle">
      <div class="sp-handle-item">
        <span>旧密码：</span>
        <input placeholder="必填项" />
      </div>
      <div class="sp-handle-item">
        <span>新密码：</span>
        <input placeholder="必填项" />
      </div>
      <div class="sp-handle-item">
        <span>确认新密码：</span>
        <input placeholder="必填项" />
      </div>
    </div>

    <div class="instructions">
      密码长度为6-20位，必须至少包含一个英文字母和数字，可以包含的特殊字符有“！@#*—.”
    </div>
  </div>
</template>

<style lang="less">
.setPassword {
  .sp-title {
    background-color: #0199ff;
    padding: 13px;
    display: flex;
    justify-content: space-between;
    color: white;
  }
  .sp-handle {
    .sp-handle-item {
      padding: 10px;
      border-bottom: 1px solid #d3d3d3;
      input {
        outline: none;
        border: none;
      }
    }
  }
  .instructions {
    font-size: 0.9rem;
    color: #333;
    padding: 10px;
    margin-top: 10px;
  }
}
</style>

<script>
export default {
  name: "SetPassword",
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
