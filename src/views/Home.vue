<template>
  <div class="home">
    <keep-alive class="">
      <router-view style="flex: 1; overflow-x: hidden"></router-view>
    </keep-alive>
    <div class="bottom-nav">
      <div class="col-class" v-for="(i, index) in list" :key="index">
        <router-link :to="i.path" class="nav-btn">
          <div v-if="!i.isMessage">
            <img
              :src="
                i.path === $route.path ? list[index].active : list[index].img
              "
            />
          </div>
          <van-badge :content="$store.state.total" v-else>
            <img
              :src="
                i.path === $route.path ? list[index].active : list[index].img
              "
            />
          </van-badge>
          <span :class="i.path === $route.path ? 'check-title' : 'tab-title'">
            {{ i.name }}
          </span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.home {
  // width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  .tab-title {
    color: rgb(84, 62, 62);
    font-size: 10px;
    font-family: Helvetica, "Hiragino Sans GB", "Microsoft Yahei", "微软雅黑",
      Arial, sans-serif;
  }
  .check-title {
    color: #2b9bfd;
    font-size: 13px;
    font-family: Helvetica, "Hiragino Sans GB", "Microsoft Yahei", "微软雅黑",
      Arial, sans-serif;
  }
  a:visited,
  a:link,
  a:active,
  a:hover {
    text-decoration: none;
  }
  .bottom-nav {
    width: 100%;
    height: 55px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    background: white;
    border-top: 1px solid #ccc;
    img {
      width: 1.5rem;
      height: 1.5rem;
      margin-top: -5px;
    }
    .col-class {
      width: 33.3%;
      height: 55px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .nav-btn {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      padding-bottom: 3px;
    }
  }
}
</style>

<script>
export default {
  name: "Home",
  props: ["tabName"],
  data() {
    return {
      list: [
        {
          img: require("@/assets/home.svg"),
          active: require("@/assets/home_a.svg"),
          name: "首页",
          path: "/homeIndex",
          isMessage: false
        },
        {
          img: require("@/assets/news.svg"),
          active: require("@/assets/news_a.svg"),
          name: "消息",
          path: "/message",
          isMessage: true
        },
        {
          img: require("@/assets/mine.svg"),
          active: require("@/assets/mine_a.svg"),
          name: "我的",
          path: "/my",
          isMessage: false
        }
      ],
      total: this.$store.state.total
    };
  },
  created() {
    this.getMessageTotal();
  },
  mounted() {},
  methods: {
    getMessageTotal() {
      this.axios({
        url: "/authenticated/web-context/message-viewed-total",
        method: "GET",
        params: {
          viewed: false
        }
      })
        .then(res => {
          this.$store.commit("msgTotal", res.data.data);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
