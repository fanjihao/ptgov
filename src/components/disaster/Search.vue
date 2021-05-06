<template>
  <div class="search">
    <div class="supTop-nav">
      <i class="el-icon-arrow-left" @click="goBack" />
      <div>搜索</div>
      <div style="width: 20px"></div>
    </div>
    <div id="egismap"></div>
    <div class="content">
      <!-- 搜索框 -->
      <div class="search-part">
        <div class="input-box">
          <input
            type="text"
            class="search-input"
            v-model="searchVal"
            placeholder="请输入查询内容"
          />
          <div class="icon-box" @click="searchHandle">
            <i class="el-icon-search searchIcon"></i>
          </div>
        </div>
      </div>
      <div class="items">
        <van-list
          v-model="loading"
          :finished="finished"
        >
          <div
            class="data-item"
            v-for="(item, index) in list"
            :key="index"
            @click="checkItems(item)"
            :title="item"
          >
            <p class="item-title">{{ item.name }}</p>
            <p class="item-content">{{ item.address }}</p>
          </div>
        </van-list>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Search",
  data() {
    return {
      address: "",
      searchVal: "", //
      // 下拉刷新
      pageNum: 1,
      list: [], // 数据数组
      loading: false,
      finished: true,
      refreshing: false,
      lastPage: false, // 最后一页
    };
  },
  created() {},
  mounted() {
    let egis = window.egis;
    let that = this;
    var urlWMTS = "http://120.52.31.31:590/service/api/egis/base/v1/wmts"; //wmts服务地址
    var urlService = "http://120.52.31.31:590/service/api/egis/base/v1"; //服务地址
    var client_id = "22a42f65c8c44724b5703efd54bf5782"; //用户id
    var client_secret = "aa9001532bd34279a97e3b01bf6173f9"; //用户密码
    var tokenUrl = "http://120.52.31.31:590/oauth/token"; //授权服务地址
    var authType = "Token"; //授权类型
    // 创建地图
    var egismap = new egis.carto.Map({
      defaultExtent: {
        center: [116.3466, 39.8704],
        maxZoom: 18,
        minZoom: 2,
        level: 15,
        extent: [-180, -90, 180, 90],
        projection: "EPSG:4490",
      },
    }); // 初始化地图，传入要初始化的DOM对象的id
    egismap.init({ targetId: "egismap" });
    var resthttp = new egis.core.RestHttp({
      client_id: client_id,
      client_secret: client_secret,
    });
    // 创建 天地图矢量 瓦片图层
    var tiandituvec = new egis.carto.TileLayer({
      restHttp: resthttp,
      name: "天地图矢量",
      layers: "vec", //": "图层名称",
      matrix: 21, //": "切图级别小于等于切图级别",
      matrixSet: "c", //": "切图策略",
      matrixPrefix: "", //": "切图策略加冒号：",
      format: "tiles", //": "图层格式",
      projection: "EPSG:4490", //": "投影参考",
      layerType: 1, //": "图层类型",
      tileType: 102, //": "瓦片类型",
      opacity: 1.0, //": "透明度",
      visible: true, //": "是否显示",
      crossOrigin: "anonymous",
      style: "default",
      extent: { minx: -180, miny: -90, maxx: 180, maxy: 90 },
      wrapX: true, //": "是否展示循环图",
      url: urlWMTS,
    });

    // 创建 天地图中文标注 瓦片图层
    var tianditucta = new egis.carto.TileLayer({
      restHttp: resthttp,
      name: "天地图中文标注",
      layers: "cva", // 图层名称
      matrixSet: "c", // 切图策略
      format: "tiles", // 图层格式
      projection: "EPSG:4490",
      extent: { minx: -180, miny: -90, maxx: 180, maxy: 90 },
      matrixPrefix: "",
      matrix: 21,
      tileType: 102, // 瓦片类型
      opacity: 1.0,
      visible: true,
      wrapX: true, //": "是否展示循环图",
      url: urlWMTS, // 图层服务 url
    });
    //添加天地图矢量图层
    egismap.addLayer(tiandituvec);
    //添加天地图中文标注图层
    egismap.addLayer(tianditucta);

    // 创建元素图层对象，
    var elementLayer = new egis.carto.ElementLayer({
      id: "elementLayer",
      opacity: 1,
      visible: true,
    });

    //添加元素图层
    egismap.addLayer(elementLayer);

    var wpssService = new egis.ews.RestWPSSService({
      url: urlService,
      clientId: client_id,
      clientSecret: client_secret,
      authType: authType,
      tokenUrl: tokenUrl,
    });

    window.keywordSearch = function () {
      // 创建返回type = 4 的输入参数
      var keywordInput = new egis.ews.SearchKeywordInput({
        keyword: that.searchVal,
        region: sessionStorage.getItem("region"),
        //   bounds: "116.18198,39.84396,116.5799,40.00327",
        query_type: 1,
        admin_code: "156350302",
        page_num: that.pageNum,
        page_size: 10000,
        city_limit: false,
        scope: 2,
        level: 5,
      });
      var promise1 = wpssService.searchKeyWord(keywordInput);
      promise1.then(function (result) {
        console.log(result);
        that.list = result.suggests;
      });
    };
    window.geocoding = function (item) {
      // 构造地理编码输入参数对象
      var WGCSInput = new egis.ews.WGCSInput({
        address: item.address + item.name,
        city: item.address,
      });
      // 构造地理编码服务对象
      var WGCSService = new egis.ews.RestWGCSService({
        url: urlService,
        clientId: client_id,
        clientSecret: client_secret,
        authType: authType,
        tokenUrl: tokenUrl,
      });
      var promise = WGCSService.geocode(WGCSInput);
      promise.then(function (data) {
        let obj = {
            address:item.address + item.name,
            longitude:data.location.x,
            latitude:data.location.y
        }
        sessionStorage.setItem("address", JSON.stringify(obj));
        that.$router.go(-1);
      });
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    searchHandle() {
      window.keywordSearch();
    },
    checkItems(item) {
      window.geocoding(item);
    },
  },
};
</script>

<style lang="less" scoped>
.search {
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
  #egismap {
    display: none;
  }
  .content {
    width: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow-x: hidden;
    .search-part {
      width: 100vw;
      background: white;
      padding: 10px 15px;
      box-shadow: 0px 2px 10px 1px #e5e5e5;
      display: flex;
      box-sizing: border-box;
      .input-box {
        background: #f2f2f2;
        height: 45px;
        width: 100%;
        border-radius: 5px;
        display: flex;
        .search-input {
          border: none;
          width: 85%;
          height: 100%;
          background: #f2f2f2;
          border-radius: 5px;
          padding-left: 10px;
        }
        .icon-box {
          width: 15%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          .searchIcon {
            font-size: 20px;
            color: #ababab;
          }
        }
      }
    }
    .items {
      width: 100%;
      display: flex;
      flex-direction: column;
      flex: 1;
      padding: 15px;
    }
    .data-item {
      width: 100%;
      padding: 10px 0;
      border-bottom: 1px solid #eee;
      .item-title {
        font-size: 15px;
        color: #333;
      }
    }
  }
  .foot-address {
    width: 100%;
    background: white;
    padding: 15px;
    font-size: 14px;
    color: #333;
  }
}
</style>