# vue-i18n

A small package for implementing translations in Vue.js. Instead of using a dot based key to fetch a locale string, it just uses the default locale string itself as the key.

In short `{{ $t('Hello world') }}` instead of `{{ $t('messages.hello') }}`.

There are trade-offs to doing it this way:

Pros:
- Dead simple code
- Falling back to the default locale easy, requires no extra logic
- HTML retains the full language context instead of referring back and forth to string keys

Cons:
- Large strings are unwieldy
- Small changes (like capitalization) are not recognized
- Changing strings in the default locale will require updates in all language files (necessary anyway, as the copy has changed)

# Installation

> npm install voo-i18n

```javascript
import i18n from 'voo-i18n'

let translations = {
	'es': {
		'Hello world': 'Hola Mundo'
	},
	'fr': {
		'Hello world': 'Bonjour le monde'
	},
	'pirate': {
		'Hello world': 'Avast, ye trecharous earth!'
	}
}

Vue.use(i18n, translations)
```

# Usage

Set a default locale in the root data of your application.

```javascript
<template>
	<h1>{{ 'Hello world' | translate }}</h1>
	<h1>{{ $t('Hello world') }}</h1>
</template>

<script>
	export default {
		data () {
			return {
				locale: 'en'
			}
		}
	}
</script>
```

And then the translations will be reactive to changes in the `locale` value.

# Fallback locales

Localization carries the problem of different countries having different dialects. For example, french and canadian french. You can make distinctions as such:

```javascript
// i18n/fr.js
export default {
	'Hello world': 'Bonjour le monde'
	'Goodbye': 'Au Revoir'
}

// i18n/fr_CA.js
export default {
	'Hello world': 'Bonjour tout le monde, du Canada'
}
```

When the locale is set to `fr_CA`, `{{ 'Goodbye' | translate }}` still translates to 'Au Revoir'.