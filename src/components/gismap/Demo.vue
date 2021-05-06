// 监控地图
<template>
  <div class="monitor-map">
    <div class="supTop-nav">
      <i class="el-icon-arrow-left" @click="goBack" />
      <div>demo</div>
      <div>搜索</div>
    </div>
    <div class="monitor-content" id="egismap"></div>
    <div class="foot-unit" v-if="data" @click="toOnline">
      <div>{{ data.name }}</div>
      <p>{{ data.address }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Demo",
  data() {
    return {
      data: "",
      pointList: [], // 点集合
      showPoint: [], // 展示的点集合
      center: [], // 中心点
      warning: [], // 预警
      normal: [], // 正常
      outline: [], // 离线
      noprobe: [], // 无探测器
      warnCheck: false,
      outlineCheck: false,
      okCheck: false,
      noprobeCheck: false,
    };
  },
  created() {
    this.data = JSON.parse(sessionStorage.getItem("chooseFactory"));
  },
  mounted() {
    this.axios({
      url: "/access-units/online/gis",
      method: "GET",
    })
      .then((res) => {
        let data = res.data.data;
        data.map((item) => {
          item.isShow = true;
        });
        this.pointList = data;
        this.showPoint = this.pointList.filter((item) => item.isShow);
        this.warning = this.pointList.filter((item) => item.status === "alarm");
        this.noprobe = this.pointList.filter(
          (item) => item.status === "unconnected"
        );
        this.normal = this.pointList.filter((item) => item.status === "ok");
        this.outline = this.pointList.filter(
          (item) => item.status === "offline"
        );
        let egis = window.egis;
        var urlWMTS = "http://120.52.31.31:590/service/api/egis/base/v1/wmts"; //wmts服务地址
        var client_id = "4441c1fa1b004b58a4eabdb255d966cc"; //用户id
        var client_secret = "46d3c60424e841d8b0ebb9e0a14cb43e"; //用户密码
        // 创建地图
        if (this.data) {
          this.center = [this.data.longitude, this.data.latitude];
        } else {
          this.center = [125.411313, 25.34375509033203];
        }
        var egismap = new egis.carto.Map({
          defaultExtent: {
            center: this.center,
            maxZoom: 10,
            minZoom: 8,
            level: 15,
            extent: [-180, -90, 180, 90],
            projection: "EPSG:4490",
          },
        });
        // 初始化地图，传入要初始化的DOM对象的id
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
          //"url": "http://t0.tianditu.gov.cn/cva_c/wmts?tk=4f62e1d82bd46e2ff470b291c2260156"
        });
        //添加天地图矢量图层
        egismap.addLayer(tiandituvec);
        //添加天地图中文标注图层
        egismap.addLayer(tianditucta);
        // 创建一个元素图层，用来保存元素对象
        var elementLayer = new egis.carto.ElementLayer({
          id: "ElementLayer",
          name: "元素图层",
        });
        // 将元素图层添加到地图上去
        egismap.addLayer(elementLayer);
        // // 创建点要素渲染所需要的符号
        // 创建一个点符号对象
        var pointSymbol = new egis.sfs.SimpleMarkerSymbol({
          fillColor: new egis.sfs.Color({
            r: 0,
            g: 0,
            b: 255,
          }),
          size: 10,
        });
        for (let i = 0; i < this.warning.length; i++) {
          // 创建一个点几何对象
          var point = new egis.sfs.Point({
            x: this.warning[i].longitude,
            y: this.warning[i].latitude,
            spatialReference: 4490,
            name:'sssssssss'
          });
          // 根据点几何对象和点符号对象构造一个点元素对象
          var pointEle = new egis.sfs.Element({
            geometry: point,
            symbol: pointSymbol,
          });
          elementLayer.add(pointEle);
          console.log("sss");
        }
        elementLayer.on("click", (x, y, m, n, d) => {
            console.log(x, y, m, n, d)
        })
      })
      .catch((err) => {
        console.log(err);
      });
  },
  methods: {
    // 返回
    goBack() {
      this.$router.go(-1);
    },
    // 在线监测
    toOnline() {
      this.$router.push({
        path: "/onlinemonitoring",
      });
    },
    TipsCheck(val) {
      if (val === "alarm") {
        this.warnCheck = !this.warnCheck;
        if (this.warnCheck) {
          window.clearMarker("alarm");
        } else {
          window.addMarker("alarm");
        }
      } else if (val === "offline") {
        this.outlineCheck = !this.outlineCheck;
        if (this.outlineCheck) {
          window.clearMarker("offline");
        } else {
          window.addMarker("offline");
        }
      } else if (val === "unconnected") {
        this.noprobeCheck = !this.noprobeCheck;
        if (this.noprobeCheck) {
          window.clearMarker("unconnected");
        } else {
          window.addMarker("unconnected");
        }
      } else if (val === "ok") {
        this.okCheck = !this.okCheck;
        if (this.okCheck) {
          window.clearMarker("ok");
        } else {
          window.addMarker("ok");
        }
      }
      this.pointList.map((item) => {
        if (item.status === val) {
          item.isShow = !item.isShow;
        }
      });
      this.showPoint = this.pointList.filter((item) => item.isShow);
    },
    getDistance(lon1, lat1, lon2, lat2) {
      let PI = 3.14159265358979323; //圆周率
      let R = 6371229; //地球半径
      let x, y, distance;
      let lonres = lon1 > lon2 ? lon1 - lon2 : lon2 - lon1;
      // let latres = lat1 > lat2 ? lat1 - lat2 : lat2 - lat1;
      x = (lonres * PI * R * Math.cos((((lat1 + lat2) / 2) * PI) / 180)) / 180;
      y = ((lat2 - lat1) * PI * R) / 180;
      distance = Math.hypot(x, y);
      return distance;
    },
  },
};
</script>

<style lang="less" scoped>
.monitor-map {
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
  .monitor-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-x: hidden;
    background: #eee;
    position: relative;
    .abTips {
      height: 30px;
      padding: 5px 10px;
      font-size: 14px;
      position: absolute;
      right: 0;
      border: 1px solid #3d88ba;
      border-right: none;
      z-index: 999;
      margin-top: 10px;
      background: white;
      line-height: 30px;
      border-top-left-radius: 15px;
      border-bottom-left-radius: 15px;
      display: flex;
      align-items: center;
    }
    .warncheck {
      background: #d0d0d0;
    }
    .warnnocheck {
      background: white;
    }
    .warning {
      top: 0;
      color: #ff6863;
    }
    .outline {
      top: 40px;
      color: #63758b;
    }
    .normal {
      top: 80px;
      color: #24d457;
    }
    .noprobe {
      top: 120px;
      color: #5b88ed;
    }
  }
  .foot-unit {
    width: 100%;
    height: 80px;
    background: white;
    padding: 10px 15px;
    div {
      font-size: 15px;
    }
  }
}
</style>