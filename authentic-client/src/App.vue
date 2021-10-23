<template>
  <div>
    <Nav v-if="this.$route.name != 'Login'"></Nav>
    <router-view />
  </div>
</template>

<style></style>

<script>
import Nav from './components/Nav.vue'

export default {
  name: 'Home',
  components: {
    Nav,
  },
}
</script>
