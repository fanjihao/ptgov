<template>
  <div class="inspect-detail">
    <div class="insTop-nav">
      <i class="el-icon-arrow-left" @click="goBack" />
      <div>检查明细</div>
      <div style="width: 20px"></div>
    </div>
    <div class="detail-info">
      <div class="info-top">
        <p class="info-title">检查明细</p>
        <p class="send-title">{{ data.content }}</p>
        <div style="margin: 10px 0">
          <p class="info-title">检查结果</p>
          <span class="info-level qualified" v-if="data.result">合格</span>
          <span class="info-level danger" v-else>隐患</span>
        </div>
        <div>
          <p class="info-title">现场照片</p>
          <div v-if="img && img.length > 0" class="imgs-box">
            <van-image
              :src="format.insphoto(i.id)"
              alt="imgs"
              class="imgs"
              v-for="(i, index) in img"
              @click="openPhoto(img, index)"
              :key="i.id"
              fit="cover"
            >
              <template v-slot:loading>
                <div class="loading-img">图片加载中</div>
              </template>
            </van-image>
          </div>
          <p v-else class="info-content">暂无</p>
        </div>
      </div>
      <div class="danger-part">
        <div class="detail-title" v-if="!data.result">隐患详情</div>
        <div class="info-top" v-if="!data.result">
          <div style="margin: 0 0 10px 0">
            <p class="info-title">隐患描述</p>
            <p class="info-content">{{ data.hd.detail }}</p>
          </div>
          <div>
            <p class="info-title">隐患级别</p>
            <span class="info-level danger" v-if="data.hd.level === 'serious'"
              >重大隐患</span
            >
            <span class="info-level low" v-if="data.hd.level === 'low'"
              >一般隐患</span
            >
          </div>
        </div>
        <div class="detail-title" v-if="!data.result">整改信息</div>
        <div class="rectify-info" v-if="!data.result">
          <div class="rectify-child">
            <div style="margin: 0 0 10px 0">
              <p class="info-title">整改责任人</p>
              <p class="info-content">
                {{ data.hd.responsibleName ? data.hd.responsibleName : "-" }}
              </p>
            </div>
            <div style="margin: 0 0 10px 0">
              <p class="info-title">整改类型</p>
              <p class="info-content" v-if="data.hd.handleType == 'spot'">
                现场整改
              </p>
              <p
                class="info-content"
                v-else-if="data.hd.handleType == 'deadline'"
              >
                限期整改
              </p>
              <p class="info-content" v-else>停业整顿</p>
            </div>
            <div style="margin: 0 0 10px 0">
              <p class="info-title">是否消除</p>
              <p class="info-content" v-if="data.hd.handled">是</p>
              <p class="info-content" v-else>否</p>
            </div>
            <div style="margin: 0 0 10px 0">
              <p class="info-title">整改措施</p>
              <p class="info-content">
                {{ data.hd.handleMeasure ? data.hd.handleMeasure : "-" }}
              </p>
            </div>
          </div>
          <div class="rectify-child">
            <div style="margin: 0 0 10px 0">
              <p class="info-title">整改资金(元)</p>
              <p class="info-content">{{ data.hd.funds }}</p>
            </div>
            <div style="margin: 0 0 10px 0">
              <p class="info-title">整改期限</p>
              <p class="info-content">
                {{
                  data.hd.deadlineTime && data.hd.handleType !== "spot"
                    ? data.hd.deadlineTime
                    : "-"
                }}
              </p>
            </div>
            <div style="margin: 0 0 10px 0">
              <p class="info-title">消除时间</p>
              <p class="info-content">
                {{ data.hd.handledTime ? data.hd.handledTime : "-" }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.insTop-nav {
  width: 100%;
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
.inspect-detail {
  height: 100vh;
  display: flex;
  flex: 1;
  flex-direction: column;
  .detail-info {
    width: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow-x: hidden;
    .info-top {
      width: 100%;
      background: white;
      flex-shrink: 0;
      padding: 15px;
      .send-title {
        font-size: 14px;
        font-weight: bold;
      }
    }
    .info-title {
      color: #9f9f9f;
      font-size: 13px;
      margin-bottom: 5px;
    }
    .info-content {
      font-size: 14px;
      color: #333;
    }
    .info-level {
      padding: 3px 12px;
      text-align: center;
      color: white;
      border-radius: 30px;
      font-size: 13px;
    }
    .danger {
      background: #ff4948;
    }
    .low {
      background: #ff8d1b;
    }
    .qualified {
      background: #1db761;
    }
  }
  .danger-part {
    width: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
    background: white;
  }
  .detail-title {
    width: 100%;
    height: 50px;
    line-height: 50px;
    padding: 0 15px;
    font-size: 15px;
    font-weight: 550;
    background: #ededed;
    flex-shrink: 0;
  }
  .rectify-info {
    width: 100%;
    background: white;
    display: flex;
    // flex: 1;
    // overflow-x: hidden;
    padding: 15px;
    .rectify-child {
      width: 50%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  }
  .imgs-box {
    width: 100%;
    display: flex;
    .imgs {
      width: 80px;
      height: 80px;
      margin-right: 3px;
    }
    .loading-img {
      width: 100%;
      text-align: center;
    }
  }
}
</style>

<script>
import { ImagePreview } from "vant";

export default {
  name: "InspectDetail",
  data() {
    return {
      img: "",
      data: "" // 传递的页面数据
    };
  },
  methods: {
    // 返回
    goBack() {
      this.$router.go(-1);
    },
    // 图片预览
    openPhoto(item, index) {
      let arr = [];
      for (let i = 0; i < item.length; i++) {
        arr.push(this.format.insphoto(item[i].id));
      }
      ImagePreview({
        images: arr,
        startPosition: index,
        closeable: true
      });
    }
  },
  created() {
    this.data = JSON.parse(sessionStorage.getItem("detailinfo"));
    this.img = this.data.livePhotos;
  }
};
</script>
