import Vue from 'vue'
import axios from 'axios'
// eslint-disable-next-line
import { default as Adal, AuthenticationContext } from 'vue-adal'
import App from './App.vue'
import router from './router'
import VueToastr from 'vue-toastr'

import Loading from 'vue-loading-overlay'
// eslint-disable-next-line
import 'vue-loading-overlay/dist/vue-loading.css'

import { importCustomCss } from './tenant'

Vue.use(Loading)
Vue.use(VueToastr, {})

Vue.config.productionTip = false
const clientId = '026d3962-dfa5-4720-a65f-2c62d1edd4a8'

Vue.use(Adal, {
  config: {
    tenant: 'ea47001a-3428-40f3-8ea1-86bdb1a3bc84',
    clientId: clientId,
    redirectUri: location.href,
    cacheLocation: 'localStorage'
  },
  requireAuthOnInitialize: true,
  router: router
})

axios.interceptors.request.use(
  async (config) => {
    const token = AuthenticationContext.adalContext.getCachedToken(clientId)
    // eslint-disable-next-line
    config.headers.Authorization = `Bearer ${token}`;
    return config
  },
  (err) => {
    if (err.response.status === 401 || err.response.status === 403) {
      AuthenticationContext.acquireTokenRedirect(clientId)
    }
  }
)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

importCustomCss()
