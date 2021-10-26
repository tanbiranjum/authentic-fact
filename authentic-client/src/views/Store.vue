<template>
  <section class="text-blueGray-700">
    <div class="items-center px-5 py-8 mx-auto lg:px-24">
      <h1>CRYPTO COLLECTIBLE STORE</h1>
      <div class="flex flex-wrap mb-8 text-left">
        <div v-for="(item, i) in items" :key="i" class="items-center px-5 py-12 w-1/3">
          <div class="mx-auto bg-white border rounded-lg shadow-xl">
            <div class="py-2 rounded-lg lg:flex-row">
              <div class="flex flex-col w-full text-blueGray-500 lg:ml-4">
                <h2 class="mt-4 mb-2 text-xs font-semibold tracking-widest text-black uppercase lg:mt-0 title-font">
                  Date: {{ item.date }}
                </h2>
                <h2 class="mb-2 text-xs font-semibold tracking-widest text-black uppercase lg:mt-0 title-font">
                  Title: {{ item.title }}
                </h2>
                <p class="mb-1 text-base leading-relaxed text-blueGray-500">Post: {{ item.description }}</p>
                <p class="mb-3 text-base leading-relaxed text-blueGray-500">Price: {{ item.price }}</p>
                <p class="mb-3 text-base leading-relaxed text-blueGray-500">Unique Hash: {{ item.hash }}</p>
                <a :href="item.url" class="text-blue-500">view post</a>
                <button
                  @click.prevent="buyNFT(item)"
                  class="
                    px-16
                    py-2
                    my-2
                    mx-auto
                    text-base
                    font-medium
                    text-white
                    transition
                    duration-500
                    ease-in-out
                    transform
                    border-black
                    rounded-md
                    bg-black
                    focus:shadow-outline focus:outline-none focus:ring-2
                    ring-offset-current ring-offset-2
                    hover:bg-blueGray-900
                  "
                >
                  Buy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h1>MY CREATED ITEM</h1>
      <!-- <div class="flex flex-wrap mb-8 text-left"> -->
        <div v-for="(item, i) in itemCreated" :key="i" class="items-center px-5 py-12 lg:px-20">
          <div class="p-6 mx-auto bg-white border rounded-lg shadow-xl lg:w-1/2">
            <div class="flex flex-col items-start py-2 rounded-lg lg:flex-row">
              <div class="flex flex-col w-full text-blueGray-500 lg:ml-4">
                <h2 class="mt-4 mb-8 text-xs font-semibold tracking-widest text-black uppercase lg:mt-0 title-font">
                  {{ item.title }}
                </h2>
                <p class="mb-3 text-base leading-relaxed text-blueGray-500">
                  {{ item.description }}
                </p>
                <p class="mb-3 text-base leading-relaxed text-blueGray-500">Price: {{ item.price }}</p>
                <a :href="item.url" class="text-blue-500">view post</a>
                <!-- <button
                  @click.prevent="buyNFT(item)"
                  class="w-full px-16 py-2 my-2 text-base font-medium text-white transition duration-500 ease-in-out transform border-black rounded-md bg-black focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2 hover:bg-blueGray-900 "
                >
                  Buy
                </button> -->
              </div>
            </div>
          </div>
        </div>
      <!-- </div> -->
      <h1>MY COLLECTIBLE</h1>
      <div v-for="(item, i) in itemPurchased" :key="i" class="items-center px-5 py-12 lg:px-20">
        <div class="p-6 mx-auto bg-white border rounded-lg shadow-xl lg:w-1/2">
          <div class="flex flex-col items-start py-2 rounded-lg lg:flex-row">
            <div class="flex flex-col w-full text-blueGray-500 lg:ml-4">
              <h2 class="mt-4 mb-8 text-xs font-semibold tracking-widest text-black uppercase lg:mt-0 title-font">
                {{ item.title }}
              </h2>
              <p class="mb-3 text-base leading-relaxed text-blueGray-500">
                {{ item.description }}
              </p>
              <p class="mb-3 text-base leading-relaxed text-blueGray-500">Price: {{ item.price }}</p>
              <a :href="item.url" class="text-blue-500">view post</a>
              <!-- <button
                  @click.prevent="buyNFT(item)"
                  class="w-full px-16 py-2 my-2 text-base font-medium text-white transition duration-500 ease-in-out transform border-black rounded-md bg-black focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2 hover:bg-blueGray-900 "
                >
                  Buy
                </button> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import NFT from '../../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../artifacts/contracts/Market.sol/NFTMarket.json'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
// import { create } from "ipfs-http-client";
// import Nav from "../components/Nav.vue";
import { nftContract, storeContract } from '../config'

export default {
  name: 'Store',
  data() {
    return {
      items: [],
      itemCreated: [],
      itemPurchased: [],
    }
  },
  created() {
    this.loadNFT()
    this.createdItem()
    this.collectible()
  },
  methods: {
    async loadNFT() {
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()

      const marketContract = new ethers.Contract(storeContract, Market.abi, signer)
      const tokenContract = new ethers.Contract(nftContract, NFT.abi, provider)
      const data = await marketContract.fetchMarketItems()

      const items = await Promise.all(
        data.map(async (i) => {
          let tokenUri = await tokenContract.uri(i.tokenId)
          tokenUri = tokenUri.replace('{id}', i.tokenId)
          const meta = await axios.get(tokenUri)
          console.log(meta.data)
          let price = ethers.utils.formatUnits(i.price.toString())
          let item = {
            price,
            title: meta.data.title,
            description: meta.data.description,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            sold: i.sold,
            hash: meta.data.hash,
            date: new Date(meta.data.createdAt).toUTCString(),
            url: meta.data.url,
          }
          this.items.push(item)
        })
      )
      console.log(this.items)
    },
    async buyNFT(nft) {
      // const {
      //   data: { user },
      // } = JSON.parse(localStorage.getItem('credentail'))
      // if(user.publicAddress === nft.seller) {
      //   alert("You are the seller! You can't buy it!")
      //   return
      // }
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(storeContract, Market.abi, signer)
      let price = ethers.utils.parseUnits(nft.price, 'ether')
      const transaction = await contract.createMarketSale(nftContract, nft.tokenId, {
        value: price,
      })
      await transaction.wait()
    },
    async createdItem() {
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()

      const marketContract = new ethers.Contract(storeContract, Market.abi, signer)
      const tokenContract = new ethers.Contract(nftContract, NFT.abi, provider)
      const data = await marketContract.fetchItemsCreated()

      const items = await Promise.all(
        data.map(async (i) => {
          let tokenUri = await tokenContract.uri(i.tokenId)
          tokenUri = tokenUri.replace('{id}', i.tokenId)
          console.log(i.tokenId)
          console.log(tokenUri)
          const meta = await axios.get(tokenUri)
          let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
          let item = {
            price,
            name: meta.data.name,
            description: meta.data.description,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            sold: i.sold,
            image: meta.data.image,
          }
          this.itemCreated.push(item)
        })
      )
      console.log(items)
    },
    async collectible() {
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()

      const marketContract = new ethers.Contract(storeContract, Market.abi, signer)
      const tokenContract = new ethers.Contract(nftContract, NFT.abi, provider)
      const data = await marketContract.fetchMyNFTs()

      const items = await Promise.all(
        data.map(async (i) => {
          let tokenUri = await tokenContract.uri(i.tokenId)
          tokenUri = tokenUri.replace('{id}', i.tokenId)
          console.log(tokenUri)
          const meta = await axios.get(tokenUri)
          let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
          let item = {
            price,
            name: meta.data.name,
            description: meta.data.description,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            sold: i.sold,
            image: meta.data.image,
          }
          this.itemPurchased.push(item)
        })
      )
      console.log(items)
    },
  },
}
</script>

<style scoped></style>
