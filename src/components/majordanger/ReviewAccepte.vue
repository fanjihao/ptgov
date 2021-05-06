// 复查验收

<template>
  <div class="verify-danger">
    <div class="supTop-nav">
      <i class="el-icon-arrow-left" @click="goBack" />
      <div>复查验收</div>
      <div @click="submit">提交</div>
    </div>
    <div class="verify-content">
      <div class="isClear">
        <span class="title">是否消除：</span>
        <el-radio v-model="isClear" label="0">是</el-radio>
        <el-radio v-model="isClear" label="1">否</el-radio>
      </div>
      <div class="classA">基础信息</div>
      <div class="basics-info">
        <div class="dangerdetail-title">{{ data.unitName }}</div>
        <div class="little-title">隐患描述</div>
        <span class="dangerdetail-title">{{ data.detail }}</span>
        <div class="little-title">隐患级别</div>
        <span class="dangerdetail-title">{{ data.levelName }}</span>
        <div class="little-title">现场照片</div>
        <div
          v-if="data.livePhotos && data.livePhotos.length > 0"
          class="imgs-box"
        >
          <van-image
            :src="format.photo(i.id)"
            alt="imgs"
            class="imgs"
            v-for="(i, index) in data.livePhotos"
            @click="openPhoto(data.livePhotos, index)"
            :key="i.id"
            fit="cover"
          >
            <template v-slot:loading>
              <div class="loading-img">图片加载中</div>
            </template>
          </van-image>
        </div>
        <span class="dangerdetail-title" v-else>无图片</span>
      </div>
      <div class="classA">整改信息</div>
      <div class="rectify-info">
        <div class="rectify-child">
          <p class="little-title">整改责任人</p>
          <p class="dangerdetail-title">
            {{ data.responsibleName ? data.responsibleName : "-" }}
          </p>
          <p class="little-title">整改时间</p>
          <p class="dangerdetail-title">
            {{ data.replyHandleTime ? data.replyHandleTime : "-" }}
          </p>
          <p class="little-title">整改回复</p>
          <p class="dangerdetail-title">
            {{ data.replyHandleStateName ? data.replyHandleStateName : "-" }}
          </p>
          <p class="little-title">整改措施</p>
          <p class="dangerdetail-title">
            {{ data.handleMeasure ? data.handleMeasure : "-" }}
          </p>
        </div>
        <div class="rectify-child">
          <p class="little-title">整改资金(元)</p>
          <p class="dangerdetail-title">{{ data.funds ? data.funds : 0.0 }}</p>
          <p class="little-title">整改期限</p>
          <p class="dangerdetail-title">
            {{ data.deadlineTime ? data.deadlineTime : "-" }}
          </p>
        </div>
      </div>
      <div class="classA">重大隐患评估隐患信息</div>
      <div class="assessment-info">
        <div class="little-title">隐患现状</div>
        <span class="dangerdetail-title">{{
          data.presentSituation ? data.presentSituation : "-"
        }}</span>
        <div class="little-title">产生原因</div>
        <span class="dangerdetail-title">{{
          data.causeData ? data.causeData : "-"
        }}</span>
        <div class="little-title">评估专家或机构</div>
        <span class="dangerdetail-title">{{
          data.evaluate ? data.evaluate : "-"
        }}</span>
        <div class="little-title">危害分析</div>
        <span class="dangerdetail-title">{{
          data.hazardAnalysis ? data.hazardAnalysis : "-"
        }}</span>
        <div class="little-title">整体难度分析</div>
        <span class="dangerdetail-title">{{
          data.rectification ? data.rectification : "-"
        }}</span>
        <div class="little-title">治理方案</div>
        <div v-if="data.governancePlan && data.governancePlan.length > 0">
          <span
            class="dangerdetail-title solution"
            v-for="item in data.governancePlan"
            :key="item.id"
            @click="Seefile(item)"
          >
            {{ item.fileName }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ImagePreview } from "vant";

export default {
  name: "ReviewAccepte",
  data() {
    return {
      isClear: "0", // 是否消除
      data: ""
    };
  },
  created() {
    let hdId = sessionStorage.getItem("hdId");
    this.axios({
      url: "/app/hd/serious/gov/checking-page",
      method: "GET",
      params: {
        hdId
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
    // 提交
    submit() {
      let hdId = sessionStorage.getItem("hdId");
      this.axios({
        url: "/app/hd/serious/gov/checking",
        method: "PUT",
        data: {
          hdId,
          handled: this.isClear === "0" ? true : false
        }
      })
        .then(res => {
          if (res.data.code === 200) {
            this.$router.go(-1);
          }
        })
        .catch(err => {
          console.log(err);
        });
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
    },
    // 查看文件
    Seefile(item) {
      sessionStorage.setItem("fileid", item.id);
      this.$router.push({
        path: "/seefile",
        query: { name: item.fileName }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.verify-danger {
  width: 100vw;
  // min-height: 100vh;
  display: flex;
  // flex: 1;
  flex-direction: column;
  .supTop-nav {
    background-color: #0199ff;
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    justify-content: space-between;
    position: fixed;
    top: 0;
    z-index: 99;
    color: white;
    i {
      font-size: 20px;
    }
  }
  .verify-content {
    padding-top: 50px;
    width: 100%;
    display: flex;
    flex-direction: column;
    height: auto;
    // flex: 1;
    // overflow-x: hidden;
    background: #f4f4f4;
    .isClear {
      width: 100%;
      height: 50px;
      display: flex;
      align-items: center;
      padding-left: 15px;
      border-top: 1px solid #eee;
      background: white;
      .title {
        margin-right: 20px;
      }
    }
    .notSerious {
      width: 100%;
      height: 50px;
      background: white;
      border-top: 1px solid #ccc;
      display: flex;
      align-items: center;
      padding: 0 15px;
      span {
        font-weight: bold;
        color: #333;
      }
      input {
        font-size: 14px;
      }
    }
    .classA {
      width: 100%;
      padding: 0 15px;
      height: 50px;
      line-height: 50px;
      font-weight: bold;
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
    .basics-info {
      width: 100%;
      padding: 15px;
      background: white;
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
    .assessment-info {
      width: 100%;
      padding: 15px;
      background: white;
      display: flex;
      flex-direction: column;
      .little-title {
        margin: 5px 0;
      }
    }
    .solution {
      color: #4499f6;
    }
  }
  .rectify-info {
    width: 100%;
    background: white;
    display: flex;
    padding: 15px;
    .rectify-child {
      width: 50%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
