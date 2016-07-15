export default {
  install: function (Vue, locale_translations) {

    Vue.locale_translations = locale_translations; // FIXME: scope

    Vue.prototype.$t = function (key) {
      let translations = Vue.locale_translations[this.$root.locale] // FIXME: scope

      if (translations) {
        if (key in translations) {
          return translations[key];
        }

        // Also fall back to a sublocale, e.g. "fr" translations from the locale "fr_CA"
        if (this.$root.locale.includes('_')) {
          let sublocale = this.$root.locale.slice(0, 2)

          translations = locale_translations[sublocale]

          if (translations && (key in translations)) {
            return translations[key];
          }
        }

        if (window.console) {
          console.warn(`Translations exist for the locale ${this.$root.locale}, but there is not an entry for '${key}'`)
        }
      }

      return key
    }

    Vue.filter('translate', function (key) {
      return this.$t(key)
    })
  }
}