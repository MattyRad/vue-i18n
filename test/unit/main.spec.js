import Vue from 'vue/dist/vue.js'
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

Vue.use(Main, {translations})

describe('main.js', () => {

  it('will simply return the original string if no translation is found', () => {
    let vm = new Vue({
      locale: 'en'
    })

    expect(vm.$t('Hello world')).toBe('Hello world')

    vm.$setLocale('DNE')
    expect(vm.$t('Hello world')).toBe('Hello world')
  })

  it('will return the translation', () => {
    let vm = new Vue({
      locale: 'en'
    })

    vm.$setLocale('es')
    expect(vm.$t('Hello')).toBe('Hola')
    expect(vm.$t('Goodbye')).toBe('Adiós')

    vm.$setLocale('fr')
    expect(vm.$t('Hello')).toBe('Bonjour')
    expect(vm.$t('Goodbye')).toBe('Au Revoir')
  })

  it('will use the dialect translations, and fall back to base translations when not specified', () => {
    let vm = new Vue({
      locale: 'en'
    })

    vm.$setLocale('fr_CA')
    expect(vm.$t('Hello')).toBe('Bonjour, du Canada')
    expect(vm.$t('Goodbye')).toBe('Au Revoir')

    vm.$setLocale('fr-CA')
    expect(vm.$t('Hello')).toBe('Bonjour, du Canada')
    expect(vm.$t('Goodbye')).toBe('Au Revoir')

    vm.$setLocale('fr_DNE')
    expect(vm.$t('Hello')).toBe('Bonjour')
    expect(vm.$t('Goodbye')).toBe('Au Revoir')
  })

  it('will use a specific locale if one is specified', () => {
    let vm = new Vue({
      locale: 'en'
    })

    vm.$setLocale('es')
    expect(vm.$t('Hello', {locale: 'fr'})).toBe('Bonjour')
  })

  it('will replace vars supplied as a second param', () => {
    let vm = new Vue({
      locale: 'en'
    })

    let count = 0, limit = 100

    expect(vm.$t('You have used {count} out of {limit}')).toBe('You have used {count} out of {limit}')

    expect(vm.$t('You have used {count} out of {limit}', {count, limit})).toBe('You have used 0 out of 100')

    vm.$setLocale('es')
    expect(vm.$t('You have used {count} out of {limit}')).toBe('Ha utilizado {count} de los {limit}')
    expect(vm.$t('You have used {count} out of {limit}', {count, limit})).toBe('Ha utilizado 0 de los 100')

    vm.$setLocale('fr')
    expect(vm.$t('You have used {count} out of {limit}')).toBe('Vous avez utilisé {count} sur {limit}')
    expect(vm.$t('You have used {count} out of {limit}', {count, limit})).toBe('Vous avez utilisé 0 sur 100')

    vm.$setLocale('fr_CA')
    expect(vm.$t('You have used {count} out of {limit}')).toBe('Vous avez utilisé {count} sur {limit}')
    expect(vm.$t('You have used {count} out of {limit}', {count, limit})).toBe('Vous avez utilisé 0 sur 100')
  })

  it('will log a warning in when not in production and when translations for a locale are provided, but a key is not found', () => {
    process.env.NODE_ENV = 'not-production'

    console.warn = jasmine.createSpy("warn")

    const vm = new Vue({
      locale: 'en'
    })

    let currentLocale = 'es'
    let key = 'This key does not exist'

    vm.$setLocale(currentLocale)
    vm.$t(key)

    expect(console.warn).toHaveBeenCalledWith(`[vue-i18n] Translations exist for the locale '${currentLocale}', but there is not an entry for '${key}'`)
  })

  it('will not log a warning when in production and translations for a locale are provided, but a key is not found', () => {
    process.env.NODE_ENV = 'production'

    console.warn = jasmine.createSpy("warn")

    const vm = new Vue({
      locale: 'en'
    })

    let currentLocale = 'es'
    let key = 'This key does not exist'

    vm.$setLocale(currentLocale)
    vm.$t(key)

    expect(console.warn).not.toHaveBeenCalled()
  })

  // filter

  it('will correctly render results using the translate filter', (done) => {
    const Ctor = Vue.extend({
      template: `
        <p>{{ 'Hello' | translate }}</p>
      `
    })

    const vm = new Ctor({
      locale: 'en'
    }).$mount()

    vm.$setLocale('es')

    vm.$nextTick(() => {
      expect(vm.$el.textContent).toBe('Hola')
      done()
    })
  })

  // v-locale Directive

  it('creates the v-locale directive', () => {
    let vm = new Vue({
      locale: 'en'
    })

    expect(typeof vm.$options.directives['locale']).toEqual('object')
  })

  it('will use the v-locale directive to inject text into an element\'s children', (done) => {
    let vm = new Vue({
      locale: 'en',

      template: `
        <div v-locale="{ locale: locale, tra: 'Thanks for signing up! Confirm |{email} is correct| to continue to the site', replace: { email: email } }">
          <b id="part1"></b>
          <a id="part2" href="#"></a>
          <i id="part3"></i>
        </div>
      `,
      data: function () {
        return {
          email: 'asdf@example.com'
        }
      }
    }).$mount()

    vm.$setLocale('en')
    vm.$nextTick(() => {
      expect(vm.$el.querySelector('#part1').textContent).toBe('Thanks for signing up! Confirm ')
      expect(vm.$el.querySelector('#part2').textContent).toBe('asdf@example.com is correct')
      expect(vm.$el.querySelector('#part3').textContent).toBe(' to continue to the site')
      done()
    })
  })

  it('will use the v-locale directive to translate an element\'s children', (done) => {
    let vm = new Vue({
      locale: 'en',

      template: `
        <div v-locale="{ locale: locale, tra: 'Thanks for signing up! Confirm |{email} is correct| to continue to the site', replace: { email: email } }">
          <b id="part1"></b>
          <a id="part2" href="#"></a>
          <i id="part3"></i>
        </div>
      `,
      data: function () {
        return {
          email: 'asdf@example.com'
        }
      }
    }).$mount()

    vm.$setLocale('es')
    vm.$nextTick(() => {
      expect(vm.$el.querySelector('#part1').textContent).toBe('Gracias por registrarte! Confirmar ')
      expect(vm.$el.querySelector('#part2').textContent).toBe('asdf@example.com es correcta')
      expect(vm.$el.querySelector('#part3').textContent).toBe(' para continuar al sitio')
      done()
    })
  })

})
