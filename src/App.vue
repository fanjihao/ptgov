<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  components: {}
};
</script>
<style lang="less">
#app {
  height: 100vh;
  // width: 100vw;
}
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  // flex-shrink: 0;
}
.van-pull-refresh {
  overflow: auto !important;
}
input {
  outline: none;
  border: none;
}
span,
p {
  font-size: 14px;
}
.title {
  font-weight: 900;
  color: #333;
}
.el-dialog {
  border-radius: 10px !important;
}
.el-radio__inner {
  width: 20px !important;
  height: 20px !important;
  background: white !important;
  border-width: 2px !important;
}
.is-checked {
  background: white;
  position: relative;
}
.is-checked::after {
  content: "";
  width: 12px;
  height: 12px;
  text-align: center;
  background: #409eff; //可以在这里更改颜色
  border-radius: 50%;
  display: block;
  position: absolute;
  top: 4px;
  left: 4px;
}
.preview-cover {
  position: absolute;
  bottom: 0;
  box-sizing: border-box;
  width: 100%;
  padding: 4px;
  color: #fff;
  font-size: 12px;
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
}
.van-uploader__preview {
  margin: 0 5px 8px 0 !important;
}
.van-uploader__preview-delete {
  background: white !important;
  width: 20px !important;
  height: 20px !important;
  border-radius: 10px !important;
  text-align: center;
  line-height: 20px;
  border: 1px solid #999;
  i {
    color: red;
    top: 0px;
    right: 0px;
    font-size: 18px;
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
.van-popup--bottom.van-popup--round {
  border-radius: 0 !important;
}
.van-cell {
  padding: 10px 0 !important;
}
.van-picker__toolbar {
  background-color: #137bee;
  color: white;
  height: 40px;
  button {
    color: white;
  }
}
.van-picker__columns {
  background-color: #fff;
}
.mapBG {
  // position: absolute;
  // top: 0px;
  // left: 0px;
  // bottom: 0px;
  width: 100%;
  height: 150px;
  // background-color: #51daee;
}
.loading {
  width: 80%;
  height: 60px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  padding: 0 15px;
}

.not-data {
  height: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  flex: 1;
  justify-content: center;
  div {
    width: 100%;
    text-align: center;
    img {
      width: 40%;
    }
    .text {
      width: 100%;
      font-size: 18px;
      font-weight: 700;
      text-align: center;
      letter-spacing: 2px;
    }
  }
}
</style>
