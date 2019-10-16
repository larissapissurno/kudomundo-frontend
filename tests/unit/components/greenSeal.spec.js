import { shallowMount } from '@vue/test-utils'
import axios from 'axios'
import flushPromises from 'flush-promises'
import Component from '@/components/GreenSeal.vue'

jest.mock('axios')

describe('GreenSeal.vue', () => {
  beforeEach(() => {
    global.console = {
      log () {}
    }
  })
  it('renders component when axios get', async () => {
    const data = { papers: 300 }
    const resp = { data }
    axios.get.mockResolvedValue(resp)

    const wrapper = shallowMount(Component, {})
    expect(wrapper.text()).toBeTruthy()
    await flushPromises()
    expect(wrapper.text()).toContain('300 folhas A4 preservadas')
  })
  it('renders component when axios failed', async () => {
    axios.get.mockImplementation(() => Promise.reject(Error('teste')))

    const wrapper = shallowMount(Component, {})
    expect(wrapper.text()).toBeTruthy()
    await flushPromises()
    expect(wrapper.text()).toContain('0 folhas A4 preservadas')
  })
})
