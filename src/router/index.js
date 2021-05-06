import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import SetPassword from "../views/SetPassword.vue";
import Supervise from "../components/supervise/Supervise.vue";
import SuperviseDetail from "../components/supervise/SuperviseDetail.vue";
import InspectDetail from "../components/supervise/InspectDetail.vue";
import ChooseFactory from "../components/supervise/ChooseFactory.vue";
import MajorDanger from "../components/majordanger/MajorDanger.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/login"
  },
  {
    path: "/home",
    name: "Home",
    redirect: "/homeIndex",
    component: Home,
    children: [
      {
        path: "/homeIndex",
        component: () => import("../views/HomeIndex.vue")
      },
      {
        path: "/message",
        component: () => import("../views/Message.vue")
      },
      {
        path: "/my",
        component: () => import("../views/My.vue")
      }
    ]
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/setPassword", // 修改密码
    name: "SetPassword",
    component: SetPassword
  },
  {
    path: "/supervise", // 监督检查
    name: "Supervise",
    component: Supervise
  },
  {
    path: "/superviseDetail", // 监督检查详情
    name: "SuperviseDetail",
    component: SuperviseDetail
  },
  {
    path: "/inspectDetail", // 监督检查详情-检查明细
    name: "InspectDetail",
    component: InspectDetail
  },
  {
    path: "/choosefactory", // 监督检查-新增-选择生产经营单位
    name: "ChooseFactory",
    component: ChooseFactory
  },
  {
    path: "/chooselist", // 监督检查-新增-选择隐患清单
    name: "ChooseList",
    component: () => import("../components/supervise/ChooseList.vue")
  },
  {
    path: "/addnew", // 监督检查-新增-新增
    name: "AddNew",
    component: () => import("../components/supervise/AddNew.vue")
  },
  {
    path: "/signature", // 监督检查-新增-新增-签名
    name: "Signature",
    component: () => import("../components/supervise/Signature.vue")
  },
  {
    path: "/addinspectcontent", // 监督检查-新增-添加检查内容
    name: "AddInspectContent",
    component: () => import("../components/supervise/AddInspectContent.vue")
  },
  {
    path: "/examiner", // 监督检查-新增-添加检查人
    name: "Examiner",
    component: () => import("../components/supervise/Examiner.vue")
  },
  {
    path: "/majordanger", // 重大隐患确认
    name: "MajorDanger",
    component: MajorDanger
  },
  {
    path: "/dangerdetail", // 隐患详情
    name: "DangerDetail",
    component: () => import("../components/majordanger/DangerDetail.vue")
  },
  {
    path: "/verifydanger", // 隐患核实
    name: "VerifyDanger",
    component: () => import("../components/majordanger/VerifyDanger.vue")
  },
  {
    path: "/reviewaccepte", // 复查验收
    name: "ReviewAccepte",
    component: () => import("../components/majordanger/ReviewAccepte.vue")
  },
  {
    path: "/firehydrantlist", // 市政消防栓列表
    name: "FireHydrantList",
    component: () => import("../components/firehydrant/FireHydrantList.vue")
  },
  {
    path: "/firehydrantdetail", // 市政消防栓详情
    name: "FireHydrantDetail",
    component: () => import("../components/firehydrant/FireHydrantDetail.vue")
  },
  {
    path: "/changelola", // 市政消防栓详情
    name: "Changelola",
    component: () => import("../components/firehydrant/Changelola.vue")
  },
  {
    path: "/addhydrant", // 市政消防栓详情-明细-新增
    name: "AddHydrant",
    component: () => import("../components/firehydrant/AddHydrant.vue")
  },
  {
    path: "/particularlist", // 市政消防栓详情-明细-详情
    name: "ParticularList",
    component: () => import("../components/firehydrant/ParticularList.vue")
  },
  {
    path: "/warninginfo", // 预警信息
    name: "WarningInfo",
    component: () => import("../components/warninginfo/WarningInfo.vue")
  },
  {
    path: "/warningdetail", // 预警信息
    name: "WarningDetail",
    component: () => import("../components/warninginfo/WarningDetail.vue")
  },
  {
    path: "/disasterlist", // 灾情列表
    name: "DisasterList",
    component: () => import("../components/disaster/DisasterList.vue")
  },
  {
    path: "/disasterdetail", // 灾情详情
    name: "DisasterDetail",
    component: () => import("../components/disaster/DisasterDetail.vue")
  },
  {
    path: "/changedisasterinfo", // 新增/修改灾情信息
    name: "ChangeDisasterInfo",
    component: () => import("../components/disaster/ChangeDisasterInfo.vue")
  },
  {
    path: "/mapsearch", // 位置选择
    name: "MapSearch",
    component: () => import("../components/disaster/MapSearch.vue")
  },
  {
    path: "/search", // 搜索
    name: "Search",
    component: () => import("../components/disaster/Search.vue")
  },
  {
    path: "/demo", // 搜索
    name: "Demo",
    component: () => import("../components/gismap/Demo.vue")
  },
  {
    path: "/riskinfolist", // 风险点列表
    name: "RiskInfoList",
    component: () => import("../components/riskinfomation/RiskInfoList.vue")
  },
  {
    path: "/riskdetail", // 风险点详情
    name: "RiskDetail",
    component: () => import("../components/riskinfomation/RiskDetails.vue")
  },
  {
    path: "/feedback", // 信息反馈
    name: "FeedBack",
    component: () => import("../components/riskinfomation/FeedBack.vue")
  },
  {
    path: "/videoplay", // 视频播放
    name: "VideoPlay",
    component: () => import("../components/riskinfomation/VideoPlay.vue")
  },
  {
    path: "/trainproject", // 我的培训项目
    name: "TrainProject",
    component: () => import("../components/studyonline/TrainProject.vue")
  },
  {
    path: "/projectdetail", // 培训项目详情
    name: "ProjectDetail",
    component: () => import("../components/studyonline/ProjectDetail.vue")
  },
  {
    path: "/studyvideo", // 学习视频
    name: "StudyVideo",
    component: () => import("../components/studyonline/StudyVideo.vue")
  },
  {
    path: "/studyhandout", // 学习讲义
    name: "StudyHandout",
    component: () => import("../components/studyonline/StudyHandout.vue")
  },
  {
    path: "/monitormap", // 监控地图
    name: "MonitorMap",
    component: () => import("../components/gismap/MonitorMap.vue")
  },
  {
    path: "/monitorsearch", // 监控地图-搜索
    name: "MonitorSearch",
    component: () => import("../components/gismap/MonitorSearch.vue")
  },
  {
    path: "/onlinemonitoring", // 监控地图-搜索-企业-点击企业
    name: "OnlineMonitoring",
    component: () => import("../components/gismap/OnlineMonitoring.vue")
  },
  {
    path: "/pointdetail", // 监控地图-搜索-企业-点位详情
    name: "PointDetail",
    component: () => import("../components/gismap/PointDetail.vue")
  },
  {
    path: "/equipment", // 监控地图-搜索-企业-设备详情
    name: "Equipment",
    component: () => import("../components/gismap/Equipment.vue")
  },
  {
    path: "/seefile", // 文件查看
    name: "SeeFile",
    component: () => import("../components/public/SeeFile.vue")
  },
  {
    path: "/personInfo", // 个人信息
    name: "PersonInfo",
    component: () => import("../views/PersonInfo.vue")
  }
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
});

export default router;
