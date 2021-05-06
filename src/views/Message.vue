<template>
  <div class="message">
    <div class="message-top">消息</div>
    <div class="message-content">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div
            v-for="item in list"
            :key="item.id"
            class="msg-item"
            @click="alreadyRead(item.id)"
          >
            <div class="message-time">{{ item.pushTime }}</div>
            <div class="msgs">
              <div class="content-top">
                <div class="monitor-icon">
                  <img src="../assets/monitor.svg" alt="" />
                </div>
                <div class="not-read" v-if="item.viewed"></div>
                <div class="read-status" v-else></div>
              </div>
              <div class="msg-line"></div>
              <div class="msg-content">{{ item.content }}</div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      // 下拉刷新
      list: [], // 数据数组
      pageNum: 1,
      loading: false,
      finished: false,
      refreshing: false,
      lastPage: false // 最后一页
    };
  },
  created() {
    this.getMessage();
  },
  methods: {
    ...mapMutations({
      updateTotal: "updateTotal"
    }),
    getMessage() {
      this.axios({
        url: "/authenticated/web-context/message-page",
        method: "GET",
        params: {
          pageNum: this.pageNum,
          pageSize: 10
        }
      })
        .then(res => {
          if (this.refreshing) {
            setTimeout(() => {
              this.refreshing = false;
            }, 500);
          }
          let newList = res.data.data.rows;
          if (this.pageNum >= res.data.data.pages) {
            this.lastPage = true;
            this.finished = true;
            this.list = this.list.concat(newList);
          } else {
            this.lastPage = false;
            this.finished = false;
            this.list = this.list.concat(newList);
          }
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    onLoad() {
      setTimeout(() => {
        if (!this.lastPage) {
          this.pageNum = this.pageNum + 1;
          this.getMessage();
        }
      }, 1000);
    },
    // 刷新数据
    onRefresh() {
      // 清空列表数据
      this.finished = false;
      this.refreshing = true;
      this.lastPage = false;
      this.list = [];
      this.pageNum = 1;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.getMessage();
    },
    // 消息已读
    alreadyRead(id) {
      this.axios({
        url: `/authenticated/web-context/message?id=${id}`,
        method: "PUT"
      })
        .then(res => {
          if (res.data.code === 200) {
            this.getReadTotal();
            this.onRefresh();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getReadTotal() {
      this.$store.commit("updateTotal");
    }
  }
};
</script>

<style lang="less" scoped>
.message {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  .message-top {
    background: #137bee;
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: white;
    font-weight: bolder;
  }
  .message-content {
    width: 100%;
    display: flex;
    flex: 1;
    background: #eee;
    flex-direction: column;
    align-items: center;
    overflow-x: hidden;
    .msg-item {
      width: 100%;
      margin: 10px 0 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      .message-time {
        width: 100%;
        text-align: center;
      }
      .msgs {
        width: 88%;
        border-radius: 15px;
        border: 1px solid #ccc;
        background: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
        padding: 5px;
        margin-top: 10px;
        .content-top {
          width: 95%;
          height: 30px;
          display: flex;
          justify-content: space-between;
          padding: 0 5px;
          align-items: center;
          .monitor-icon {
            width: 20px;
            height: 20px;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .read-status {
            width: 8px;
            height: 8px;
            border-radius: 5px;
            background: red;
          }
          .not-read {
            width: 8px;
            height: 8px;
          }
        }
        .msg-line {
          width: 100%;
          border-bottom: 1px solid #ccc;
        }
        .msg-content {
          width: 95%;
          padding: 10px 0;
        }
      }
    }
  }
}
</style>
