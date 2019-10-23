import { shallowMount } from '@vue/test-utils'
import axios from 'axios'
import flushPromises from 'flush-promises'
import Component from '@/components/GreenSeal.vue'

jest.mock('axios')

describe('GreenSeal.vue', () => {
  beforeEach(() => {
    global.console = {
      log: jest.fn()
    }
  })
  it('renders component when axios get', async () => {
    const data = { papers: 300 }
    const resp = { data }
    axios.get.mockImplementation((uri) => {
      if (uri === 'http://localhost:3000/sustainable') {
        return data;
      }
      throw Error('teste');
    })

    axios.get.mockResolvedValue(resp)
    const wrapper = shallowMount(Component, {})

    expect(wrapper.name()).toBe('GreenSeal')
    expect(wrapper.text()).toBeTruthy()

    await flushPromises()
    
    expect(wrapper.text()).toContain('300 folhas A4 preservadas')
  })
  it('renders component when axios failed', async () => {
    let message;
    global.console = {
      log: (error) => message = error
    }
    const expectedError = Error('teste')
    axios.get.mockImplementation((uri) => {
      if (uri === 'http://localhost:3000/sustainable') {
        return Promise.reject(expectedError)
      }
      
      return {};
    })

    const wrapper = shallowMount(Component, {})
    expect(wrapper.text()).toBeTruthy()
    await flushPromises()
    expect(wrapper.text()).toContain('0 folhas A4 preservadas')
    expect(message).toBe(expectedError)
  })
  it('should be console.log called when axios failed', async () => {
    const expectedError = Error('teste')
    axios.get.mockImplementation((uri) => {
      if (uri === 'http://localhost:3000/sustainable') {
        return Promise.reject(expectedError)
      }
      
      return {};
    })

    const wrapper = shallowMount(Component, {})
    expect(wrapper.text()).toBeTruthy()
    await flushPromises()
    expect(wrapper.text()).toContain('0 folhas A4 preservadas')
    expect(console.log).toBeCalledTimes(1)
  })  
})
