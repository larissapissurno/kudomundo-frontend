import Vue from 'vue'
import axios from 'axios'
// eslint-disable-next-line
import { default as Adal, AxiosAuthHttp } from 'vue-adal'
import App from './App.vue'
import router from './router'

import { importCustomCss } from './tenant'

Vue.config.productionTip = false
const graphApiBase = `https://graph.windows.net`
const graphApiResource = '00000002-0000-0000-c000-000000000000'

Vue.use(Adal, {
  config: {
    tenant: 'ea47001a-3428-40f3-8ea1-86bdb1a3bc84',
    clientId: '026d3962-dfa5-4720-a65f-2c62d1edd4a8',
    redirectUri: location.href,
    cacheLocation: 'localStorage'
  },
  requireAuthOnInitialize: true,
  router: router
})

Vue.use({
  install (vue, opts = {}) {
    vue.prototype.$graphApi = AxiosAuthHttp.createNewClient({
      axios: axios,
      resourceId: graphApiResource,
      router: router,
      baseUrl: graphApiBase,

      onTokenSuccess (http, context, token) {
        if (context.user) {
          http.defaults.baseURL = `${graphApiBase}/${context.user.profile.tid}`
        }
      },

      onTokenFailure (error) {
        console.log(error)
      }
    })
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

importCustomCss()
