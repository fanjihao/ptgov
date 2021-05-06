// 文件查看
<template>
  <div class="seefile">
    <div class="supTop-nav">
      <i class="el-icon-arrow-left" @click="goBack" />
      <div>文件查看</div>
      <div style="width: 20px"></div>
    </div>
    <div class="pdf-box" v-if="isPDF">
      <div id="seefile-content">
        <div class="learn-time">{{ currentPage }} / {{ pageCount }}</div>
        <pdf
          :src="url"
          class="pdf"
          :page="currentPage"
          @num-pages="pageCount = $event"
          @progress="loadedRatio = $event"
        ></pdf>
      </div>
      <div class="foot">
        <div @click="prePage">上一页</div>
        <div class="next" @click="nextPage">下一页</div>
      </div>
    </div>
    <div class="pdf-box" v-else>
      <van-image class="imgs" fit="contain" :src="url" />
    </div>
  </div>
</template>

<script>
import pdf from "vue-pdf";

export default {
  name: "SeeFile",
  data() {
    return {
      url: "",
      currentPage: 1,
      pageCount: 0,
      isPDF: false
    };
  },
  components: {
    pdf
  },
  created() {
    if (this.$route.query.name.indexOf("pdf") !== -1) {
      this.getPdfCode();
      this.isPDF = true;
    } else {
      this.isPDF = false;
      this.url = this.format.hdPdf(sessionStorage.getItem("fileid"));
    }
  },
  methods: {
    //返回
    goBack() {
      this.$router.go(-1);
    },
    getPdfCode() {
      let id = sessionStorage.getItem("fileid");
      let that = this;
      this.axios({
        method: "get",
        url: "/hd/suspend/gov/file/download/" + id,
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        },
        responseType: "blob" //设置响应的数据类型为一个包含二进制数据的 Blob 对象，必须设置！！！
      })
        .then(response => {
          that.url = that.getObjectURL(response.data);
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    // 将返回的流数据转换为url
    getObjectURL(file) {
      let url = null;
      if (window.createObjectURL != undefined) {
        // basic
        url = window.createObjectURL(file);
      } else if (window.webkitURL != undefined) {
        // webkit or chrome
        try {
          url = window.webkitURL.createObjectURL(file);
        } catch (error) {
          console.log(error);
        }
      } else if (window.URL != undefined) {
        // mozilla(firefox)
        try {
          url = window.URL.createObjectURL(file);
        } catch (error) {
          console.log(error);
        }
      }
      return url;
    },
    // 上一页
    prePage() {
      let page = this.currentPage;
      page = page > 1 ? page - 1 : this.pageCount;
      this.currentPage = page;
    },

    // 下一页
    nextPage() {
      let page = this.currentPage;
      page = page < this.pageCount ? page + 1 : 1;
      this.currentPage = page;
    }
  }
};
</script>

<style lang="less" scoped>
.seefile {
  width: 100vw;
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
    i {
      font-size: 20px;
    }
  }
  .pdf-box {
    width: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-x: hidden;
    .imgs {
      width: 100%;
    }
  }
  #seefile-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-x: hidden;
  }
  .learn-time {
    width: 100%;
    height: 50px;
    text-align: center;
    line-height: 50px;
  }
  .foot {
    width: 100%;
    height: 50px;
    display: flex;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    overflow: hidden;
    div {
      width: 50%;
      height: 50px;
      color: white;
      background-color: #0199ff;
      text-align: center;
      line-height: 50px;
    }
    .next {
      border-left: 1px solid white;
    }
  }
}
</style>
