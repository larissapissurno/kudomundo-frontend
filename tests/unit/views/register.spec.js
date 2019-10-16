import { shallowMount, createLocalVue, config } from '@vue/test-utils'
import axios from 'axios';
import flushPromises from 'flush-promises'
import Component from '@/views/Register.vue'
import VueRouter from 'vue-router'
import VueToastr from 'vue-toastr'

jest.mock('axios');

describe('Register.vue', () => {
  const $adal = {
    user: { profile: { unique_name: 'teste' } }
  }

  const localVue = createLocalVue()
  localVue.use(VueRouter)
  localVue.use(VueToastr)
  const router = new VueRouter()

  const data = [{
    title: 'teste01',
    member: 'membro card 01',
    description: 'teste',
    timestamp: 1571172957
  },
  {
    title: 'teste02',
    member: 'membro card 02',
    description: 'teste',
    timestamp: 1571173278
  }]

  beforeEach(() => {
    global.console = {
      log() {}
    }
    
    global.fetch = (uri) => {
      let data = []
      if (uri === 'private/bebulls/members.json') {
        data = [{ 
          name: 'John Smith',
          email: 'john@db1.com.br'
        }]
      } else if (uri === 'private/bebulls/memes.json') {
        data = [{ 
          title: 'Passando pra dizer:',
          image: 'passando_pra_dizer.png',
          color: 'color-2'
        }]
      }

      return Promise.resolve({
        status: 200,
        json: () => data
      })
    }

  })

  it('renders component when fetch members', async() => {
    const wrapper = shallowMount(Component, { 
      localVue,
      router,
      mocks: { $adal }
    })

    expect(wrapper.text()).toBeTruthy()
    await flushPromises()
    expect(wrapper.vm.$data.memes.length).toBe(1)
    expect(wrapper.vm.$data.members.length).toBe(1)
  })

  it('should be aba 1 when aba===1 goTo 3', async() => {
    const wrapper = shallowMount(Component, { 
      localVue,
      router,
      mocks: { $adal }
    })

    await flushPromises()
    wrapper.vm.goTo(3)
    expect(wrapper.vm.$data.aba).toBe(1)
  })

  it('should be aba 1 when aba===3 goTo 1', async() => {
    const wrapper = shallowMount(Component, { 
      localVue,
      router,
      mocks: { $adal }
    })

    wrapper.vm.$data.aba = 3
    await flushPromises()
    wrapper.vm.goTo(1)
    expect(wrapper.vm.$data.aba).toBe(1)
  })

  it('should be post card', async() => {
    const resp = { };
    axios.post.mockResolvedValue(resp);

    const wrapper = shallowMount(Component, { 
      localVue,
      router,
      mocks: { $adal }
    })
    const spy = jest.spyOn(wrapper.vm.$toastr, 's');
    wrapper.vm.$router.push = jest.fn()

    await flushPromises()
    wrapper.vm.setMember({ name: 'john' })
    expect(wrapper.vm.$data.aba).toBe(2)
    expect(wrapper.vm.$data.member).toBe('john')

    wrapper.vm.setMeme({ 
      title: 'Passando pra dizer:',
      image: 'passando_pra_dizer.png',
      color: 'color-2'
    })
    expect(wrapper.vm.$data.aba).toBe(3)
    expect(wrapper.vm.$data.meme.color).toBe('color-2')

    wrapper.vm.preview()
    expect(wrapper.vm.$data.aba).toBe(4)

    wrapper.vm.confirm()
    await flushPromises()

    expect(spy).toBeCalled()
  })

  it('should be show error when post failed', async() => {
    axios.post.mockImplementation(() => Promise.reject(undefined));

    const wrapper = shallowMount(Component, { 
      localVue,
      router,
      mocks: { $adal }
    })
    const spy = jest.spyOn(wrapper.vm.$toastr, 'e');
    wrapper.vm.getCard = jest.fn(() => {})

    await flushPromises()
    wrapper.vm.confirm()
    await flushPromises()

    expect(spy).toBeCalled()
  })

  it('should change route when fetch fail', async() => {
    global.fetch = (uri) => Promise.reject(undefined);

    const wrapper = shallowMount(Component, { 
      localVue,
      router,
      mocks: { $adal }
    })
    wrapper.vm.$router.push = jest.fn()
    
    await flushPromises()

    expect(wrapper.vm.$router.push).toBeCalled()
  })

})
