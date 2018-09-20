// import Vue from 'vue'

const state = {
  user: null,
  isLogin: false
}

const actions = {
  async login ({commit}, loginInfo) {
    let user = loginInfo.data.user;
    let token = loginInfo.data.token;
    commit('SET_DOING_LOGIN', true)
    // 模拟登陆
    var res = await new Promise((resolve, reject) => {
      sessionStorage.setItem('user', JSON.stringify(user))
      resolve({bool: true, user})
    })
    commit('SET_LOGIN_USER', user)
    commit('SET_LOGIN_TOKEN', token)
    commit('SET_DOING_LOGIN', false)
    return res
  },
  async getLoginUser ({commit}) {
    // 模拟请求用户信息
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        var user = sessionStorage.getItem('user')
        // console.log(JSON.parse(user))
        commit('SET_LOGIN_USER', JSON.parse(user))
        resolve({bool: true, user})
      }, 1000)
    })
  },
  async logout ({commit}) {
    // 模拟退出
    return new Promise((resolve, reject) => {
      sessionStorage.removeItem('user')
      sessionStorage.removeItem('token')
      commit('SET_LOGIN_USER', null)
      resolve({bool: true})
    })
  }
}

const mutations = {
  SET_DOING_LOGIN (state, isLogin) {
    state.isLogin = isLogin
  },
  SET_LOGIN_USER (state, user) {
    state.user = user
  },
  SET_LOGIN_TOKEN (state, token) {
    if (token) {
      sessionStorage.setItem('token', token)
    } else {
      sessionStorage.removeItem('token')
    }
  }
}

export default {
  state,
  actions,
  mutations
}
