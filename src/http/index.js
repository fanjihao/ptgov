// 对 axios 的二次封装

import axios from "axios";
import router from "../router"; // 引入路由对像，用于路由跳转

// 创建一个新的 axios 实例
var http = axios.create({
  baseURL: "http://192.167.6.18:9000/dah-cem-api", // 请求地址前缀
  // baseURL: "http://117.139.247.181:30188/dah-cem-api", // 请求地址前缀
  // baseURL: "http://192.167.6.85:88/dah-cem-api", // 请求地址前缀
  // baseURL: "http://192.167.6.106:8081/dah-cem-api", // 请求地址前缀
  // baseURL: "http://110.89.45.40:1080/dah-cem-api", // 请求地址前缀
  timeout: 15000 // 请求超时
});

// 请求拦截（在请求发出去之前拦截），给所有的请求都带上 token
http.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token");
    if (token) {
      // 设置 token ，一般是在 headers 里加入 Authorization，并加上 Bearer 标注
      config.headers["Authorization"] = token;
    }
    return config;
  },
  error => {
    console.log(error);
    return Promise.reject(error);
  }
);

// 拦截响应，遇到 token 不合法则报错
http.interceptors.response.use(
  response => {
    if (response.data.token) {
      // 将返回的最新的 token 保存
      localStorage.setItem("token", response.data.token);
    }
    return response;
  },
  error => {
    console.log(error);
    if (error.response.status === 401) {
      // 401 说明 token 验证失败
      // 可以直接跳转到登录页面，重新登录获取 token
      // localStorage.removeItem("token");
      router.replace({
        path: "/login",
        query: { redirect: router.currentRoute.fullPath }
      });
    } else if (error.response.status === 500) {
      // 服务器错误
      return Promise.reject("服务器出错：", error.response.data);
    }
    return Promise.reject(error.response.data); // 返回接口返回的错误信息
  }
);

export default http;
