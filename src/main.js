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
  install(Vue, options = {}) {

    setTranslations(options.translations);

    Vue.prototype.$t = translate
    Vue.prototype.$setLocale = function (label) {
      data.locale = label
    }

    Vue.filter('translate', translate)

    Vue.directive('locale', function (el, binding, vnode) {
      var translated_substrings = vnode.context.$t(binding.value.tra, binding.value.replace).split('|');

      var children = el.children;

      for (var i = 0; i < children.length; i++) {
        if (translated_substrings[i]) {
          children[i].innerText = translated_substrings[i];
        }
      }
    })

    Vue.mixin({
      data() {
        return data
      },

      beforeCreate() {
        if (this.$options.locale !== undefined) {
          data.locale = this.$options.locale
        }
      }
    })
  }
}
