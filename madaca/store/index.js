export const state = () => ({
    email: null
  })

export const getters = {
  email: state => state.email,
}

export const mutations = {
  setEmail(state, payload) {
    state.email = payload;
  }
}
