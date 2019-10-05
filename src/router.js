import Vue from 'vue'
import Router from 'vue-router'
import Board from '@/views/Board.vue'
import Register from './views/Register.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'board',
      component: Board,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: {
        requireAuth: true
        // requireRoles: [
        //   'TheMan',
        //   'Admin'
        // ]
      }
    }
  ]
})
