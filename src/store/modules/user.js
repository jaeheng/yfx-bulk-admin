import { get } from '@/libs/functions'
import api from '@/config/api'
import { setToken } from '@/libs/storage'
export default {
  namespaced: true,
  state: () => ({
    userInfo: {}
  }),
  mutations: {
    SET_USERINFO (state, userInfo) {
      state.userInfo = userInfo
    },
    CLEAR_USERINFO (state) {
      state.userInfo = {}
    }
  },
  actions: {
    setUserInfo ({ commit }) {
      get(api.userInfo, {}, resp => {
        commit('SET_USERINFO', resp)
      })
    },
    clearUserInfo ({ commit }) {
      setToken('')
      commit('CLEAR_USERINFO')
    }
  },
  getters: {
    userInfo (state) {
      return state.userInfo
    }
  }
}
