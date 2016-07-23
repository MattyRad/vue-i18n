import Vue from 'vue'
import Main from '../../src/main'

Vue.use(Main, {
  'es': {
    'Hello': 'Hola',
    'Goodbye': 'Adiós',
    'You have used {count} out of {limit}': 'Ha utilizado {count} de los {limit}',
    'Thanks for signing up! Confirm |{email} is correct| to continue to the site': 'Gracias por registrarte! Confirmar |{email} es correcta| para continuar al sitio'
  },
  'fr': {
    'Hello': 'Bonjour',
    'Goodbye': 'Au Revoir',
    'You have used {count} out of {limit}': 'Vous avez utilisé {count} sur {limit}'
  },
  'fr_CA': {
    'Hello': 'Bonjour, du Canada'
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
  })

  it('will use the dialect translations, and fall back to base translations when not specified', () => {
    let vm = new Vue

    vm.$root.locale = 'fr_CA'
    expect(vm.$t('Hello')).toBe('Bonjour, du Canada')
    expect(vm.$t('Goodbye')).toBe('Au Revoir')
  })

  it('will replace vars supplied as a second param', () => {
    let vm = new Vue

    let count = 10, limit = 100

    expect(vm.$t('You have used {count} out of {limit}')).toBe('You have used {count} out of {limit}')

    expect(vm.$t('You have used {count} out of {limit}', {count, limit})).toBe('You have used 10 out of 100')

    vm.$root.locale = 'es'
    expect(vm.$t('You have used {count} out of {limit}')).toBe('Ha utilizado {count} de los {limit}')
    expect(vm.$t('You have used {count} out of {limit}', {count, limit})).toBe('Ha utilizado 10 de los 100')

    vm.$root.locale = 'fr'
    expect(vm.$t('You have used {count} out of {limit}')).toBe('Vous avez utilisé {count} sur {limit}')
    expect(vm.$t('You have used {count} out of {limit}', {count, limit})).toBe('Vous avez utilisé 10 sur 100')

    vm.$root.locale = 'fr_CA'
    expect(vm.$t('You have used {count} out of {limit}')).toBe('Vous avez utilisé {count} sur {limit}')
    expect(vm.$t('You have used {count} out of {limit}', {count, limit})).toBe('Vous avez utilisé 10 sur 100')
  })


  it('will use the v-trans directive to translate an HTML element\'s children', () => {
    let vm = new Vue({
      template: '<div v-trans="$root.locale" key="Thanks for signing up! Confirm |{email} is correct| to continue to the site" :replace="{ email: email }"><span id="part1">Please perform </span><a id="part2" href="#">this {value} action</a><span id="part3"> to complete the thing</span></div>',
      data: function () {
        return {
          email: 'asdf@example.com',
          locale: 'es'
        }
      }
    }).$mount()

    /*expect(vm.$el.querySelector('#part1').textContent).toBe('Thanks for signing up! Confirm ')
    expect(vm.$el.querySelector('#part2').textContent).toBe('asdf@example.com is correct')
    expect(vm.$el.querySelector('#part3').textContent).toBe(' to continue to the site')*/

    expect(vm.$el.querySelector('#part1').textContent).toBe('Gracias por registrarte! Confirmar ')
    expect(vm.$el.querySelector('#part2').textContent).toBe('asdf@example.com es correcta')
    expect(vm.$el.querySelector('#part3').textContent).toBe(' para continuar al sitio')
  })

  it('will use the v-trans directive to translate an HTML element\'s children2', () => {
    let vm = new Vue({
      template: '<div v-trans="$root.locale" key="Thanks for signing up! Confirm |{email} is correct| to continue to the site" :replace="{ email: email }"><span id="part1">Please perform </span><a id="part2" href="#">this {value} action</a><span id="part3"> to complete the thing</span></div>',
      data: function () {
        return {
          email: 'asdf@example.com',
          locale: 'en'
        }
      }
    }).$mount()

    expect(vm.$el.querySelector('#part1').textContent).toBe('Thanks for signing up! Confirm ')
    expect(vm.$el.querySelector('#part2').textContent).toBe('asdf@example.com is correct')
    expect(vm.$el.querySelector('#part3').textContent).toBe(' to continue to the site')
  })

})