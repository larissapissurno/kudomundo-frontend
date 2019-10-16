import { shallowMount } from '@vue/test-utils'
import Component from '@/components/Header.vue'

describe('Header.vue', () => {
  it('renders Header', () => {
    const wrapper = shallowMount(Component)
    expect(wrapper.text()).toBeTruthy()
    expect(wrapper.find('nav')).toBeTruthy()
  })
})
