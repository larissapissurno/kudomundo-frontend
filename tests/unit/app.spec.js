import { shallowMount, createLocalVue } from '@vue/test-utils'
import App from '@/App.vue'
import VueRouter from 'vue-router'

const localVue = createLocalVue()
localVue.use(VueRouter)
const router = new VueRouter()

describe('App.vue', () => {
  it('renders app', () => {
    const $adal = {
      isAuthenticated() {
        return true
      }
    }

    const wrapper = shallowMount(App, {
      localVue,
      router,      
      mocks: {
        $adal,
      }
    })
    expect(wrapper.find('header')).toBeTruthy()
  })
})
