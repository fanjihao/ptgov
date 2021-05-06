// 监控地图
<template>
  <div class="monitor-map">
    <div class="supTop-nav">
      <i class="el-icon-arrow-left" @click="goBack" />
      <div>监控地图</div>
      <div @click="toSearch">搜索</div>
    </div>
    <div class="monitor-content" id="egismap">
      <div
        :class="
          warnCheck ? 'abTips warning warncheck' : 'abTips warning warnnocheck'
        "
        @click="TipsCheck('alarm')"
      >
        预警({{ warning.length }})
      </div>
      <div
        :class="
          outlineCheck
            ? 'abTips outline warncheck'
            : 'abTips outline warnnocheck'
        "
        @click="TipsCheck('offline')"
      >
        离线({{ outline.length }})
      </div>
      <div
        :class="
          okCheck ? 'abTips normal warncheck' : 'abTips normal warnnocheck'
        "
        @click="TipsCheck('ok')"
      >
        正常({{ normal.length }})
      </div>
      <div
        :class="
          noprobeCheck
            ? 'abTips noprobe warncheck'
            : 'abTips noprobe warnnocheck'
        "
        @click="TipsCheck('unconnected')"
      >
        无探测器({{ noprobe.length }})
      </div>
    </div>
    <div class="foot-unit" v-if="data" @click="toOnline">
      <div>{{ data.name }}</div>
      <p>{{ data.address }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "MonitorMap",
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
        this.egisMap();
      })
      .catch((err) => {
        console.log(err);
      });
  },
  methods: {
    // 绘制地图
    egisMap() {
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
      var elementLayer1 = new egis.carto.ElementLayer({
        id: "ElementLayer",
        name: "元素图层",
      });
      var elementLayer2 = new egis.carto.ElementLayer({
        id: "ElementLayer",
        name: "元素图层",
      });
      var elementLayer3 = new egis.carto.ElementLayer({
        id: "ElementLayer",
        name: "元素图层",
      });
      var elementLayer4 = new egis.carto.ElementLayer({
        id: "ElementLayer",
        name: "元素图层",
      });
      // 将元素图层添加到地图上去
      egismap.addLayer(elementLayer1);
      egismap.addLayer(elementLayer2);
      egismap.addLayer(elementLayer3);
      egismap.addLayer(elementLayer4);
      // // 创建点要素渲染所需要的符号
      var symbol1 = new egis.sfs.PictureMarkerSymbol({
        source:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAABGCAYAAABhTqxYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAMOSURBVGhD7Zi7ctNAFIblOIFAwtUzUNJAIKjFvAeUtDQ8C09AQ0tDwQwNr8BMQskwUAIFDJACCBlwEnN+aY+j29p7ObJ3PfpmjrWWfNlP5+yxpV4iyPjRwx01ZO6oLbOrthm9J0+HaiiCt0xBoDpxUzJBCTFnGQGJKt5STjJKREqiyq6rkJVMyxJVrKWMZeYswlgJGcksSIQxFpops2ARxkhoqkwgIsxMIa1MYCLMVKFGmUBFGK3QitpWCVUEaOdWk1FZCRrdHEtlFnh5VamVm67MomSSmciywpSys1SZKcrElhVQmnMmE0MH01Gc+9KWWfSwTIzrpcYyZGaSiG7NhEonExiTu6QsU7ptGitdmYVK8RJgrIZRQZcAE4diZmJcN6U5L2eZge4eQECUMgMiyU7jjcCaDAi9sxU7WBFdmYXc2bRzazQEgZab9j4z0MqAwISmioCpMiAQoZkiYKYMWLCQkQgwkgELEjIWAcYyYM5CViLASgbMSchaBFjLgJaFnESAkwxoSchZBDjLABIS/dtDIl7z8XozkBLyFQESlwAS/+NE/gt6nw3guX681kkRERngWm4S5cVIXmm6lIropYbYWQGW5SZWXoyoDDAtN8nyYtq4oWFSOqLlxfifnUGKzzir4szB/buv1vsrt3FIR+/56xu0+UfxR8VB8uOt9++Vu8wgvYBHivMUfexift8bPttY7W+ppyX2D48+bL7YeaCeMocUPym+k9SvbI8D9mU2SDcpUhpdp7hEURIhVkfj5JQa11DHau+huEyxRZ+9TYEsW2MnM0gv0iPO+Hr2vA6yNRwdH+uOJ+oYOt65bEcdiNyi79Id12KbmWsU00pzm2Ltyss3j7/9HX3Jd52AfThGw9MUN7OdzeA78F1WtNHNMqpCBZHWsJX5pLY63lGM8uGJUIMIOtn7fNgIOtvnfGiOfTdDA8hLQLcusJivUqA5bFBgwWNykNyn2KP4SnFE0QRa9UfqanitFa20ZgdEWrO7DFP+0USsUSAb2OIYiyITnCGUmfiPZkdHhw1J8h/PPRxP/Zgk2wAAAABJRU5ErkJggg==",
        width: 50,
        height: 60,
        rotation: 0,
        opacity: 1,
        offsetX: 0,
        offsetY: 15,
        scale: 0.5,
      });
      var symbol2 = new egis.sfs.PictureMarkerSymbol({
        source:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAABGCAYAAABhTqxYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAOVSURBVGhD7ZrLbhMxGIUz4aqWe0AIIYEQpVCyBd6DBWwR6SOgts/Q9hlaxBYk+gqs2XfLgh0SIASCSr1kOMexo2Rie2yPJ3GifNXJ2DPJxGf+3/9c0qxRI6tr2+9lU7CzvfZSNmshmhkOvNvMn8uuoNnNTsumANuPZVOA7XsxDVY283pj64jL4sBdUQbfbq6fESsqEGyGJvjhLNBEkRymciyrmPI2o9IpNBJlMFKh6edlhtGoy0QRmvKNkrOZcRpR+BpyMtPh/BizEYWPoVIzkzSicDXUlEstomJN2AhheqtTgA1jZCYxR8ooi5A2Miy/qRkhHFPxEmkQrRkcgaHLkpSwjW0kzVJMryKmdBuJjPOJZ4KYxjhkJpXqVQbHqKtu1tI8bfTNpFrBTOgqW99MyhXMRHHMs5lms4AwM23zxcRUR6ZYBOZzJlXmZlKBF5yDT3GEGa7gBrFmipmnWar0zaBm78nm1FAc89B9zjTcZSp0d5uzO2folE/jZTdZOEanZwD8WSF1TGPUPhtIee7o5opCO2dSrmy2sRmfLKUYHVtUiPUxWUqGyowQa2lOpbq5GCHWyCg6G1vHWTc7JbtjBQfzZHdz3Sk7nMyQSRjyMUKcrwC403GmHL/LxwhxjoxiHD8LSiOlc6SItxlSp6FQIyTIDKljDlUxQoLNkJiGYMRrsutwLgA6YOSjbFYmxr4qRYbIJ4over1gPsT4V63KZkiVyx7Xs7sLUcyQEEMxjZBKc2YQ26W5iZDP2IgWGeITndhRIVHNEBdDdRgh0dJM4ZI6sdNLET0yxBaduqJCqkem1c6gRegGdAdawhEyHqSjg8NPfI9873VoAYpyUMN30mpf5it0CRq5pOmsvvqc5dnQwcqzvLu78+6Z7A7CW4vf0PfGj/0/Yk0A/pFptS9AbbSWoKtQ0QjT6zakO1BcdwvSfeYatIx9r0ALYq0nfmZa7St4XYbOi/4ojNZT6L7o6XkAPYEuit4oNPII32XabsQ3MnchW2quQGJyI53eIK36Dx/Z5jrZPQc97DW18Dv4XV5ULwAW1OBz/A0YqQ2/AtBqM6/v9TpamGaPobLSewjtQ6bJzoh+QTH41eu64WeGsAD0UsA0bziZb0IsDovQWYiD4/+H/YV+Qt+gE0jHP+grjPC9XvibUZSUZk+ilOZwM4reCY8VSIkpxmhwyW3KKCOhIsQ0oxgF6gAmTL9UzJkzpxYajf+b04qbqMbFHAAAAABJRU5ErkJggg==",
        width: 50,
        height: 60,
        rotation: 0,
        opacity: 1,
        offsetX: 0,
        offsetY: 15,
        scale: 0.5,
      });
      var symbol3 = new egis.sfs.PictureMarkerSymbol({
        source:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAABGCAYAAABhTqxYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAPKSURBVGhD7ZlbT9RAFMdbtruKd12jMT6IEbkVMSb47EfwQZAHY+IlStTP4JMPfgIhEiIvmAheEj+H8RZAw2Y1Rp80aowKCLtLPac9A7u97Uw7helmf8l/O6db2vn3nM5OB62R0GkrhfbZoXvUdLD0G9Ry0K1RatkUe6duUVMKsc1UGbhJW1FG8EOGschmbBMW/L2u1d79qFjaKJzLimMqkhnKRtRM1GMkqiEhMwmbcCNsitvMBhthCBniMtM+MzQCR8p5NsThNlTXzCYbYXAZCjWzSaUVRF1DgWYUM8IINdRCWz9UM4KE9snXDGVFScL65ikzRcvLjW+5eTODUxTVCehjzc6UZIXhyU7YAJA63GbSkhVA9/R1zYzKI5g/lqfPDV1mqWbdjPt9PYWkOzOuBDSfGVVpmlEG16LiuhnXF2mkWWaq4n4FsKiZAnSt2Puopv/uzNiL2OnA8vS1ccsMUWTRLxxLGy2emAp+n1lDh0NVJ6CPvgsDiq8FBC4E+ppBVB3ZwEhgn8MGABVHttA+BbpEFCu36AvnjIb5lwaj78W5ycVW4wKFG0rrv/LkTP/TixSGwmUG6Xk98GAlm7lM4YaQK1Um3p16coXCunDPAPCkRnl1nMLEwWuJGEG4M8PofHv+fiWjX6cwEVpWrbFC3/QwhdwIz83mT04PZyrWGIXSwXNHMYIIZ4bR/WZwvGS0XKVQCmgEbxaFwkQ2g5ivBiaWc5lLFMZC9GH3I5YZRNa0J2yawkvsEyBxDckwgsh6OYszj5M2B5RyR5CI8ziuaQov0swgYuXmXZCIi6wyYwiUjHdBIi5S7wzCWW5Sy4sh3QxSr9xkjV5uZJcZI6yEpJcXI/4dypt4jm2kVlCu7VnXXSNvDEDbQ/HMrAmbFdIiaUn7MRf7xze6mby5Gz9Bu0AZ3FVN2+PO28aB7FkKbcrfSs8/Dc7fobCaMug36DuY+mPviYB4meXNHSC8u+2gvSC3EQN0ePVvZb8TrkP7DoH8/mYfqAPO3Q3CLAsjZiZv7oHPDtBWO/aC2ToNOmaVLc8xtO84qB+0E/f5gEa64FpB3wcimpkjoLDS7AZlsfHl2oeHy4Wll9hGsI37KNwC6nSavuA18FpCJDWa2WDnc4WF+Wxh4X2VkcQQGwDyJtb1USfwBcusB2RnJwQcyeZAQQ87jmwfYTD45YR8iI9mOAA4JRD03ODDfBCEg8N2UA6EnSuBFkA/QV9BFZAfOFR/BiN4rBCJDc2CSBmao5th1P5oorDEMBu4xe+YUcwEy1AiP5pNmjQRQdP+A4zbNW+2ZqVuAAAAAElFTkSuQmCC",
        width: 50,
        height: 60,
        rotation: 0,
        opacity: 1,
        offsetX: 0,
        offsetY: 15,
        scale: 0.5,
      });
      // 向点要素集合对象中添加点要素数据
      for (let i = 0; i < this.warning.length; ++i) {
        let point = new egis.sfs.Point({
          x: this.warning[i].longitude,
          y: this.warning[i].latitude,
          spatialReference: egis.sfs.EnumSpatialReference.EPSG4490,
        });
        let element = new egis.sfs.Element({
          geometry: point,
          symbol: symbol1,
        });
        element.tag = {
          id: this.warning[i].id,
          name: this.warning[i].name,
          longitude: this.warning[i].longitude,
          latitude: this.warning[i].latitude,
          address: this.warning[i].address,
        };
        elementLayer1.add(element);
      }
      for (let i = 0; i < this.outline.length; ++i) {
        let point = new egis.sfs.Point({
          x: this.outline[i].longitude,
          y: this.outline[i].latitude,
          spatialReference: egis.sfs.EnumSpatialReference.EPSG4490,
        });
        let element = new egis.sfs.Element({
          geometry: point,
          symbol: symbol2,
        });
        element.tag = {
          id: this.outline[i].id,
          name: this.outline[i].name,
          longitude: this.outline[i].longitude,
          latitude: this.outline[i].latitude,
          address: this.outline[i].address,
        };
        elementLayer2.add(element);
      }
      for (let i = 0; i < this.normal.length; ++i) {
        let point = new egis.sfs.Point({
          x: this.normal[i].longitude,
          y: this.normal[i].latitude,
          spatialReference: egis.sfs.EnumSpatialReference.EPSG4490,
        });
        let element = new egis.sfs.Element({
          geometry: point,
          symbol: symbol3,
        });
        element.tag = {
          id: this.normal[i].id,
          name: this.normal[i].name,
          longitude: this.normal[i].longitude,
          latitude: this.normal[i].latitude,
          address: this.normal[i].address,
        };
        elementLayer3.add(element);
      }
      for (let i = 0; i < this.noprobe.length; ++i) {
        let symbol4 = new egis.sfs.PictureMarkerSymbol({
          source:
            "data:image/png;base64,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",
          width: 50,
          height: 60,
          rotation: 0,
          opacity: 1,
          offsetX: 0,
          offsetY: 15,
          scale: 0.5,
        });
        // //创建图片标记面元素
        let element = new egis.sfs.Element({
          geometry: new egis.sfs.Point({
            x: this.noprobe[i].longitude,
            y: this.noprobe[i].latitude,
            spatialReference: 4490,
          }),
          symbol: symbol4,
          tag: {
            id: this.noprobe[i].id,
            name: this.noprobe[i].name,
            longitude: this.noprobe[i].longitude,
            latitude: this.noprobe[i].latitude,
            address: this.noprobe[i].address,
          },
        });
        elementLayer4.add(element);
      }
      //绑定鼠标单击事件
      elementLayer1.on("click", (a, b, c, d, e) => {
        console.log(a, b, c, d, e);
        sessionStorage.setItem("chooseFactory", JSON.stringify(e.element.tag));
        this.data = e.element.tag;
      });
      elementLayer2.on("click", (a, b, c, d, e) => {
        console.log(a, b, c, d, e);
        sessionStorage.setItem("chooseFactory", JSON.stringify(e.element.tag));
        this.data = e.element.tag;
      });
      elementLayer3.on("click", (a, b, c, d, e) => {
        console.log(a, b, c, d, e);
        sessionStorage.setItem("chooseFactory", JSON.stringify(e.element.tag));
        this.data = e.element.tag;
      });
      elementLayer4.on("click", (a, b, c, d, e) => {
        console.log(a, b, c, d, e);
        sessionStorage.setItem("chooseFactory", JSON.stringify(e.element.tag));
        this.data = e.element.tag;
      });

      // 清楚标记
      window.clearMarker = function (type) {
        if (type === "alarm") {
          elementLayer1.setVisible(false);
        } else if (type === "offline") {
          elementLayer2.setVisible(false);
        } else if (type === "ok") {
          elementLayer3.setVisible(false);
        } else if (type === "unconnected") {
          elementLayer4.setVisible(false);
        }
      };
      window.addMarker = function (type) {
        if (type === "alarm") {
          elementLayer1.setVisible(true);
        } else if (type === "offline") {
          elementLayer2.setVisible(true);
        } else if (type === "ok") {
          elementLayer3.setVisible(true);
        } else if (type === "unconnected") {
          elementLayer4.setVisible(true);
        }
      };
    },
    // 返回
    goBack() {
      sessionStorage.setItem("chooseFactory", JSON.stringify(""));
      this.$router.go(-1);
    },
    toSearch() {
      this.$router.push({
        path: "/monitorsearch",
      });
      // this.$router.push({
      //   path: "/demo",
      // });
    },
    // 在线监测
    toOnline() {
      this.$router.push({
        path: "/onlinemonitoring",
      });
    },
    warningPoint() {},
    //
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