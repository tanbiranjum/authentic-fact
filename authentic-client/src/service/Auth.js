import Api from './Api'
import axios from 'axios'

const Meta = axios.create({
  baseURL: 'https://61604640faa03600179fb993.mockapi.io/api/v1/nft',
})

export default {
  getAllPost() {
    return Api.get('/post')
  },
  getPost(id) {
    return Api.get('/post/' + id)
  },
  signUp(credential) {
    return Api.post('/user/signup', credential)
  },
  login(credential) {
    return Api.post('/user/login', credential)
  },
  logout() {
    return Api.get('/user/logout')
  },
  //NFT
  createNFT(data) {
    return Api.post('/nft', data)
  },
  getNFT(id) {
    return Api.get('/nft/' + id)
  },
  getNftByUser(id) {
    return Api.get('/nft/user/' + id)
  },
  getAllNFT() {
    return Api.get('/nft')
  },
  ratePost(id, data) {
    return Api.patch(`/post/${id}`, data)
  },
  sharePost(id, data) {
    return Api.post(`/post/${id}`, data)
  },
  saveMetaData(data) {
    return Meta.post('/', data)
  },
  signInWithWeb3(token) {
    return Api.get('/user/signinweb3', {
      headers: {
        Authorization: token,
      },
    })
  },
}
