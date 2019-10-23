import { shallowMount } from '@vue/test-utils'
import Component from '@/components/Header.vue'
import { weekOfYear, year, startWeek, endWeek } from '@/tenant'    

describe('Header.vue', () => {
  it('renders Header', () => {
    const wrapper = shallowMount(Component)
    expect(wrapper.name()).toBe('Header')
    expect(wrapper.text()).toBeTruthy()
    
    expect(wrapper.find('nav')).toBeTruthy()
    
    expect(wrapper.vm.$data.weekOfYear).toBe(weekOfYear)
    expect(wrapper.vm.$data.year).toBe(year)
    expect(wrapper.vm.$data.startWeek).toBe(startWeek)
    expect(wrapper.vm.$data.endWeek).toBe(endWeek)
  })
})
