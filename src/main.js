import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import 'video.js/dist/video-js.css'
import 'videojs-contrib-hls'
import videojs from 'video.js'
import echarts from "echarts"
import {
  Button,
  Select,
  Input,
  Row,
  Col,
  Dialog,
  Radio,
  Image,
  ButtonGroup,
  Upload
} from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "vant/lib/index.css";
import axios from "./http";
import format from '@/components/public/photo.js';
Vue.prototype.format = format;

import {
  Uploader,
  Field,
  Step,
  Steps,
  Icon,
  Image as VanImage,
  Popup,
  DatetimePicker,
  Toast,
  List,
  PullRefresh,
  Cascader,
  ImagePreview,
  Loading,
  Badge,
} from "vant";
import vueAxios from "vue-axios";

Vue.use(Step);
Vue.use(Steps);
Vue.use(Icon);
Vue.use(VanImage);
Vue.use(Popup);
Vue.use(DatetimePicker);
Vue.use(Toast);
Vue.use(List);
Vue.use(PullRefresh);
Vue.use(Cascader);
Vue.use(Field);
Vue.use(ImagePreview);
Vue.use(Loading);
Vue.use(Badge);

Vue.config.productionTip = false;
Vue.use(Button);
Vue.use(Select);
Vue.use(Input);
Vue.use(Image);
Vue.use(Row);
Vue.use(Col);
Vue.use(Dialog);
Vue.use(Radio);
Vue.use(Uploader);
Vue.use(Upload);
Vue.use(ButtonGroup);
Vue.use(vueAxios, axios);

Vue.prototype.$video = videojs;
Vue.prototype.$echarts = echarts;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
