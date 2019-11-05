import { shallowMount, createLocalVue } from '@vue/test-utils'
import axios from 'axios'
import flushPromises from 'flush-promises'
import Component from '@/views/Register.vue'
import VueRouter from 'vue-router'
import VueToastr from 'vue-toastr'

jest.mock('axios')

describe('Register.vue', () => {
  const mount = () => {
    const $adal = {
      user: { profile: { unique_name: 'teste' } }
    }

    return shallowMount(Component, {
      localVue,
      router,
      mocks: { $adal }
    })
  }

  const titles = [
    'melhor um kudo na wall, do que dois voando',
    'pimenta no kudo dos outros, é refresco',
    'O que o coração não diz, o kudo não sente',
    'Mostre-me os seus Kudos, e te direi quem tu és.'
  ]

  const localVue = createLocalVue()
  localVue.use(VueRouter)
  localVue.use(VueToastr)
  const router = new VueRouter()

  beforeEach(() => {
    global.console = {
      log () {}
    }

    global.fetch = (uri) => {
      let data = []
      if (uri === 'private/bebulls/members.json') {
        data = [{
          name: 'John Smith',
          email: 'john@db1.com.br'
        }, {
          name: 'Teste',
          email: 'teste'
        }]
      } else if (uri === 'private/bebulls/memes.json') {
        data = [{
          title: 'Passando pra dizer:',
          image: 'passando_pra_dizer.png',
          color: 'color-2'
        }, {
          title: 'Meme intativo:',
          image: 'inativo.png',
          color: 'color-2',
          inactive: true
        }]
      }

      return Promise.resolve({
        status: 200,
        json: () => data
      })
    }
  })

  it('renders component when fetch members', async () => {
    const wrapper = mount()

    expect(wrapper.name()).toBe('Register')
    expect(wrapper.text()).toBeTruthy()
    await flushPromises()
    expect(wrapper.vm.$data.memes.length).toBe(2)
    expect(wrapper.vm.filteredMemes().length).toBe(1)
    expect(wrapper.vm.$data.members.length).toBe(2)
    expect(wrapper.vm.$data.description).toBe('')
    expect(wrapper.vm.$data.member).toBe('')
    expect(wrapper.vm.$data.titles).toEqual(titles)
    expect(wrapper.vm.filteredMemes()[0].inactive).toBeFalsy()
  })

  it('renders component when fetch members', async () => {
    const wrapper = mount()

    await flushPromises()
    expect(wrapper.vm.filteredMembers().length).toBe(1)
    expect(wrapper.vm.filteredMembers()[0].email !== 'teste').toBeTruthy()
  })

  it('should be aba 1 when aba===1 goTo 3', async () => {
    const wrapper = mount()

    await flushPromises()
    wrapper.vm.goTo(3)
    expect(wrapper.vm.$data.aba).toBe(1)
  })

  it('should be aba 1 when aba===3 goTo 1', async () => {
    const wrapper = mount()

    wrapper.vm.$data.aba = 3
    await flushPromises()
    wrapper.vm.goTo(1)
    expect(wrapper.vm.$data.aba).toBe(1)
  })

  it('should be not change when aba===3 goTo 3', async () => {
    const wrapper = mount()

    wrapper.vm.$data.aba = '3'
    await flushPromises()
    wrapper.vm.goTo(3)
    expect(wrapper.vm.$data.aba === '3').toBeTruthy()
  })

  it('should be post card', async () => {
    const expectedCard = {
      member: 'john',
      description: '',
      meme: 'passando_pra_dizer.png',
      title: 'Passando pra dizer:',
      author: 'teste'
    }
    const resp = { }
    axios.post.mockResolvedValue(resp)

    const wrapper = mount()
    const spy = jest.spyOn(wrapper.vm.$toastr, 's')
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

    expect(wrapper.vm.getCard()).toEqual(expectedCard)

    wrapper.vm.confirm()
    await flushPromises()

    expect(wrapper.vm.$router.push).toBeCalledWith('/')
    expect(spy).toBeCalledWith('Seu Kudo é Meu agora!', 'Ta salvo')
  })

  it('should be show error when post failed', async () => {
    axios.post.mockImplementation((uri) => {
      if (uri === 'http://localhost:3000/card/bebulls') {
        return Promise.reject(Error('teste'))
      }
      return Promise.resolve([])
    })

    const wrapper = mount()
    const spy = jest.spyOn(wrapper.vm.$toastr, 'e')
    wrapper.vm.getCard = jest.fn(() => {})

    await flushPromises()
    wrapper.vm.confirm()
    await flushPromises()

    expect(spy).toBeCalledWith('Vish, deu ruim')
  })

  it('should change route when fetch fail', async () => {
    global.fetch = (uri) => Promise.reject(Error('teste'))

    const wrapper = mount()
    wrapper.vm.$router.push = jest.fn()

    await flushPromises()

    expect(wrapper.vm.$router.push).toBeCalledWith('/')
  })

  it('should be "098f6bcd4621d373cade4e832627b4f6" when md5("test")', () => {
    const wrapper = mount()
    const expected = '098f6bcd4621d373cade4e832627b4f6'

    expect(wrapper.vm.md5('test')).toBe(expected)
  })
})
