import Vue from 'vue'
import Main from '../../src/main'

Vue.use(Main, {
  'es': {
    'Hello': 'Hola',
    'Goodbye': 'Adiós'
  },
  'fr': {
    'Hello': 'Bonjour',
    'Goodbye': 'Au Revoir'
  },
  'fr_CA': {
    'Hello': 'Bonjour, du Canada'
  },
  'pirate': {
    'Hello': 'Ahoy',
    'Goodbye': 'Godspeed'
  }
})

describe('main.js', () => {

  it('will simply return the original string if no translation is found', () => {
    let vm = new Vue

    expect(vm.$t('Hello world')).toBe('Hello world')

    vm.$root.locale = 'DNE'
    expect(vm.$t('Hello world')).toBe('Hello world')
  })

  it('will return the translation', () => {
    let vm = new Vue

    vm.$root.locale = 'es'
    expect(vm.$t('Hello')).toBe('Hola')
    expect(vm.$t('Goodbye')).toBe('Adiós')

    vm.$root.locale = 'fr'
    expect(vm.$t('Hello')).toBe('Bonjour')
    expect(vm.$t('Goodbye')).toBe('Au Revoir')

    vm.$root.locale = 'pirate'
    expect(vm.$t('Hello')).toBe('Ahoy')
    expect(vm.$t('Goodbye')).toBe('Godspeed')
  })

  it('will use the dialect translations, and fall back to base translations when not specified', () => {
    let vm = new Vue

    vm.$root.locale = 'fr_CA'
    expect(vm.$t('Hello')).toBe('Bonjour, du Canada')
    expect(vm.$t('Goodbye')).toBe('Au Revoir')
  })

})