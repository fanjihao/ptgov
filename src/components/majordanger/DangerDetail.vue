// 隐患详情
<template>
  <div class="dangerdetail">
    <div class="supTop-nav">
      <i class="el-icon-arrow-left" @click="goBack" />
      <div>隐患详情</div>
      <div style="width: 20px"></div>
    </div>
    <div class="page-content">
      <div class="detail-info">
        <div class="dangerdetail-title">{{ data.orgName }}</div>
        <div class="little-title">隐患描述</div>
        <span class="dangerdetail-title">{{ data.detail }}</span>
        <div class="info-foot">
          <div>
            <p class="little-title">查出人</p>
            <span class="dangerdetail-title">{{ data.userName }}</span>
            <p class="little-title">隐患级别</p>
            <span class="dangerdetail-title">{{ data.levelName }}</span>
          </div>
          <div>
            <p class="little-title">查出时间</p>
            <span class="dangerdetail-title">{{ data.checkTime }}</span>
            <p class="little-title">是否消除</p>
            <span class="dangerdetail-title" v-if="data.handled">是</span>
            <span class="dangerdetail-title" v-else>否</span>
          </div>
        </div>
      </div>
      <div class="classA">整改信息</div>
      <div class="rectify-child">
        <div>
          <p class="little-title">整改责任人</p>
          <span class="dangerdetail-title">{{ data.responsibleName }}</span>
          <p class="little-title">整改类型</p>
          <span class="dangerdetail-title">{{
            data.handleTypeName ? data.handleTypeName : "-"
          }}</span>
          <p class="little-title">整改措施</p>
          <span class="dangerdetail-title">{{
            data.handleMeasure ? data.handleMeasure : "-"
          }}</span>
        </div>
        <div>
          <p class="little-title">整改资金(元)</p>
          <span class="dangerdetail-title">{{ data.funds }}</span>
          <p class="little-title">整改期限</p>
          <span class="dangerdetail-title">{{ data.deadlineTime }}</span>
        </div>
      </div>
      <div class="classA">隐患处置流程</div>
      <div class="danger-steps">
        <div class="steps" v-for="item in data.processList" :key="item.id">
          <div class="steps-mark">
            <div></div>
          </div>
          <div class="steps-detail">
            <div class="steps-detailtitle">{{ item.processCodeStr }}</div>
            <span>{{ item.handleTime }}</span>
            <span>{{ item.processDetail }}</span>
            <div class="steps-user">
              <van-icon name="manager" color="#0099FF" />
              <span>{{ item.handleUserName }}</span>
            </div>
            <div v-if="item.files" class="imgs-box">
              <van-image
                :src="format.photo(i.id)"
                alt="imgs"
                class="imgs"
                v-for="(i, index) in item.files"
                @click="openPhoto(item.files, index)"
                :key="i.id"
                fit="cover"
              >
                <template v-slot:loading>
                  <div class="loading-img">图片加载中</div>
                </template>
              </van-image>
            </div>
            <span class="no-photo" v-else>无图片</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ImagePreview } from "vant";

export default {
  name: "DangerDetail",
  data() {
    return {
      data: "" // 数据
    };
  },
  created() {
    let id = sessionStorage.getItem("hdId");
    this.axios({
      url: "/app/hd/serious/gov/detail",
      method: "",
      params: {
        hdId: id
      }
    })
      .then(res => {
        this.data = res.data.data;
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    // 图片预览
    openPhoto(item, index) {
      let arr = [];
      for (let i = 0; i < item.length; i++) {
        arr.push(this.format.photo(item[i].id));
      }
      ImagePreview({
        images: arr,
        startPosition: index,
        closeable: true
      });
    }
  }
};
</script>

<style lang="less" scoped>
.dangerdetail {
  width: 100vw;
  // height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f4f4f4;
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
  .page-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-x: hidden;
  }
  .detail-info {
    width: 100%;
    background: white;
    height: 220px;
    padding: 15px;
    .info-foot {
      width: 100%;
      display: flex;
      div {
        width: 50%;
      }
    }
  }
  .dangerdetail-title {
    color: #333;
    font-size: 14px;
    margin-bottom: 10px;
  }
  .little-title {
    color: #a3a3a3;
    font-size: 13px;
    margin: 10px 0;
  }
  .classA {
    width: 100%;
    padding: 0 15px;
    height: 50px;
    line-height: 50px;
    font-weight: bold;
  }
  .rectify-child {
    width: 100%;
    padding: 15px;
    background: white;
    height: 200px;
    display: flex;
    div {
      width: 50%;
    }
  }
  .danger-steps {
    width: 100%;
    background: white;
    display: flex;
    flex-direction: column;
    padding: 15px;
    .steps {
      width: 100%;
      display: flex;
      margin-bottom: 10px;
      .steps-mark {
        width: 20px;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        div {
          width: 10px;
          height: 10px;
          border-radius: 15px;
          background: #ccc;
        }
      }
      .steps-detail {
        display: flex;
        flex-direction: column;
        font-size: 14px;
        color: #666;
        flex: 1;
        .steps-user {
          display: flex;
          align-items: center;
          height: 25px;
          span {
            margin-left: 10px;
          }
        }
        .imgs-box {
          width: 100%;
          .imgs {
            width: 80px;
            height: 80px;
          }
          .loading-img {
            width: 100%;
            text-align: center;
          }
        }
      }
      .steps-detailtitle {
        height: 25px;
        line-height: 25px;
        font-weight: bold;
        color: #333;
      }
      .no-photo {
        color: #333;
      }
      .reply-photo {
        width: 80px;
        height: 80px;
      }
    }
  }
}
</style>
