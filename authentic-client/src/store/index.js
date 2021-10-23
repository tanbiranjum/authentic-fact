import Vue from 'vue'
import Vuex from 'vuex'
import Auth from '../service/Auth'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import Web3 from 'web3'
import Web3Token from 'web3-token'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import router from '../router/index'
/**
 * for fromNow() functionality.
 */
dayjs.extend(relativeTime)

Vue.use(Vuex)

/**
 * Get all posts at first
 */
async function getAllPost() {
  const {
    data: {
      data: { posts },
    },
  } = await Auth.getAllPost()
  posts.map((post) => {
    post.date = dayjs(post.date).fromNow()
    return post
  })
  store.commit('setAllPost', posts)
}
getAllPost()

const store = new Vuex.Store({
  state: {
    posts: [],
    user: [],
  },
  mutations: {
    setAllPost(state, data) {
      state.posts = data
    },
    setUser(state, data) {
      state.user = data
    },
  },
  actions: {
    async login({ commit }, { email, password }) {
      window.ethereum.enable()
      const web3 = new Web3(window.ethereum)
      const address = (await web3.eth.getAccounts())[0]
      const token = await Web3Token.sign((msg) => web3.eth.personal.sign(msg, address), '1d')
      const { data } = await Auth.signInWithWeb3(token)
      console.log(data)
      // const web3modal = new Web3Modal()
      // const provider = await web3modal.connect()
      // const wallet = new ethers.providers.Web3Provider(provider)
      // if (wallet) {
      //   const web3 = new Web3(Web3.givenProvider)
      //   const account = await web3.eth.getAccounts()
      //   let { data } = await Auth.login({
      //     email,
      //     password,
      //     publicAddress: account[0],
      //   })
      localStorage.setItem('credentail', JSON.stringify(data))
      commit('setUser', data.data.user)
      if (data.status === 'success') router.push({ name: 'Home' })
      else alert('Wrong credential')
      // } else {
      //   alert('Connect to a wallet')
      // }
      // ====
    },
  },
  modules: {},
})

export default store

/**
 * status: success
 * posts: {
 *
 * }
 */
