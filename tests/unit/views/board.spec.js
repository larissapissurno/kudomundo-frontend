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

  beforeEach(() => {
    const resp = { data }
    axios.get.mockResolvedValue(resp)

    global.fetch = () => Promise.resolve([])
    global.alert = (message) => null

    wrapper = shallowMount(Component, {
      localVue,
      router
    })
  })

  it('renders component when axios get', async () => {
    expect(wrapper.text()).toBeTruthy()
    await flushPromises()
    expect(wrapper.vm.$data.cards.length).toBe(2)
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
    global.fetch = () => Promise.resolve({ status: 200, json: () => [{ name: '1' }, { name: '2' }] })

    wrapper.vm.loadMemes()
    await flushPromises()
    expect(wrapper.vm.$data.memes.length).toBe(2)
  })

  it('should be log when loadboard fail', async () => {
    global.console = {
      log: jest.fn()
    }

    axios.get.mockImplementation(() => Promise.reject(Error('teste')))

    wrapper.vm.loadBoard()
    await flushPromises()
    expect(global.console.log).toBeCalled()
  })
})
