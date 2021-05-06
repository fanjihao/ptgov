export default {
  // 监督检查附件
  insphoto: i => {
    let token = localStorage.getItem("token");
    let str = "http://192.167.6.85:88/dah-cem-api/app/insp/gov/file/download/" + i + "?Authorization=" + token;
    return str;
  },
  // 重大隐患图片
  photo: i => {
    let token = localStorage.getItem("token");
    let str = "http://192.167.6.85:88/dah-cem-api/app/hd/file/download/" + i + "?Authorization=" + token;
    return str;
  },
  // 重大隐患文件
  hdPdf: i => {
    let token = localStorage.getItem("token");
    let str = "http://192.167.6.85:88/dah-cem-api/hd/suspend/gov/file/download/" + i + "?Authorization=" + token;
    return str;
  },
  // 消防栓文件
  hyphoto: i => {
    let token = localStorage.getItem("token");
    let str = "http://192.167.6.85:88/dah-cem-api/app/municipal/fire/hydrant/file/download/" + i + "?Authorization=" + token;
    return str;
  },
  // zaihai
  riskphoto: i => {
    let token = localStorage.getItem("token");
    let str = "http://192.167.6.85:88/dah-cem-api/natural/disaster/disk/file/download/" + i + "?Authorization=" + token;
    return str;
  },
  formatObjKey: obj => {
    for (let i in obj) {
      return obj[i];
    }
  },
  formatDate: () => {
    let date = new Date();
    let y = date.getFullYear();
    let m = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    let d = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    let h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    let mi = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    let s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    let str = y + "-" + m + "-" + d + " " + h + ":" + mi + ":" + s;
    return str
  }
};
