import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Post from "../views/Post.vue";
import CreateNFT from "../views/CreateNFT.vue";
import Store from "../views/Store.vue";
import Dashboard from "../views/Dashboard.vue";
import Login from "../views/Login.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    beforeEnter: guardMyroute
  },
  {
    path: "/post/:id",
    name: "Post",
    component: Post,
    beforeEnter: guardMyroute
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/mint-nft",
    name: "NFT",
    component: CreateNFT,
    beforeEnter: guardMyroute
  },
  {
    path: "/store",
    name: "Store",
    component: Store,
    beforeEnter: guardMyroute
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    beforeEnter: guardMyroute
  },
];

function guardMyroute(to, from, next) {
  var isAuthenticated = false;
  if (localStorage.getItem("credentail")) isAuthenticated = true;
  else isAuthenticated = false;
  if (isAuthenticated) {
    next();
  } else {
    next("/login");
  }
}

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
