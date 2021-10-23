<template>
  <section class="text-blueGray-700">
    <div class="container items-center px-5 py-12 lg:px-20">
      <div
        class="
          flex flex-col
          w-full
          p-10
          mx-auto
          my-6
          transition
          duration-500
          ease-in-out
          transform
          bg-white
          border
          rounded-lg
          lg:w-2/6
          md:w-1/2 md:mt-0
        "
      >
        <div class="inline-flex flex-wrap items-center justify-between">
          <button
            @click.prevent="login"
            class="
              w-full
              px-4
              py-2
              my-2
              text-base
              font-medium
              text-white
              transition
              duration-500
              ease-in-out
              transform
              bg-blue-600
              border-blue-600
              rounded-md
              focus:shadow-outline focus:outline-none focus:ring-2
              ring-offset-current ring-offset-2
              hover:bg-blue-800
            "
          >
            Login with your wallet
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import Web3 from 'web3'
import Auth from '../service/Auth'

export default {
  name: 'Home',
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
    }
  },
  components: {},
  methods: {
    login() {
      this.$store.dispatch('login', { email: this.form.email, password: this.form.password })
    },
  },
}
</script>
