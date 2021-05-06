import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    total: null
  },
  mutations: {
    msgTotal(state, num) {
      state.total = num;
    },
    updateTotal(state) {
      state.total = state.total - 1;
    }
  },
  actions: {},
  modules: {},
  getters: {
    getTotal(state) {
      return state.total;
    }
  }
});
