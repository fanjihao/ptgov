// 编辑修改灾情信息
<template>
  <div class="changedisinfo">
    <div class="supTop-nav">
      <i class="el-icon-arrow-left" @click="goBack" />
      <div>
        {{ this.$route.query.operate === "add" ? "新增灾情" : "编辑灾情" }}
      </div>
      <div @click="saveDisaInfo">保存</div>
    </div>
    <div class="change-tab">
      <div :class="index === 1 ? 'checked' : 'notcheck'" @click="index = 1">
        基本信息
      </div>
      <div :class="index === 2 ? 'checked' : 'notcheck'" @click="index = 2">
        生命财产损失
      </div>
      <div :class="index === 3 ? 'checked' : 'notcheck'" @click="index = 3">
        扩充信息
      </div>
    </div>
    <div class="change-content">
      <div class="base-info" v-if="index === 1">
        <div class="standard-top base-top">
          <span class="title">灾情标题：</span>
          <input
            type="text"
            class="standard-input"
            v-model="disasterTitle"
            placeholder="必填项"
          />
        </div>
        <div class="standard-top">
          <span class="title">灾情类型：</span>
          <div class="modal-check">
            <p class="choose-area" @click="chooseTypeHandle">
              {{ choosedLevel }}
            </p>
            <van-popup v-model="levelshow" round position="bottom">
              <div class="area-picker">
                <div class="picker-top">
                  <span @click="disaTypeCancel">取消</span>
                  <span @click="disaTypeFinish">确定</span>
                </div>
                <div class="picker-val">
                  <div
                    :class="levelTab === 1 ? 'picked' : 'nopick'"
                    @click="changeDisaType(1)"
                  >
                    {{
                      levelTab === 1 && !disafirstChoosed ? "请选择" : disafirst
                    }}
                  </div>
                  <div
                    :class="levelTab === 2 ? 'picked' : 'nopick'"
                    @click="changeDisaType(2)"
                  >
                    {{
                      levelTab === 2 && !disasecondChoosed
                        ? "请选择"
                        : disasecond
                    }}
                  </div>
                  <div
                    :class="levelTab === 3 ? 'picked' : 'nopick'"
                    @click="changeDisaType(3)"
                  >
                    {{
                      levelTab === 3 && !disathirdChoosed ? "请选择" : disathird
                    }}
                  </div>
                </div>
                <div class="area-list">
                  <div
                    v-for="item in levelList"
                    :key="item.code"
                    @click="chooseChildType(item)"
                  >
                    {{ item.name }}
                  </div>
                </div>
              </div>
            </van-popup>
          </div>
        </div>
        <div class="standard-top">
          <span class="title">灾情级别：</span>
          <div class="btn-box" @click="levelVisible = true">
            {{ disasterLevelStr }}
            <i class="el-icon-caret-bottom"></i>
          </div>
          <!-- 点击全部-筛选明细 -->
          <el-dialog
            :visible.sync="levelVisible"
            :before-close="handleClose"
            :show-close="false"
            top="20vh"
            width="80%"
            custom-class="inspect-modal"
          >
            <div class="modal-text" @click="changelevel('')">全部</div>
            <div class="modal-text" @click="changelevel('disasterLevel_01')">
              小型
            </div>
            <div class="modal-text" @click="changelevel('disasterLevel_02')">
              中型
            </div>
            <div class="modal-text" @click="changelevel('disasterLevel_03')">
              大型
            </div>
            <div class="modal-text" @click="changelevel('disasterLevel_04')">
              特大
            </div>
            <div class="modal-text" @click="changelevel('disasterLevel_05')">
              无
            </div>
          </el-dialog>
        </div>
        <div class="standard-top">
          <span class="title">发生时间：</span>
          <p @click="timeShow = true">{{ currentDateVal }}</p>
          <!-- 时间筛选模态框 -->
          <van-popup v-model="timeShow" position="bottom">
            <van-datetime-picker
              title="选择时间"
              item-height="30"
              :formatter="formatter"
              @confirm="dateConfirm"
              @cancel="timeShow = false"
              :min-date="minDate"
              :max-date="maxDate"
              v-model="currentDate"
            />
          </van-popup>
        </div>
        <div class="standard-top">
          <span class="title">行政区划：</span>
          <div class="modal-check">
            <p class="choose-area" @click="chooseAreaHandle">
              {{ choosedArea }}
            </p>
            <van-popup v-model="show" round position="bottom">
              <div class="area-picker">
                <div class="picker-top">
                  <span @click="onCancel">取消</span>
                  <span @click="onFinish">确定</span>
                </div>
                <div class="picker-val">
                  <div
                    :class="codeTab === 1 ? 'picked' : 'nopick'"
                    @click="changeLevelVal(1)"
                  >
                    {{ codeTab === 1 && !firstChoosed ? "请选择" : firstLevel }}
                  </div>
                  <div
                    :class="codeTab === 2 ? 'picked' : 'nopick'"
                    @click="changeLevelVal(2)"
                  >
                    {{
                      codeTab === 2 && !secondChoosed ? "请选择" : secondLevel
                    }}
                  </div>
                  <div
                    :class="codeTab === 3 ? 'picked' : 'nopick'"
                    @click="changeLevelVal(3)"
                  >
                    {{ codeTab === 3 && !thirdChoosed ? "请选择" : thirdLevel }}
                  </div>
                  <div
                    :class="codeTab === 4 ? 'picked' : 'nopick'"
                    @click="changeLevelVal(4)"
                  >
                    {{ codeTab === 4 && !forthChoosed ? "请选择" : forthLevel }}
                  </div>
                </div>
                <div class="area-list">
                  <div
                    v-for="item in areaList"
                    :key="item.code"
                    @click="chooseChildArea(item)"
                  >
                    {{ item.name }}
                  </div>
                </div>
              </div>
            </van-popup>
          </div>
        </div>
        <div class="standard-top">
          <span class="title">详细地址：</span>
          <div class="standard-input address" @click="toMapsearch">
            {{ address.address }}
          </div>
        </div>
        <div class="discript">
          <span class="title">灾情描述</span>
          <textarea v-model="description" placeholder="必填项" />
        </div>
      </div>
      <div class="base-info" v-if="index === 2">
        <div class="life-top">
          <span class="title">死亡人数(人)：</span>
          <input
            type="text"
            class="life-input"
            v-model="deathNum"
            placeholder="请输入"
          />
        </div>
        <div class="life-top">
          <span class="title">受伤人数(人)：</span>
          <input
            type="text"
            class="life-input"
            v-model="injuredNum"
            placeholder="请输入"
          />
        </div>
        <div class="life-top">
          <span class="title">失踪人数(人)：</span>
          <input
            type="text"
            class="life-input"
            v-model="missingNum"
            placeholder="请输入"
          />
        </div>
        <div class="life-top">
          <span class="title">直接经济损失(万元)：</span>
          <input
            type="text"
            class="life-input"
            v-model="economicLosses"
            placeholder="请输入"
          />
        </div>
      </div>
      <div class="base-info" v-if="index === 3">
        <div class="life-top">
          <span class="title">受灾人数(人)：</span>
          <input
            type="text"
            class="life-input"
            v-model="disasterNum"
            placeholder="请输入"
          />
        </div>
        <div class="life-top">
          <span class="title">紧急转移安置人数(人)：</span>
          <input
            type="text"
            class="life-input"
            v-model="relocationNum"
            placeholder="请输入"
          />
        </div>
        <div class="life-top">
          <span class="title">需紧急生活救助人数(人)：</span>
          <input
            type="text"
            class="life-input"
            v-model="lifeAssistanceNum"
            placeholder="请输入"
          />
        </div>
        <div class="life-top">
          <span class="title">需过渡性生活救助人数(人)：</span>
          <input
            type="text"
            class="life-input"
            v-model="lifeTransitionalNum"
            placeholder="请输入"
          />
        </div>
        <div class="life-top">
          <span class="title">因旱需生活救助人数(人)：</span>
          <input
            type="text"
            class="life-input"
            v-model="lifeDroughtNum"
            placeholder="请输入"
          />
        </div>
        <div class="life-top">
          <span class="title">因旱饮水困难需救助人数(人)：</span>
          <input
            type="text"
            class="life-input"
            v-model="waterDroughtNum"
            placeholder="请输入"
          />
        </div>
        <div class="life-top">
          <span class="title">农作物受灾面积(公顷)：</span>
          <input
            type="text"
            class="life-input"
            v-model="cropDamageArea"
            placeholder="请输入"
          />
        </div>
        <div class="life-top">
          <span class="title">农作物成灾面积(公顷)：</span>
          <input
            type="text"
            class="life-input"
            v-model="cropRealizedArea"
            placeholder="请输入"
          />
        </div>
        <div class="life-top">
          <span class="title">农作物绝收面积(公顷)：</span>
          <input
            type="text"
            class="life-input"
            v-model="cropUnHarvestArea"
            placeholder="请输入"
          />
        </div>
        <div class="life-top">
          <span class="title">草场受灾面积(公顷)：</span>
          <input
            type="text"
            class="life-input"
            v-model="pastureDisasterArea"
            placeholder="请输入"
          />
        </div>
        <div class="life-top">
          <span class="title">倒塌房屋数(间)：</span>
          <input
            type="text"
            class="life-input"
            v-model="collapsedHouseNum"
            placeholder="请输入"
          />
        </div>
        <div class="life-top">
          <span class="title">损坏房屋数(间)：</span>
          <input
            type="text"
            class="life-input"
            v-model="damageHouseNum"
            placeholder="请输入"
          />
        </div>
        <div class="life-top">
          <span class="title">因灾死亡大牲畜(只)：</span>
          <input
            type="text"
            class="life-input"
            v-model="deadLivestockNum"
            placeholder="请输入"
          />
        </div>
        <div class="life-top">
          <span class="title">农业损失(万元)：</span>
          <input
            type="text"
            class="life-input"
            v-model="agriculturalLosses"
            placeholder="请输入"
          />
        </div>
        <div class="life-top">
          <span class="title">工矿企业损失(万元)：</span>
          <input
            type="text"
            class="life-input"
            v-model="enterpriseLosses"
            placeholder="请输入"
          />
        </div>
        <div class="life-top">
          <span class="title">基础设施损失(万元)：</span>
          <input
            type="text"
            class="life-input"
            v-model="infrastructureLosses"
            placeholder="请输入"
          />
        </div>
        <div class="life-top">
          <span class="title">公益设施损失(万元)：</span>
          <input
            type="text"
            class="life-input"
            v-model="pubicFacilitiesLosses"
            placeholder="请输入"
          />
        </div>
        <div class="life-top">
          <span class="title">家庭财产损失(万元)：</span>
          <input
            type="text"
            class="life-input"
            v-model="familyLosses"
            placeholder="请输入"
          />
        </div>
      </div>
    </div>
    <van-popup v-model="loadingshow" class="loading">
      <van-loading size="40" color="#177cf0" :style="{ marginRight: '10px' }" />
      <div :style="{ fontSize: '18px' }">数据加载中，请稍后</div>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: "ChangeDisasterInfo",
  data() {
    return {
      disasterTitle: "", // 灾情标题
      disasterType: "",
      disasterTypeA: "",
      disasterTypeB: "", // 灾情类型
      disasterLevel: "",
      disasterLevelStr: "全部", // 灾情级别
      occurTime: "", // 发生时间
      districtCode: "",
      districtName: "",
      address: "", // 详细地址
      description: "", // 灾情描述

      deathNum: "", // 死亡人数
      injuredNum: "", // 受伤人数
      missingNum: "", // 失踪人数
      economicLosses: "", // 直接经济损失

      disasterNum: "", // 受灾人数
      relocationNum: "", // 紧急转移安置
      lifeAssistanceNum: "", // 需紧急
      lifeTransitionalNum: "", // 过渡性
      lifeDroughtNum: "", // 旱需
      waterDroughtNum: "", // 旱饮水
      cropDamageArea: "", // 农作物受灾
      cropRealizedArea: "", // 成灾
      cropUnHarvestArea: "", // 绝收
      pastureDisasterArea: "", // 草场受灾
      collapsedHouseNum: "", // 倒塌房屋
      damageHouseNum: "", // 损坏房屋
      deadLivestockNum: "", // 因灾牲畜
      agriculturalLosses: "", // 农业损失
      enterpriseLosses: "", // 工况损失
      infrastructureLosses: "", // 基础设施损失
      pubicFacilitiesLosses: "", // 公益
      familyLosses: "", // 家庭

      latitude: "",
      longitude: "",

      cityCode: "",
      communityCode: "",
      countyCode: "",
      provinceCode: "",
      streetCode: "",

      createdBy: "",
      createdOn: "",
      disasterTypeStr: "",
      id: "",
      modifiedBy: "",
      modifiedOn: "",
      disInfo: "",
      index: 1, // tab

      // 区域选择
      show: false,
      codeTab: 1,
      firstLevel: "", // 城市级
      secondLevel: "", // 区县级
      thirdLevel: "", // 镇级
      forthLevel: "", //村级
      first: {}, // 1
      second: {}, // 2
      third: {}, // 3
      forth: {}, //4
      firstChoosed: false, // 1
      secondChoosed: false, // 2
      thirdChoosed: false, // 3
      forthChoosed: false, //4
      choosedArea: "请选择", // 选中的地区
      areaList: [], // 地区集合
      // 灾情等级
      levelshow: false,
      levelTab: 1,
      disafirst: "", // 全部灾害类型
      disasecond: "", // 一级灾害类型
      disathird: "", // 二级灾害类型
      disaone: {}, // 选中的item
      disatwo: {}, // 选中的item
      disathree: {}, // 选中的item
      disafirstChoosed: false, // 全部灾害类型 选中
      disasecondChoosed: false, // 一级灾害类型 选中
      disathirdChoosed: false, // 二级灾害类型 选中
      choosedLevel: "请选择", // 选中的等级
      levelList: [{ name: "全部", id: 0, code: "adasd-adasd" }], // 等级集合
      // 等级筛选
      levelVisible: false,
      // 时间选择
      timeShow: false,
      minDate: new Date(2018, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(),
      currentDateVal: "",
      loadingshow: false // 加载show
    };
  },
  created() {
    const date = new Date();
    let Y = date.getFullYear();
    let M =
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1;
    let D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    let h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    let m =
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    this.currentDateVal = Y + "-" + M + "-" + D + " " + h + ":" + m;
    if (this.$route.query.operate === "edit") {
      this.getDetail();
    } else {
      let obj = JSON.parse(sessionStorage.getItem("address"));
      if (obj) {
        this.address = obj;
      } else {
        sessionStorage.setItem("address", JSON.stringify(null));
        this.address = "";
      }
    }
  },
  methods: {
    // 返回
    goBack() {
      sessionStorage.setItem("address", JSON.stringify(null));
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
          this.disInfo = res.data.data;
          this.disasterTitle = this.disInfo.disasterTitle; // 灾情标题
          this.disasterType = this.disInfo.disasterType;
          this.disatwo.code = this.disInfo.disasterTypeA;
          this.disathree.code = this.disInfo.disasterTypeB; // 灾情类型
          this.choosedLevel = this.disInfo.disasterTypeStr;
          this.first.code = this.disInfo.cityCode;
          this.second.code = this.disInfo.countyCode;
          this.third.code = this.disInfo.streetCode;
          this.forth.code = this.disInfo.communityCode;

          this.disasterLevel = this.disInfo.disasterLevel;
          this.disasterLevelStr = this.disInfo.disasterLevelStr; // 灾情级别
          this.currentDate = new Date(this.disInfo.occurTime); // 发生时间
          this.currentDateVal = this.disInfo.occurTime; // 发生时间
          this.districtCode = this.disInfo.districtCode;
          this.choosedArea = this.disInfo.districtName;
          this.address = this.disInfo.address; // 详细地址
          this.description = this.disInfo.description; // 灾情描述

          this.deathNum = this.disInfo.deathNum; // 死亡人数
          this.injuredNum = this.disInfo.injuredNum; // 受伤人数
          this.missingNum = this.disInfo.missingNum; // 失踪人数
          this.economicLosses = this.disInfo.economicLosses; // 直接经济损失

          this.disasterNum = this.disInfo.disasterNum; // 受灾人数
          this.relocationNum = this.disInfo.relocationNum; // 紧急转移安置
          this.lifeAssistanceNum = this.disInfo.lifeAssistanceNum; // 需紧急
          this.lifeTransitionalNum = this.disInfo.lifeTransitionalNum; // 过渡性
          this.lifeDroughtNum = this.disInfo.lifeDroughtNum; // 旱需
          this.waterDroughtNum = this.disInfo.waterDroughtNum; // 旱饮水
          this.cropDamageArea = this.disInfo.cropDamageArea; // 农作物受灾
          this.cropRealizedArea = this.disInfo.cropRealizedArea; // 成灾
          this.cropUnHarvestArea = this.disInfo.cropUnHarvestArea; // 绝收
          this.pastureDisasterArea = this.disInfo.pastureDisasterArea; // 草场受灾
          this.collapsedHouseNum = this.disInfo.collapsedHouseNum; // 倒塌房屋
          this.damageHouseNum = this.disInfo.damageHouseNum; // 损坏房屋
          this.deadLivestockNum = this.disInfo.deadLivestockNum; // 因灾牲畜
          this.agriculturalLosses = this.disInfo.agriculturalLosses; // 农业损失
          this.enterpriseLosses = this.disInfo.enterpriseLosses; // 工况损失
          this.infrastructureLosses = this.disInfo.infrastructureLosses; // 基础设施损失
          this.pubicFacilitiesLosses = this.disInfo.pubicFacilitiesLosses; // 公益
          this.familyLosses = this.disInfo.familyLosses; // 家庭

          // 详细地址
          this.address = {
            address: this.disInfo.address,
            longitude: this.disInfo.longitude,
            latitude: this.disInfo.latitude
          };
          sessionStorage.setItem("address", JSON.stringify(this.address));
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 选择区域
    chooseAreaHandle() {
      this.show = true;
      if (this.codeTab === 1) {
        this.axios({
          url: `/authenticated/dictionary-types/district/${localStorage.getItem(
            "code"
          )}`,
          method: "GET"
        })
          .then(res => {
            let arr = [];
            arr.push(res.data.data);
            this.areaList = arr;
          })
          .catch(err => {
            console.log(err);
          });
      } else if (this.codeTab === 2) {
        this.changeLevelVal(2);
      } else if (this.codeTab === 3) {
        this.changeLevelVal(3);
      } else if (this.codeTab === 4) {
        this.changeLevelVal(4);
      }
    },
    chooseChildArea(item) {
      if (this.codeTab === 1) {
        this.firstLevel = item.name;
        this.first = item;
        this.firstChoosed = true;
      } else if (this.codeTab === 2) {
        this.secondLevel = item.name;
        this.second = item;
        this.secondChoosed = true;
      } else if (this.codeTab === 3) {
        this.thirdLevel = item.name;
        this.third = item;
        this.thirdChoosed = true;
      } else if (this.codeTab === 4) {
        this.forthLevel = item.name;
        this.forth = item;
        this.forthChoosed = true;
      }
      if (item.hasChild !== false) {
        this.axios({
          url: `/authenticated/dictionary-types/district/${item.code}/children`,
          method: "GET"
        })
          .then(res => {
            this.codeTab = this.codeTab + 1;
            this.areaList = res.data.data;
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    // 点击上面四级地区选择
    changeLevelVal(i) {
      this.codeTab = i;
      if (i === 1) {
        this.firstLevel = "";
        this.secondLevel = "";
        this.thirdLevel = "";
        this.forthLevel = "";
        this.firstChoosed = false;
        this.secondChoosed = false;
        this.thirdChoosed = false;
        this.forthChoosed = false;
        this.chooseAreaHandle();
      } else if (i === 2) {
        this.secondLevel = "";
        this.thirdLevel = "";
        this.forthLevel = "";
        this.secondChoosed = false;
        this.thirdChoosed = false;
        this.forthChoosed = false;
        this.axios({
          url: `/authenticated/dictionary-types/district/${this.first.code}/children`,
          method: "GET"
        })
          .then(res => {
            this.areaList = res.data.data;
          })
          .catch(err => {
            console.log(err);
          });
      } else if (i === 3) {
        this.thirdLevel = "";
        this.forthLevel = "";
        this.thirdChoosed = false;
        this.forthChoosed = false;
        this.axios({
          url: `/authenticated/dictionary-types/district/${this.second.code}/children`,
          method: "GET"
        })
          .then(res => {
            this.areaList = res.data.data;
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    // 点击确定，会触发 finish 事件
    onFinish() {
      this.show = false;
      let region = "";
      if (this.firstChoosed) {
        this.choosedArea = this.firstLevel;
        region = this.firstLevel;
      }
      if (this.secondChoosed) {
        this.choosedArea = this.firstLevel + ">" + this.secondLevel;
        region = this.firstLevel + this.secondLevel;
      }
      if (this.thirdChoosed) {
        this.choosedArea =
          this.firstLevel + ">" + this.secondLevel + ">" + this.thirdLevel;
        region = this.firstLevel + this.secondLevel + this.thirdLevel;
      }
      if (this.forthChoosed) {
        this.choosedArea =
          this.firstLevel +
          ">" +
          this.secondLevel +
          ">" +
          this.thirdLevel +
          ">" +
          this.forthLevel;

        region =
          this.firstLevel +
          this.secondLevel +
          this.thirdLevel +
          this.forthLevel;
      }
      sessionStorage.setItem("region", region);
    },
    // 点击取消，恢复默认值
    onCancel() {
      this.show = false;
      this.codeTab = 1;
      this.first = "";
      this.firstLevel = "";
      this.firstChoosed = false;
      this.second = "";
      this.secondLevel = "";
      this.secondChoosed = false;
      this.third = "";
      this.thirdLevel = "";
      this.thirdChoosed = false;
      this.forth = "";
      this.forthLevel = "";
      this.forthChoosed = false;
    },
    // 模态框关闭val
    handleClose() {
      this.levelVisible = false;
    },
    // 修改筛选条件
    changelevel(val) {
      if (val === "") {
        this.disasterLevelStr = "全部";
      } else if (val === "disasterLevel_01") {
        this.disasterLevelStr = "小型";
      } else if (val === "disasterLevel_02") {
        this.disasterLevelStr = "中型";
      } else if (val === "disasterLevel_03") {
        this.disasterLevelStr = "大型";
      } else if (val === "disasterLevel_04") {
        this.disasterLevelStr = "特大型";
      } else {
        this.disasterLevelStr = "无";
      }
      this.levelVisible = false;
    },
    // 灾情类型
    chooseTypeHandle() {
      this.levelshow = true;
      this.changeDisaType(this.levelTab);
    },
    chooseChildType(item) {
      if (this.levelTab === 1) {
        this.disafirst = item.name;
        this.disaone = item;
        this.disafirstChoosed = true;
        this.levelTab = 2;
        this.getFirstdisa();
      } else if (this.levelTab === 2) {
        this.disasecond = item.name;
        this.disatwo = item;
        this.disasecondChoosed = true;
        this.levelTab = 3;
        this.getSeconddisa(item.code);
      } else if (this.levelTab === 3) {
        this.disathird = item.name;
        this.disathree = item;
        this.disathirdChoosed = true;
      }
    },
    getFirstdisa() {
      this.axios({
        url: `/authenticated/dictionary-types/naturalDisastersType/roots`,
        method: "GET"
      })
        .then(res => {
          this.levelList = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getSeconddisa(code) {
      this.axios({
        url: `/authenticated/dictionary-types/naturalDisastersType/${code}/children`,
        method: "GET"
      })
        .then(res => {
          this.levelList = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    changeDisaType(i) {
      this.levelTab = i;
      if (i === 1) {
        this.disafirst = "";
        this.disasecond = "";
        this.disathird = "";
        this.disafirstChoosed = false;
        this.disasecondChoosed = false;
        this.disathirdChoosed = false;
        this.levelList = [{ name: "全部", id: 0, code: "adasd-adasd" }];
      } else if (i === 2) {
        this.disasecond = "";
        this.disathird = "";
        this.disasecondChoosed = false;
        this.disathirdChoosed = false;
      } else if (i === 3) {
        this.thirdLevel = "";
      }
    },
    disaTypeFinish() {
      this.levelshow = false;
      if (this.disafirstChoosed) {
        this.choosedLevel = this.disafirst;
      }
      if (this.disasecondChoosed) {
        this.choosedLevel = this.disasecond;
      }
      if (this.disathirdChoosed) {
        this.choosedLevel = this.disasecond + ">" + this.disathird;
      }
    },
    disaTypeCancel() {
      this.levelshow = false;
      this.codeTab = 1;
      this.disafirst = "";
      this.disaone = "";
      this.disafirstChoosed = false;
      this.disasecond = "";
      this.disatwo = "";
      this.disasecondChoosed = false;
      this.disathird = "";
      this.disathree = "";
      this.disathirdChoosed = false;
      this.levelList = [{ name: "全部", id: 0, code: "adasd-adasd" }];
    },
    // 时间筛选
    formatter(type, val) {
      if (type === "year") {
        return val + "年";
      }
      if (type === "month") {
        return val + "月";
      }
      if (type === "day") {
        return val + "日";
      }
      if (type === "hour") {
        return val + "时";
      }
      if (type === "minute") {
        return val + "分";
      }
      return val;
    },
    dateConfirm(value) {
      let Y = value.getFullYear();
      let M =
        value.getMonth() + 1 < 10
          ? "0" + (value.getMonth() + 1)
          : value.getMonth() + 1;
      let D = value.getDate() < 10 ? "0" + value.getDate() : value.getDate();
      let h = value.getHours() < 10 ? "0" + value.getHours() : value.getHours();
      let m =
        value.getMinutes() < 10 ? "0" + value.getMinutes() : value.getMinutes();
      this.currentDateVal = `${Y}-${M}-${D} ${h}:${m}`;
      this.timeShow = false;
    },
    // 保存信息
    saveDisaInfo() {
      if (this.disasterTitle == "" || this.choosedArea == "请选择") {
        this.$toast({
          message: "监督管理：请输入必填项",
          position: "bottom"
        });
      } else {
        let disasterType, disasterTypeA, disasterTypeB;
        if (this.disatwo) {
          disasterType = this.disatwo.code;
          disasterTypeA = this.disatwo.code;
        }
        if (this.disathree) {
          disasterType = this.disatwo.code + this.disathree.code;
          disasterTypeB = this.disathree.code;
        }
        if (this.$route.query.operate === "edit") {
          this.editSave(disasterType, disasterTypeA, disasterTypeB);
        } else {
          this.addSave(disasterType, disasterTypeA, disasterTypeB);
        }
      }
    },
    // 新增
    addSave(disasterType, disasterTypeA, disasterTypeB) {
      this.loadingshow = true;
      this.axios({
        url: "/natural/disaster/report/save",
        method: "POST",
        data: {
          disasterTitle: this.disasterTitle,
          disasterType,
          disasterTypeA,
          disasterTypeB,
          disasterTypeStr: "",
          disasterLevel: this.disasterLevel,
          disasterLevelStr: this.disasterLevelStr,
          occurTime: this.currentDateVal,
          provinceCode: localStorage.getItem("provincecode"),
          cityCode: this.first.code,
          countyCode: this.second.code,
          streetCode: this.third.code,
          communityCode: this.forth.code,
          address: this.address.address,
          description: this.description,
          longitude: this.address.longitude,
          latitude: this.address.latitude,

          deathNum: this.deathNum,
          injuredNum: this.injuredNum,
          missingNum: this.missingNum,
          economicLosses: this.economicLosses,

          disasterNum: this.disasterNum, // 受灾人数
          relocationNum: this.relocationNum, // 紧急转移安置
          lifeAssistanceNum: this.lifeAssistanceNum, // 需紧急
          lifeTransitionalNum: this.lifeTransitionalNum, // 过渡性
          lifeDroughtNum: this.lifeDroughtNum, // 旱需
          waterDroughtNum: this.waterDroughtNum, // 旱饮水
          cropDamageArea: this.cropDamageArea, // 农作物受灾
          cropRealizedArea: this.cropRealizedArea, // 成灾
          cropUnHarvestArea: this.cropUnHarvestArea, // 绝收
          pastureDisasterArea: this.pastureDisasterArea, // 草场受灾
          collapsedHouseNum: this.collapsedHouseNum, // 倒塌房屋
          damageHouseNum: this.damageHouseNum, // 损坏房屋
          deadLivestockNum: this.deadLivestockNum, // 因灾牲畜
          agriculturalLosses: this.agriculturalLosses, // 农业损失
          enterpriseLosses: this.enterpriseLosses, // 工况损失
          infrastructureLosses: this.infrastructureLosses, // 基础设施损失
          pubicFacilitiesLosses: this.pubicFacilitiesLosses, // 公益
          familyLosses: this.familyLosses // 家庭
        }
      })
        .then(res => {
          if (res.data.code === 200) {
            this.loadingshow = false;
            this.$router.go(-1);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 编辑
    editSave(disasterType, disasterTypeA, disasterTypeB) {
      this.loadingshow = true;
      this.axios({
        url: "/natural/disaster/report/renew",
        method: "PUT",
        data: {
          disasterTitle: this.disasterTitle,
          disasterType,
          disasterTypeA,
          disasterTypeB,
          disasterTypeStr: "",
          disasterLevel: this.disasterLevel,
          disasterLevelStr: this.disasterLevelStr,
          occurTime: this.currentDateVal,
          provinceCode: localStorage.getItem("provincecode"),
          cityCode: this.first.code,
          countyCode: this.second.code,
          streetCode: this.third.code,
          communityCode: this.forth.code,
          address: this.address.address,
          description: this.description,
          longitude: this.address.longitude,
          latitude: this.address.latitude,

          deathNum: this.deathNum,
          injuredNum: this.injuredNum,
          missingNum: this.missingNum,
          economicLosses: this.economicLosses,
          id: this.disInfo.id,
          disasterNum: this.disasterNum, // 受灾人数
          relocationNum: this.relocationNum, // 紧急转移安置
          lifeAssistanceNum: this.lifeAssistanceNum, // 需紧急
          lifeTransitionalNum: this.lifeTransitionalNum, // 过渡性
          lifeDroughtNum: this.lifeDroughtNum, // 旱需
          waterDroughtNum: this.waterDroughtNum, // 旱饮水
          cropDamageArea: this.cropDamageArea, // 农作物受灾
          cropRealizedArea: this.cropRealizedArea, // 成灾
          cropUnHarvestArea: this.cropUnHarvestArea, // 绝收
          pastureDisasterArea: this.pastureDisasterArea, // 草场受灾
          collapsedHouseNum: this.collapsedHouseNum, // 倒塌房屋
          damageHouseNum: this.damageHouseNum, // 损坏房屋
          deadLivestockNum: Number(this.deadLivestockNum), // 因灾牲畜
          agriculturalLosses: this.agriculturalLosses, // 农业损失
          enterpriseLosses: this.enterpriseLosses, // 工况损失
          infrastructureLosses: this.infrastructureLosses, // 基础设施损失
          pubicFacilitiesLosses: this.pubicFacilitiesLosses, // 公益
          familyLosses: this.familyLosses // 家庭
        }
      })
        .then(res => {
          if (res.data.code === 200) {
            this.loadingshow = false;
            this.$router.go(-1);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 选择详细地址
    toMapsearch() {
      this.$router.push({
        path: "/mapsearch"
      });
    }
  }
};
</script>

<style lang="less" scoped>
.changedisinfo {
  width: 100vw;
  background: white;
  display: flex;
  flex-direction: column;
  height: 100vh;
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
  .modal-text {
    width: 100%;
    height: 50px;
    line-height: 50px;
    padding-left: 15px;
    border-bottom: 1px solid #d0d0d0;
  }
  .modal-mid-text {
    border-bottom: none;
  }
  .change-tab {
    width: 100%;
    height: 50px;
    display: flex;
    .checked {
      width: 50%;
      height: 100%;
      border-bottom: 2px solid #0099ff;
      line-height: 50px;
      text-align: center;
      color: #0099ff;
      font-weight: bold;
      flex-shrink: 1;
    }
    .notcheck {
      width: 50%;
      height: 100%;
      border-bottom: 1px solid #eee;
      line-height: 50px;
      text-align: center;
      color: #666;
      font-weight: bold;
      flex-shrink: 1;
    }
  }
  .change-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    background: white;
    overflow-x: hidden;
    width: 100%;
    .base-info {
      width: 100%;
      height: 100%;
    }
    .standard-top {
      width: 100%;
      height: 50px;
      display: flex;
      align-items: center;
      padding: 0 15px;
      border-top: 1px solid #eee;
      .standard-input {
        border: none;
        height: 100%;
        display: flex;
        flex: 1;
        font-size: 14px;
      }
      .address {
        display: flex;
        align-items: center;
      }
      .btn-box {
        display: flex;
        flex: 1;
        align-items: center;
        color: #999999;
      }
    }
    .base-top {
      border: none;
    }
    .discript {
      border-top: 1px solid #eee;
      width: 100%;
      padding: 15px 15px 0;
      display: flex;
      flex-direction: column;
      textarea {
        border: 1px solid #eee;
        margin-top: 5px;
        padding: 5px;
        height: 150px;
        background: #f7f7f7;
      }
    }
    .life-top {
      width: 100%;
      height: 50px;
      display: flex;
      align-items: center;
      padding: 0 15px;
      border-bottom: 1px solid #eee;
      .life-input {
        border: none;
        height: 100%;
        width: 70%;
        font-size: 14px;
      }
    }
    .modal-check {
      width: 100%;
      display: flex;
      flex: 1;
      .check-btn {
        width: 85px;
        height: 30px;
        border: 1px solid #4367fd;
        color: #4367fd;
        background: rgba(67, 103, 253, 0.3);
        line-height: 30px;
        text-align: center;
        border-radius: 30px;
        font-size: 12px;
        margin-bottom: 10px;
      }
      .nocheck-btn {
        margin-bottom: 10px;
        width: 85px;
        height: 30px;
        color: #666;
        background: #f5f5f5;
        line-height: 30px;
        text-align: center;
        border-radius: 30px;
        font-size: 12px;
      }
      .choose-area {
        width: 100%;
        height: 100%;
        color: #999;
      }
    }
  }
}
.area-picker {
  width: 100%;
  height: 300px;
  background: white;
  display: flex;
  flex-direction: column;

  .picker-top {
    width: 100%;
    padding: 10px 15px;
    background-color: #0199ff;
    display: flex;
    justify-content: space-between;
    color: white;
  }
  .picker-val {
    width: 100%;
    height: 40px;
    display: flex;
    border-bottom: 1px solid #eee;
    .nopick {
      width: 50%;
      height: 40px;
      text-align: center;
      line-height: 40px;
      flex-shrink: 1;
    }
    .picked {
      width: 50%;
      height: 40px;
      border-bottom: 2px solid #0199ff;
      color: #0199ff;
      text-align: center;
      line-height: 40px;
      flex-shrink: 1;
    }
  }
  .area-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-x: hidden;
    div {
      width: 100%;
      height: 40px;
      padding: 0 15px;
      display: flex;
      align-items: center;
    }
  }
}
</style>
