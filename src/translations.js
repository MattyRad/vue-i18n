const locale_translations = {
  /*
  'es': {
    'hello': 'hola'
  }
  */
}

export var set = function (translations) {
  // we could just assign locale_translations = translations, but
  // I would like to keep locale_translations as a const,
  // therefore set each set of translations manually
  Object.keys(translations).forEach(function (locale) {
    locale_translations[locale] = translations[locale]
  })
}

export var fetch = function (locale, key) {
  var translations = locale_translations[locale]

  if (translations) {
    if (key in translations) {
      return translations[key];
    }

    if (locale.indexOf('_') > -1) {
      return fetch(locale.slice(0, 2), key)
    }

    // key not found

    if (window.console) {
      console.warn(`[vue-i18n] Translations exist for the locale '${locale}', but there is not an entry for '${key}'`)
    }
  }

  return key
}
