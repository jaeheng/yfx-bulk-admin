export default {
  namespaced: true,
  state: () => ({
    menuCollapse: false
  }),
  mutations: {
    TOGGLE_COLLAPSE (state) {
      state.menuCollapse = !state.menuCollapse
    }
  },
  actions: {
    toggleMenuCollapse ({ commit }) {
      commit('TOGGLE_COLLAPSE')
    }
  },
  getters: {
    menuCollapse (state) {
      return state.menuCollapse
    }
  }
}
