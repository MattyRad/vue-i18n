import { replace } from './format'
import { set as setTranslations, fetch as fetchTranslation } from './translations'

const data = {
  locale: undefined
}

const translate = function (key, replacements = {}) {
  let locale = replacements['locale'] || data.locale

  let translation = fetchTranslation(locale, key)

  return replace(translation, replacements)
}

export default {
  install(Vue, translations = {}) {

    setTranslations(translations);

    Vue.mixin({
      data() {
        return data
      },
      created() {
        data.locale = this.$options.locale
      },
      methods: {
        $t: translate,
        setLocale(label) {
          data.locale = label
        }
      },

      filters: {
        translate
      },

      directives: {
        locale: {
          params: ['key', 'replace'],

          update(locale) {
            var translated_substrings = this.vm.$t(this.params.key, this.params.replace).split('|');

            var children = this.el.children;

            for (var i = 0; i < children.length; i++) {
              if (translated_substrings[i]) {
                children[i].innerText = translated_substrings[i];
              }
            }
          }
        }
      }
    })

  }
}
