// 灾情详情
<template>
  <div class="disasterdetail">
    <div class="supTop-nav">
      <i class="el-icon-arrow-left" @click="goBack" />
      <div>灾情详情</div>
      <div @click="editDisaster">编辑</div>
    </div>
    <div class="content">
      <div class="content-top">
        <p class="content-title">基本信息</p>
        <div class="info-title">灾情标题</div>
        <div class="info-content">{{ data.disasterTitle }}</div>
        <div class="mid-box">
          <div>
            <div class="info-title">灾情类型</div>
            <div class="info-content">{{ data.disasterTypeStr }}</div>
          </div>
          <div>
            <div class="info-title">灾情级别</div>
            <div class="info-content">{{ data.disasterLevelStr }}</div>
          </div>
        </div>
        <div class="mid-box">
          <div>
            <div class="info-title">灾情区域</div>
            <div class="info-content">{{ data.districtName }}</div>
          </div>
          <div>
            <div class="info-title">详细地址</div>
            <div class="info-content">{{ data.address }}</div>
          </div>
        </div>
        <div class="mid-box">
          <div>
            <div class="info-title">经度</div>
            <div class="info-content">{{ data.longitude }}</div>
          </div>
          <div>
            <div class="info-title">纬度</div>
            <div class="info-content">{{ data.latitude }}</div>
          </div>
        </div>
        <div class="info-title">发生时间</div>
        <div class="info-content">{{ data.occurTime }}</div>
        <div class="info-title">灾情描述</div>
        <div class="info-content">{{ data.description }}</div>
      </div>
      <div class="content-top">
        <p class="content-title">生命财产损失</p>
        <div class="mid-box">
          <div>
            <div class="info-title">死亡人数(人)</div>
            <div class="info-content">
              {{ data.deathNum ? data.deathNum : "-" }}
            </div>
          </div>
          <div>
            <div class="info-title">受伤人数(人)</div>
            <div class="info-content">
              {{ data.injuredNum ? data.injuredNum : "-" }}
            </div>
          </div>
        </div>
        <div class="mid-box">
          <div>
            <div class="info-title">失踪人数(人)</div>
            <div class="info-content">
              {{ data.missingNum ? data.missingNum : "-" }}
            </div>
          </div>
          <div>
            <div class="info-title">直接经济损失(万元)</div>
            <div class="info-content">
              {{ data.economicLosses ? data.economicLosses : "-" }}
            </div>
          </div>
        </div>
      </div>
      <div class="content-top">
        <p class="content-title">扩充信息</p>
        <div class="mid-box">
          <div>
            <div class="info-title">受灾人数(人)</div>
            <div class="info-content">
              {{ data.disasterNum ? data.disasterNum : "-" }}
            </div>
          </div>
          <div>
            <div class="info-title">紧急转移安置人数(人)</div>
            <div class="info-content">
              {{ data.relocationNum ? data.relocationNum : "-" }}
            </div>
          </div>
        </div>
        <div class="mid-box">
          <div>
            <div class="info-title">需紧急生活救助人数(人)</div>
            <div class="info-content">
              {{ data.lifeAssistanceNum ? data.lifeAssistanceNum : "-" }}
            </div>
          </div>
          <div>
            <div class="info-title">需过渡性生活救助人数(万元)</div>
            <div class="info-content">
              {{ data.lifeTransitionalNum ? data.lifeTransitionalNum : "-" }}
            </div>
          </div>
        </div>
        <div class="mid-box">
          <div>
            <div class="info-title">因旱需生活救助人数(人)</div>
            <div class="info-content">
              {{ data.lifeDroughtNum ? data.lifeDroughtNum : "-" }}
            </div>
          </div>
          <div>
            <div class="info-title">因旱饮水困难需救助人数(人)</div>
            <div class="info-content">
              {{ data.waterDroughtNum ? data.waterDroughtNum : "-" }}
            </div>
          </div>
        </div>
        <div class="mid-box">
          <div>
            <div class="info-title">农作物受灾面积(公顷)</div>
            <div class="info-content">
              {{ data.cropDamageArea ? data.cropDamageArea : "-" }}
            </div>
          </div>
          <div>
            <div class="info-title">农作物成灾面积(公顷)</div>
            <div class="info-content">
              {{ data.cropRealizedArea ? data.cropRealizedArea : "-" }}
            </div>
          </div>
        </div>
        <div class="mid-box">
          <div>
            <div class="info-title">农作物绝收面积(公顷)</div>
            <div class="info-content">
              {{ data.cropUnHarvestArea ? data.cropUnHarvestArea : "-" }}
            </div>
          </div>
          <div>
            <div class="info-title">草场受灾面积(公顷)</div>
            <div class="info-content">
              {{ data.pastureDisasterArea ? data.pastureDisasterArea : "-" }}
            </div>
          </div>
        </div>
        <div class="mid-box">
          <div>
            <div class="info-title">倒塌房屋数(间)</div>
            <div class="info-content">
              {{ data.collapsedHouseNum ? data.collapsedHouseNum : "-" }}
            </div>
          </div>
          <div>
            <div class="info-title">损坏房屋数(间)</div>
            <div class="info-content">
              {{ data.damageHouseNum ? data.damageHouseNum : "-" }}
            </div>
          </div>
        </div>
        <div class="mid-box">
          <div>
            <div class="info-title">因灾死亡大牲畜(只)</div>
            <div class="info-content">
              {{ data.deadLivestockNum ? data.deadLivestockNum : "-" }}
            </div>
          </div>
          <div>
            <div class="info-title">农业损失(万元)</div>
            <div class="info-content">
              {{ data.agriculturalLosses ? data.agriculturalLosses : "-" }}
            </div>
          </div>
        </div>
        <div class="mid-box">
          <div>
            <div class="info-title">工矿企业损失(万元)</div>
            <div class="info-content">
              {{ data.enterpriseLosses ? data.enterpriseLosses : "-" }}
            </div>
          </div>
          <div>
            <div class="info-title">基础设施损失(万元)</div>
            <div class="info-content">
              {{ data.infrastructureLosses ? data.infrastructureLosses : "-" }}
            </div>
          </div>
        </div>
        <div class="mid-box">
          <div>
            <div class="info-title">公益设施损失(万元)</div>
            <div class="info-content">
              {{
                data.pubicFacilitiesLosses ? data.pubicFacilitiesLosses : "-"
              }}
            </div>
          </div>
          <div>
            <div class="info-title">家庭财产损失(万元)</div>
            <div class="info-content">
              {{ data.familyLosses ? data.familyLosses : "-" }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DisasterDetail",
  data() {
    return {
      data: ""
    };
  },
  mounted() {
    this.getDetail();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    // 获取详情
    getDetail() {
      let id = sessionStorage.getItem("disasterId");
      this.axios({
        url: "/natural/disaster/report/detail",
        method: "GET",
        params: {
          id
        }
      })
        .then(res => {
          console.log(res);
          this.data = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 新增灾情
    editDisaster() {
      this.$router.push({
        path: "/changedisasterinfo",
        query: { operate: "edit" }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.disasterdetail {
  width: 100vw;
  background: white;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  .el-icon-arrow-left {
    font-size: 20px;
  }
  .supTop-nav {
    background-color: #0199ff;
    height: 50px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    justify-content: space-between;
    color: white;
  }
  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    // flex: 1;
    // overflow-x: hidden;
    background: white;
    .info-title {
      color: #9f9f9f;
      font-size: 13px;
      margin: 5px 0;
    }
    .info-content {
      font-size: 14px;
      color: #333;
      margin-bottom: 10px;
    }
    .content-title {
      font-size: 17px;
      font-weight: bold;
      color: #333;
    }
    .content-top {
      width: 100%;
      padding: 15px;
      border-bottom: 1px solid #eee;
      .mid-box {
        width: 100%;
        display: flex;
      }
      .mid-box > div {
        width: 50%;
        padding-right: 5px;
      }
    }
  }
}
</style>
