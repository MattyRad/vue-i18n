import Vue from 'vue'
import Main from '../../src/main'

const translations = {
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
  },
  'fr-CA': {
    'Hello': 'Bonjour, du Canada'
  }
}

Vue.use(Main, translations)

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

    vm.$root.locale = 'fr-CA'
    expect(vm.$t('Hello')).toBe('Bonjour, du Canada')
    expect(vm.$t('Goodbye')).toBe('Au Revoir')

    vm.$root.locale = 'fr_DNE'
    expect(vm.$t('Hello')).toBe('Bonjour')
    expect(vm.$t('Goodbye')).toBe('Au Revoir')
  })

  it('will use a specific locale if one is specified', () => {
    let vm = new Vue

    vm.$root.locale = 'es'
    expect(vm.$t('Hello', {locale: 'fr'})).toBe('Bonjour')
  })

  it('will replace vars supplied as a second param', () => {
    let vm = new Vue

    let count = 0, limit = 100

    expect(vm.$t('You have used {count} out of {limit}')).toBe('You have used {count} out of {limit}')

    expect(vm.$t('You have used {count} out of {limit}', {count, limit})).toBe('You have used 0 out of 100')

    vm.$root.locale = 'es'
    expect(vm.$t('You have used {count} out of {limit}')).toBe('Ha utilizado {count} de los {limit}')
    expect(vm.$t('You have used {count} out of {limit}', {count, limit})).toBe('Ha utilizado 0 de los 100')

    vm.$root.locale = 'fr'
    expect(vm.$t('You have used {count} out of {limit}')).toBe('Vous avez utilisé {count} sur {limit}')
    expect(vm.$t('You have used {count} out of {limit}', {count, limit})).toBe('Vous avez utilisé 0 sur 100')

    vm.$root.locale = 'fr_CA'
    expect(vm.$t('You have used {count} out of {limit}')).toBe('Vous avez utilisé {count} sur {limit}')
    expect(vm.$t('You have used {count} out of {limit}', {count, limit})).toBe('Vous avez utilisé 0 sur 100')
  })

  it('will log a warning in debug mode when translations for a locale are provided, but a key is not found', () => {
    Vue.config.debug = true

    console.warn = jasmine.createSpy("warn")

    const vm = new Vue()

    let currentLocale = 'es'
    let key = 'This key does not exist'

    vm.$root.locale = currentLocale
    vm.$t(key)

    expect(console.warn).toHaveBeenCalledWith(`[vue-i18n] Translations exist for the locale '${currentLocale}', but there is not an entry for '${key}'`)
  })

  it('will not log a warning when debug mode is off and translations for a locale are provided, but a key is not found', () => {
    Vue.config.debug = false

    console.warn = jasmine.createSpy("warn")

    const vm = new Vue()

    let currentLocale = 'es'
    let key = 'This key does not exist'

    vm.$root.locale = currentLocale
    vm.$t(key)

    expect(console.warn).not.toHaveBeenCalled()
  })

  // v-locale Directive

  it('creates the v-locale directive', () => {
    let vm = new Vue()

    expect(typeof vm.$options.directives['locale']).toEqual('object')
  })

  it('will use the v-locale directive to translate an element\'s children', () => {
    let vm = new Vue({
      template: `
        <div v-locale="$root.locale" key="Thanks for signing up! Confirm |{email} is correct| to continue to the site" :replace="{ email: email }">
          <b id="part1"></b>
          <a id="part2" href="#"></a>
          <i id="part3"></i>
        </div>
      `,
      data: function () {
        return {
          email: 'asdf@example.com',
          locale: 'en'
        }
      }
    }).$mount()

    vm.$root.locale = 'en';
    vm.$nextTick(() => {
      expect(vm.$el.querySelector('#part1').textContent).toBe('Thanks for signing up! Confirm ')
      expect(vm.$el.querySelector('#part2').textContent).toBe('asdf@example.com is correct')
      expect(vm.$el.querySelector('#part3').textContent).toBe(' to continue to the site')
    })

    vm.$root.locale = 'es';
    vm.$nextTick(() => {
      expect(vm.$el.querySelector('#part1').textContent).toBe('Gracias por registrarte! Confirmar ')
      expect(vm.$el.querySelector('#part2').textContent).toBe('asdf@example.com es correcta')
      expect(vm.$el.querySelector('#part3').textContent).toBe(' para continuar al sitio')
    })
  })

})
