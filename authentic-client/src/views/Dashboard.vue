<template>
  <div class="mb-4">
    <div class="w-full bg-gray-300 flex">
      <div class="w-1/3 p-3 border-2" v-for="(post, i) in nft" :key="i">
        <h4>Date: {{post.postId.date}}</h4>
        <p>
          {{post.postId.post}}
        </p>
        <label class="block">NFT Id: {{post.nftId}}</label>
        <label>Price</label>
        <input v-model="price" type="text" class="ml-2 border-2 border-black" />
        <button @click="createMarketListing(post.nftId)" class="block bg-blue-400 p-1 mt-2">Listed</button>
      </div>
    </div>
  </div>
</template>

<script>
import NFT from '../../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../artifacts/contracts/Market.sol/NFTMarket.json'
import Auth from '../service/Auth.js'
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import { storeContract, nftContract } from '../config'
export default {
  name: 'Store',
  data() {
    return {
      nft: [],
      price: 0
    }
  },
  methods: {
    async getAllNFT() {
      const {
        data: { user },
      } = JSON.parse(localStorage.getItem('credentail'))
      const { data } = await Auth.getNftByUser(user._id)
      if(data.status === 'success') {
        const {nft} = data
        this.nft = nft
      }
    },
    async createMarketListing(tokenId) {
      const web3modal = new Web3Modal();
      //Connect to the metamask
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      let contract = new ethers.Contract(storeContract, Market.abi, signer);
      let listingPrice = await contract.getListingPrice();
      listingPrice = listingPrice.toString();
      const parsedPrice = ethers.utils.parseUnits(this.price.toString(), 'ether')
      let transaction = await contract.createMarketItem(
        nftContract,
        tokenId,
        parsedPrice,
        { value: listingPrice }
      );
      await transaction.wait();
    }
  },
  created() {
    this.getAllNFT()
  },
}
</script>

<style scoped></style>
