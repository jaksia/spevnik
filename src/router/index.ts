import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import Landing from '../views/Landing.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/song/:id',
    name: 'Home',
    component: Home
  },
  {
    path: '/home',
    name: 'Landing',
    component: Landing
  },
  {
    path: '/requests',
    name: 'ChangeRequests',
    component: () => import('../views/ChangeRequests.vue')
  },
  {
    path: '/',
    redirect: '/song/1'
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import(/* webpackChunkName: "settings" */ '../views/Settings.vue')
  },
  {
    path: '/edit/:id',
    name: 'Editor',
    component: () => import(/* webpackChunkName: "editor" */ '../views/Editor.vue')
  },
  {
    path: '/suggest/:id',
    name: 'SuggestionEditor',
    component: () => import(/* webpackChunkName: "editor" */ '../views/SuggestionEditor.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
