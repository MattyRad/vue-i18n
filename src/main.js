import { replace } from './format'
import { set, fetch } from './translations'

export default {
  install: function (Vue, translations = {}) {

    set(translations);

    Vue.directive('locale', {
      params: ['key', 'replace'],

      update: function (locale) {
        var translated_substrings = this.vm.$t(this.params.key, this.params.replace).split('|');

        var children = this.el.children;

        for (var i = 0; i < children.length; i++) {
          if (translated_substrings[i]) {
            children[i].innerText = translated_substrings[i];
          }
        }
      }
    })

    Vue.prototype.$t = function (key, replacements = {}) {
      var locale = replacements['locale'] || this.$root.locale

      var translation = fetch(locale, key)

      return replace(translation, replacements)
    }

    Vue.filter('translate', function (key, replacements = {}) {
      return this.$t(key, replacements)
    })
  }
}
