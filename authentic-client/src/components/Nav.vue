<template>
  <div class="full-width items-center">
    <div
      class="text-blueGray-700 transition duration-500 ease-in-out transform bg-white border rounded-lg"
    >
      <div
        class="flex flex-col flex-wrap p-5 mx-auto md:items-center md:flex-row"
      >
        <a class="pr-2 lg:pr-8 lg:px-6 focus:outline-none" href="/">
          <div class="inline-flex items-center">
            <div
              class="w-2 h-2 p-2 mr-2 rounded-full bg-gradient-to-tr from-blue-500 to-blue-600"
            ></div>
            <h2
              class="block p-2 text-xl font-medium tracking-tighter text-black transition duration-500 ease-in-out transform cursor-pointer hover:text-blueGray-500 lg:text-x lg:mr-8"
            >
              Authentic Fact
            </h2>
          </div>
        </a>
        <nav
          class="flex flex-wrap items-center justify-center text-base md:ml-auto md:mr-auto"
        >
          <ul class="items-center inline-block list-none lg:inline-flex">
            <li>
              <a
                class="px-4 py-1 mr-1 text-base text-blueGray-500 transition duration-500 ease-in-out transform rounded-md ring-offset-current ring-offset-2 focus:shadow-outline focus:outline-none focus:ring-2 hover:text-black"
                href="/"
                >Home</a
              >
            </li>
            <li>
              <a
                class="px-4 py-1 mr-1 text-base text-blueGray-500 transition duration-500 ease-in-out transform rounded-md ring-offset-current ring-offset-2 focus:shadow-outline focus:outline-none focus:ring-2 hover:text-black"
                href="/dashboard"
                >Dashboard</a
              >
            </li>
            <li>
              <a
                class="px-4 py-1 mr-1 text-base text-blueGray-500 transition duration-500 ease-in-out transform rounded-md ring-offset-current ring-offset-2 focus:shadow-outline focus:outline-none focus:ring-2 hover:text-black"
                href="/store"
                >Store</a
              >
            </li>
            <li>
              <a
                class="px-4 py-1 mr-1 text-base text-blueGray-500 transition duration-500 ease-in-out transform rounded-md ring-offset-current ring-offset-2 focus:shadow-outline focus:outline-none focus:ring-2 hover:text-black"
                href="#"
                >Overview</a
              >
            </li>
          </ul>
        </nav>
        <button
        @click="logout"
          class="w-auto px-8 py-2 my-2 text-base font-medium text-white transition duration-500 ease-in-out transform bg-blue-600 border-blue-600 rounded-md ring-offset-current ring-offset-2 focus:shadow-outline focus:outline-none focus:ring-2 hover:b-gblue-700"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default ({
  name: 'Nav',
  methods: {
    logout() {
      localStorage.clear()
      this.$router.push({name: 'Login'})
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
