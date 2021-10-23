<template>
  <div>
    <PostComponent v-for="(post, i) in posts" :key="i" :post="post" />
  </div>
</template>

<script>
import PostComponent from '../components/PostComponent.vue'
import { mapState } from 'vuex'

export default {
  name: 'Home',
  components: {
    PostComponent,
  },
  data() {
    return {}
  },
  computed: {
    ...mapState(['posts']),
  },
  created() {},
  methods: {
    // async loadAllPost() {
    //   const {
    //     data: {
    //       data: { posts },
    //     },
    //   } = await Auth.getAllPost()
    //   this.posts = posts
    //   console.log(this.posts)
    // },
  },
}
</script>
