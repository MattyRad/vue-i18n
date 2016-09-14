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
  if (! locale) return key;

  var translations = locale_translations[locale]

  if (translations && key in translations) {
    return translations[key];
  }

  // key not found, fall back from dialect translations

  if (locale.indexOf('_') > -1) {
    return fetch(locale.substr(0, locale.indexOf('_')), key)
  }

  if (locale.indexOf('-') > -1) {
    return fetch(locale.substr(0, locale.indexOf('-')), key)
  }

  // key does not exist

  if (translations && window.console) {
    console.warn(`[vue-i18n] Translations exist for the locale '${locale}', but there is not an entry for '${key}'`)
  }

  return key
}
