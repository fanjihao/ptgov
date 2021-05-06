// 隐患核实

<template>
  <div class="verify-danger">
    <div class="supTop-nav">
      <i class="el-icon-arrow-left" @click="goBack" />
      <div>隐患核实</div>
      <div @click="submit">提交</div>
    </div>
    <div class="verify-content">
      <div class="isSeriousDanger">
        <el-radio v-model="isSeriousDanger" label="0">确认为重大隐患</el-radio>
        <el-radio v-model="isSeriousDanger" label="1">
          确认为非重大隐患
        </el-radio>
      </div>
      <div class="notSerious" v-if="isSeriousDanger == 1">
        <span>理由：</span>
        <input
          type="text"
          class="search-input"
          v-model="reason"
          placeholder="请输入理由"
        />
      </div>
      <div class="classA">基础信息</div>
      <div class="basics-info">
        <div class="dangerdetail-title">{{ data.unitName }}</div>
        <div class="little-title">隐患描述</div>
        <span class="dangerdetail-title">{{ data.detail }}</span>
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
        <span v-if="data.governancePlan && data.governancePlan.length <= 0">
          -
        </span>
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
</template>

<script>
import { ImagePreview } from "vant";

export default {
  name: "VerifyDanger",
  data() {
    return {
      isSeriousDanger: "0", // 是否重大隐患
      reason: "", // 理由
      data: ""
    };
  },
  created() {
    let hdId = sessionStorage.getItem("hdId");
    this.axios({
      url: "/app/hd/serious/gov/verify-page",
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
      if (this.isSeriousDanger === "1" && this.reason === "") {
        return this.$toast({
          message: "监督管理：请输入理由",
          position: "bottom"
        });
      }
      this.axios({
        url: "/app/hd/serious/gov/verify",
        method: "PUT",
        data: {
          hdId,
          isSerious: this.isSeriousDanger === "0" ? true : false,
          verifyReason: this.reason
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
  // height: 100vh;
  display: flex;
  // flex: 1;
  position: relative;
  flex-direction: column;
  .supTop-nav {
    width: 100%;
    background-color: #0199ff;
    height: 50px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    justify-content: space-between;
    position: fixed;
    z-index: 99;
    color: white;
    i {
      font-size: 20px;
    }
  }
  .verify-content-rea {
    width: 100%;
    display: flex;
    flex-direction: column;
    background: #f4f4f4;
    padding-top: 100px;
  }
  .verify-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    background: #f4f4f4;
    padding-top: 50px;
  }
  .isSeriousDanger {
    width: 100%;
    height: 50px;
    padding: 0 15px;
    display: flex;
    align-items: center;
    background: white;
    flex-shrink: 0;
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
</style>
