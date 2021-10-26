<template>
  <div>
    <div class="h-6 mx-12 bg-blue-500" v-if="post.sharerName">
      {{ post.sharerName }}
    </div>
    <div class="flex bg-white shadow-lg rounded-lg mx-12 mt-2">
      <div class="flex items-start px-4 py-6">
        <img
          class="w-12 h-12 rounded-full object-cover mr-4 shadow"
          src="https://images.unsplash.com/photo-1542156822-6924d1a71ace?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
          alt="avatar"
        />
        <div class="">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900 -mt-1">
              {{ post.user.name }}
            </h2>
            <small class="text-sm text-gray-700">{{ post.date }}</small>
          </div>
          <p class="mt-3 text-gray-700 text-sm">
            {{ post.post }}
          </p>
          <img :src="post.media" alt="post image" />
          <div class="mt-4 flex items-center">
            <div class="flex text-gray-700 text-sm mr-3">
              <svg fill="none" viewBox="0 0 24 24" class="w-4 h-4 mr-1" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>{{ calculateRating }}%</span>
            </div>
            <div class="flex mr-2 text-gray-700 text-sm mr-4">
              <svg fill="none" viewBox="0 0 24 24" class="w-4 h-4 mr-1" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              <span><a @click="sharePost(post._id)">share</a></span>
            </div>
            <vueStarRaing v-model="rating" v-bind:star-size="20" v-bind:max-rating="4" />
            <button @click="ratePost()" class="border-2 px-4 ml-4">Rate</button>
          </div>
        </div>
      </div>
    </div>
    <div class="mx-12 bg-blue-500 text-white p-5" v-if="hasNft">
      Content link: {{ this.meta.url }} <br />
      Creation date: {{ new Date(this.meta.createdAt) }} <br />
      NFT ID: {{ this.nft.nftId }} <br />
    </div>
    <form
      v-if="!hasNft && isOwner"
      class="
        flex flex-col
        w-full
        p-10
        px-8
        pt-6
        mx-auto
        my-6
        mb-4
        transition
        duration-500
        ease-in-out
        transform
        bg-white
        border
        rounded-lg
        lg:w-1/2
      "
    >
      <div class="relative pt-4">
        <label class="input-title text-base leading-7 text-blueGray-500" for="name">Title</label
        ><input
          v-model="form.title"
          class="
            w-full
            px-4
            py-2
            mt-2
            mr-4
            text-base text-black
            transition
            duration-500
            ease-in-out
            transform
            rounded-lg
            bg-blueGray-100
            ring-offset-current ring-offset-2
            focus:border-blueGray-500 focus:bg-white focus:outline-none focus:shadow-outline focus:ring-2
            border-2
          "
          type="text"
          name="title"
          placeholder="title"
        />
      </div>
      <div class="flex flex-wrap mt-4 mb-6 -mx-3">
        <div class="w-full px-3">
          <label class="text-base leading-7 text-blueGray-500" for="description"> Description </label
          ><textarea
            v-model="form.description"
            class="
              input-desc
              w-full
              h-32
              px-4
              py-2
              mt-2
              text-base text-blueGray-500
              transition
              duration-500
              ease-in-out
              transform
              bg-white
              border
              rounded-lg
              ring-offset-current ring-offset-2
              apearance-none
              autoexpand
              focus:border-blue-500 focus:outline-none focus:shadow-outline focus:ring-2
            "
            id="description"
            type="text"
            name="description"
            placeholder="Message..."
          ></textarea>
        </div>
      </div>
      <div class="flex"></div>
      <div class="flex items-center w-full pt-4"></div>
      <button
        @click.prevent="createNFT"
        class="
          input-btn
          w-full
          py-3
          text-base text-white
          transition
          duration-500
          ease-in-out
          transform
          bg-blue-600
          border-blue-600
          rounded-md
          ring-offset-current ring-offset-2
          focus:shadow-outline focus:outline-none focus:ring-2
          hover:bg-blue-800
        "
      >
        Mint
      </button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
import vueStarRaing from 'vue-star-rating'
import stringHash from 'string-hash'
import NFT from '../../artifacts/contracts/NFT.sol/NFT.json'
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import { create } from 'ipfs-http-client'
import { nftContract } from '../config'
import Auth from '../service/Auth'

export default {
  name: 'Post',
  components: {
    vueStarRaing,
  },
  data() {
    return {
      post: [],
      rating: 1,
      form: {
        title: '',
        description: '',
        price: 0,
        url: window.location.href,
      },
      nft: [],
      meta: [],
      isOwner: false,
      hasNft: false,
    }
  },
  computed: {
    calculateRating() {
      if (this.post.totalRating === 0) {
        return 0
      }
      let rating = ((this.post.totalPoint * 1) / (this.post.totalRating * 1 * 4)) * 100
      return rating.toFixed(2)
    },
  },
  methods: {
    async loadPost() {
      const {
        data: {
          data: { post },
        },
      } = await Auth.getPost(this.$route.params.id)
      this.post = post
      // GET USER DATA FROM LOCALSTORAGE
      const {
        data: { user },
      } = JSON.parse(localStorage.getItem('credentail'))
      // CHECK IF USER IS POST OWNER
      console.log(post.user.email, user.email)
      if (post.user.email === user.email) {
        this.isOwner = true
      }
    },
    async createNFT() {
      const { title, description, url } = this.form
      const hash = stringHash(this.post.post)
      const data = {
        title,
        description,
        url,
        hash,
      }
      // let { path } = await client.add(data)
      // path = `https://ipfs.io/ipfs/${path}`
      const web3modal = new Web3Modal()
      //Connect to the metamask
      const connection = await web3modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()
      let contract = new ethers.Contract(nftContract, NFT.abi, signer)
      let transaction = await contract.createToken()
      await transaction.wait()
      let tokenID = await contract.getTokenId()
      tokenID = tokenID.toNumber()
      alert(`Your NFT created! Your NFT tokenID is ${tokenID}`)
      this.saveNFT(tokenID)
      await Auth.saveMetaData(data)
    },
    async saveNFT(tokenID) {
      const {
        data: { user },
      } = JSON.parse(localStorage.getItem('credentail'))
      const nftData = {
        userId: user._id,
        postId: this.$route.params.id,
        nftId: tokenID,
        uri: `https://61604640faa03600179fb993.mockapi.io/api/v1/nft/${tokenID}`,
      }
      await Auth.createNFT(nftData)
    },
    async getNFT(id) {
      const { data } = await Auth.getNFT(id)
      if (data.status === 'success') {
        this.hasNft = true
        const { nft } = data
        this.nft = nft
        const res = await axios.get(this.nft.uri)
        this.meta = res.data
      }
    },
    async ratePost() {
      await Auth.ratePost(this.$route.params.id, {
        totalPoint: this.rating,
      })
      alert('Rated')
    },
    async sharePost(id) {
      if (this.calculateRating > 70) {
        alert("You can't share this post!")
        return
      }
      const {
        data: { user },
      } = JSON.parse(localStorage.getItem('credentail'))
      const body = {
        sharerId: user._id,
      }
      await Auth.sharePost(id, body)
    },
  },
  created() {
    this.loadPost()
    this.getNFT(this.$route.params.id)
  },
}
</script>
