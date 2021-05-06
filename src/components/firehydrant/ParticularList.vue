// 消防栓详情-明细
<template>
  <div class="particularlist">
    <div class="supTop-nav">
      <i class="el-icon-arrow-left" @click="goBack" />
      <div>检查明细</div>
      <div style="width: 20px"></div>
    </div>
    <div class="content">
      <div class="particular-top">
        <p class="info-title">所属区域</p>
        <p class="info-content">{{ data.area }}</p>
        <p class="info-title">检查内容</p>
        <p class="info-content">{{ data.checkContent }}</p>
        <p class="info-title">所在位置</p>
        <!-- <el-image class="part-img" /> -->
        <div class="part-img" id="egismap"></div>
      </div>
      <div class="mid-info">检查信息</div>
      <div class="info-detail">
        <div class="info-child">
          <p class="info-title">状态</p>
          <p class="info-content">
            {{
              format.formatObjKey(data.checkStateDictMap)
                ? format.formatObjKey(data.checkStateDictMap)
                : "-"
            }}
          </p>
          <p class="info-title">检查人</p>
          <p class="info-content">{{ data.checker ? data.checker : "-" }}</p>
        </div>
        <div class="info-child">
          <p class="info-title">检查时间</p>
          <p class="info-content">
            {{ data.checkTime ? data.checkTime : "-" }}
          </p>
          <p class="info-title">检查人电话</p>
          <p class="info-content">
            {{ data.checkerPhone ? data.checkerPhone : "-" }}
          </p>
        </div>
      </div>
      <p class="info-photo">现场照片</p>
      <div
        v-if="data.fileInfoList && data.fileInfoList.length > 0"
        class="imgs-box"
      >
        <van-image
          :src="format.hyphoto(i.id)"
          alt="imgs"
          class="imgs"
          v-for="(i, index) in data.fileInfoList"
          @click="openPhoto(data.fileInfoList, index)"
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
  </div>
</template>

<script>
import { ImagePreview } from "vant";

export default {
  name: "ParticularList",
  data() {
    return {
      data: "",
      longitude: "",
      latitude: ""
    };
  },
  created() {
    let id = sessionStorage.getItem("fhddId");
    this.axios({
      url: `/app/municipal/fire/hydrant/check/${id}`,
      method: "GET"
    })
      .then(res => {
        this.data = res.data.data;
        this.longitude = res.data.data.longitude;
        this.latitude = res.data.data.latitude;
        this.showMap();
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    showMap() {
      let egis = window.egis;
      let that = this;
      var urlWMTS = "http://120.52.31.31:590/service/api/egis/base/v1/wmts"; //wmts服务地址
      var client_id = "4441c1fa1b004b58a4eabdb255d966cc"; //用户id
      var client_secret = "46d3c60424e841d8b0ebb9e0a14cb43e"; //用户密码
      // 创建地图
      var center = [that.longitude, that.latitude];
      var egismap = new egis.carto.Map({
        defaultExtent: {
          center,
          maxZoom: 15,
          minZoom: 15,
          level: 15,
          extent: [-180, -90, 180, 90],
          projection: "EPSG:4490"
        }
      });
      // 初始化地图，传入要初始化的DOM对象的id
      egismap.init({ targetId: "egismap" });
      var resthttp = new egis.core.RestHttp({
        client_id: client_id,
        client_secret: client_secret
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
        url: urlWMTS
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
        url: urlWMTS // 图层服务 url
      });
      //添加天地图矢量图层
      egismap.addLayer(tiandituvec);
      //添加天地图中文标注图层
      egismap.addLayer(tianditucta);
      var elementLayer = new egis.carto.ElementLayer({
        name: "元素图层",
        id: "elementLayer",
        visible: true,
        opacity: 1
      });
      egismap.addLayer(elementLayer);

      var picturemarkersymbol = new egis.sfs.PictureMarkerSymbol({
        source:
          "data:image/png;base64,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",
        width: 50,
        height: 60,
        rotation: 0,
        opacity: 1,
        offsetX: 0,
        offsetY: 15,
        scale: 0.5
      });
      //创建图片标记面元素
      var linearElement = new egis.sfs.Element({
        geometry: new egis.sfs.Point({
          x: center[0],
          y: center[1],
          spatialReference: 4490
        }),
        symbol: picturemarkersymbol
      });
      elementLayer.add(linearElement);
      egismap.removeInteractions();
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
.particularlist {
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
  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-x: hidden;
    .particular-top {
      padding: 15px;
      .part-img {
        width: 100%;
        height: 200px;
      }
    }
    .mid-info {
      width: 100%;
      height: 50px;
      background: #f4f4f4;
      padding: 0 15px;
      line-height: 50px;
      font-weight: bold;
      color: #333;
    }
    .info-detail {
      width: 100%;
      padding: 10px 15px;
      display: flex;
      border-bottom: 1px solid #eee;
      .info-child {
        width: 50%;
      }
      .info-title {
        margin: 5px 0;
      }
      .info-content {
        margin-bottom: 0;
      }
    }
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
    .info-photo {
      width: 100%;
      padding: 0 15px;
      margin-top: 10px;
      font-size: 14px;
      color: #333;
      font-weight: bold;
    }
    .imgs-box {
      width: 100%;
      padding: 15px;
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
    .dangerdetail-title {
      width: 100%;
      padding: 15px;
    }
  }
}
</style>
