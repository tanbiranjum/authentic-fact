<template>
  <div class="items-center px-5 py-12 lg:px-20">
    <form
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
      <section class="flex flex-col w-full h-full p-1 overflow-auto">
        <header
          class="
            flex flex-col
            items-center
            justify-center
            py-12
            text-base text-blueGray-500
            transition
            duration-500
            ease-in-out
            transform
            bg-white
            border border-dashed
            rounded-lg
            ring-offset-current ring-offset-2
            focus:border-blue-500
            focus:outline-none
            focus:shadow-outline
            focus:ring-2
          "
        >
          <p
            class="
              flex flex-wrap
              justify-center
              mb-3
              text-base
              leading-7
              text-blueGray-500
            "
          ></p>
          <button
            @click.stop.prevent="clickToUpload"
            class="
              upload-btn
              w-auto
              px-2
              py-1
              my-2
              mr-2
              text-blueGray-500
              transition
              duration-500
              ease-in-out
              transform
              border
              rounded-md
              text-md
              ring-offset-current ring-offset-2
              hover:text-blueGray-600
              focus:shadow-outline
              focus:outline-none
              focus:ring-2
              hover:bg-blueGray-100
            "
          >
            Upload a file
          </button>
        </header>
      </section>
      <div class="relative pt-4">
        <input
          @change="fileChange"
          ref="fileInput"
          class="input-file"
          type="file"
          name=""
          style="display: none"
        /><label
          class="input-title text-base leading-7 text-blueGray-500"
          for="name"
          >Title</label
        ><input
          v-model="form.name"
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
            focus:border-blueGray-500
            focus:bg-white
            focus:outline-none
            focus:shadow-outline
            focus:ring-2
            border-2
          "
          type="text"
          name="title"
          placeholder="title"
        />
      </div>
      <div class="relative mt-4">
        <label class="text-base leading-7 text-blueGray-500" for="price"
          >Price</label
        ><input
          v-model="form.price"
          class="
            input-price
            w-full
            px-4
            py-2
            mt-2
            text-base text-black
            transition
            duration-500
            ease-in-out
            transform
            rounded-lg
            bg-blueGray-100
            ring-offset-current ring-offset-2
            focus:border-blueGray-500
            focus:bg-white
            focus:outline-none
            focus:shadow-outline
            focus:ring-2
            border-2
          "
          type="number"
          name="price"
          placeholder="price"
        />
      </div>
      <div class="flex flex-wrap mt-4 mb-6 -mx-3">
        <div class="w-full px-3">
          <label
            class="text-base leading-7 text-blueGray-500"
            for="description"
          >
            Description </label
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
              focus:border-blue-500
              focus:outline-none
              focus:shadow-outline
              focus:ring-2
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
          focus:shadow-outline
          focus:outline-none
          focus:ring-2
          hover:bg-blue-800
        "
      >
        Mint
      </button>
    </form>
  </div>
</template>

<script>
import NFT from "../../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../../artifacts/contracts/Market.sol/NFTMarket.json";
import axios from "axios";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { create } from "ipfs-http-client";
// import Nav from "../components/Nav.vue";
import { nftContract, storeContract } from "../config";

export default {
  name: "CreateNFT",
  components: {
    // Nav,
  },
  data() {
    return {
      form: {
        name: "",
        description: "",
        price: 0,
        url: window.location
      },
      url: "",
      metadata: null,
    };
  },
  methods: {
    clickToUpload() {
      const btn = document.querySelector(".upload-btn");
      const file = document.querySelector(".input-file");
      if (btn) {
        btn.addEventListener("click", () => {
          file.click();
        });
      }
    },
    // MINT NFT
    // CREATE A SALE FOR THIS NFT
    async createNFT() {
      const { name, description } = this.form;
      const client = create({
        url: "https://ipfs.infura.io:5001/api/v0",
      });
      const data = JSON.stringify({
        name,
        description,
        image: this.url,
      });
      const { path } = await client.add(data);
      this.url = `https://ipfs.io/ipfs/${path}`;
      //create NFT
      const web3modal = new Web3Modal();
      //Connect to the metamask
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      let contract = new ethers.Contract(nftContract, NFT.abi, signer);
      let transaction = await contract.createToken(this.url);
      let tx = await transaction.wait();
      let event = tx.events[0];
      let value = event.args[2];
      let tokenId = value.toNumber();
      alert(tokenId);

      //make this nft listed for market
      contract = new ethers.Contract(storeContract, Market.abi, signer);
      let listingPrice = await contract.getListingPrice();
      listingPrice = listingPrice.toString();
      transaction = await contract.createMarketItem(
        nftContract,
        tokenId,
        this.form.price,
        { value: listingPrice }
      );
      await transaction.wait();
    },
    // GRAB ALL NFT OWNED BY USER
    async loadNFT() {
      const web3modal = new Web3Modal({
        network: "local",
        cacheProvider: true,
      });
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const marketContract = new ethers.Contract(
        storeContract,
        Market.abi,
        signer
      );
      const tokenContract = new ethers.Contract(nftContract, NFT.abi, provider);
      const data = await marketContract.fetchMarketItems();
      const items = await Promise.all(
        data.map(async (i) => {
          const tokenUri = await tokenContract.tokenURI(i.tokenId);
          const meta = await axios.get(tokenUri);
          let price = ethers.utils.formatUnits(i.price.toString(), "ether");
          let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image,
          };
          return item;
        })
      );
      console.log(items);
    },
    // GRAB FILE AND UPLOAD TO IPFS
    // THEN SAVE THE URL
    async fileChange(e) {
      if (window.confirm("Do u want to upload this image?")) {
        const client = create({
          url: "https://ipfs.infura.io:5001/api/v0",
        });
        let files = e.target.files || e.dataTransfer.files;
        const { path } = await client.add(files[0]);
        this.url = `https://ipfs.io/ipfs/${path}`;
        alert(`uploaded to ${this.url}`);
      } else {
        alert("Try again");
      }
    },
  },
};
</script>
