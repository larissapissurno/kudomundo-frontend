import { shallowMount } from '@vue/test-utils'
import HelloWorld from '@/components/Card.vue'

describe('Card.vue', () => {
  it('renders card object when passed', () => {
    const wrapper = shallowMount(HelloWorld, {
      propsData: {
        card: {
          title: 'teste',
          member: 'fulano',
          description: 'top demais'
        }
      }
    })
    expect(wrapper.name()).toBe('Card')
    expect(wrapper.text()).toBeTruthy()
    expect(wrapper.vm.$data.team).toBe('bebulls')
  })
})
