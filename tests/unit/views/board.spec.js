import { shallowMount, createLocalVue } from '@vue/test-utils'
import axios from 'axios'
import flushPromises from 'flush-promises'
import Component from '@/views/Board.vue'
import VueRouter from 'vue-router'
import Loading from 'vue-loading-overlay'

jest.mock('axios')

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(Loading)
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

describe('Board.vue', () => {
  let wrapper
  let errorMessage

  beforeEach(() => {
    const resp = { data }
    axios.get.mockImplementation((uri) => {
      if (uri === 'http://localhost:3000/board/bebulls?period=week') {
        return Promise.resolve(resp)
      }
      return Promise.reject(Error('uri nao existe'))
    })

    global.fetch = (uri) => {
      if (uri === 'private/bebulls/memes.json') {
        return Promise.resolve({ status: 404 })
      } else {
        return Promise.reject(Error('uri nao existe'))
      }
    }

    global.alert = (message) => { errorMessage = message }

    wrapper = shallowMount(Component, {
      localVue,
      router
    })
  })

  it('renders component when axios get', async () => {
    expect(wrapper.name()).toBe('Board')
    expect(wrapper.text()).toBeTruthy()
    await flushPromises()
    expect(wrapper.vm.$data.cards.length).toBe(2)
    expect(errorMessage).toBe('Time não configurado, verifique com seu time ou fale com seu gestor.')
  })

  it('should not be reload when same period', () => {
    wrapper.vm.loadBoard = jest.fn()
    wrapper.vm.setPeriod('week')
    expect(wrapper.vm.loadBoard).toHaveBeenCalledTimes(0)
  })

  it('should be reload call when set other period', () => {
    wrapper.vm.loadBoard = jest.fn()
    wrapper.vm.setPeriod('month')
    expect(wrapper.vm.loadBoard).toHaveBeenCalledTimes(1)
  })

  it('should be load memes', async () => {
    global.fetch = (uri) => {
      if (uri === 'private/bebulls/memes.json') {
        return Promise.resolve({ status: 200, json: () => [{ name: '1' }, { name: '2' }] })
      }
    }

    wrapper.vm.loadMemes()
    await flushPromises()
    expect(wrapper.vm.$data.memes.length).toBe(2)
  })

  it('should be log when loadboard fail', async () => {
    global.console = {
      log: jest.fn()
    }

    axios.get.mockImplementation((uri) => {
      if (uri === 'http://localhost:3000/board/bebulls?period=week') {
        return Promise.reject(Error('teste'))
      }
    })

    wrapper.vm.loadBoard()
    await flushPromises()
    expect(global.console.log).toBeCalled()
  })

  it('should find color of meme', async () => {
    global.fetch = (uri) => {
      if (uri === 'private/bebulls/memes.json') {
        return Promise.resolve({ status: 200,
          json: () =>
            [{
              title: 'Meme 1',
              image: 'meme1.png',
              color: 'color-1'
            },
            {
              title: 'Meme 2',
              image: 'meme2.png',
              color: 'color-2'
            }]
        })
      }
    }

    wrapper.vm.loadMemes()
    await flushPromises()
    expect(wrapper.vm.getColor('meme1.png')).toBe('color-1')
    expect(wrapper.vm.getColor('meme2.png')).toBe('color-2')
  })
})
