export const state = () => ({
  isLogin: false
})

export const getters = {
  isLogin: state => state.isLogin
}

export const mutations = {
  setLogin (state, payload) {
    state.isLogin = payload
  }
}
