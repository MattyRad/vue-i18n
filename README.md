# vue-i18n

A small package for implementing translations in [Vue.js](http://vuejs.org/). Instead of using a dot based key to fetch a translated string, it just uses the default string itself as the key.

In short `{{ $t('Hello world') }}` instead of `{{ $t('messages.hello_world') }}`.

Better yet: `{{ 'Hello world' | translate }}`

[See a rough demo](https://jsfiddle.net/83o3db0q/7/)

## Compatibility

Designed for Vue 1, currently does not support Vue 2.

## Installation

`npm install voo-i18n`

```javascript
import Vue from 'vue'
import i18n from 'voo-i18n'

const translations = {
  'es': {
    'Hello world': 'Hola Mundo'
  },
  'fr': {
    'Hello world': 'Bonjour le monde'
  },
  'pirate': {
    'Hello world': 'Land ho!'
  }
}

Vue.use(i18n, translations)
```

## Usage

Set a default locale in the __root__ data of your application.

```javascript
<template>
  <h1>{{ 'Hello world' | translate }}</h1>
</template>

<script>
  export default {
    data() {
      return {
        locale: 'en'
      }
    }
  }
</script>
```

And then the translations will be reactive to changes in the `locale` value.

## Override locale

You can override the root locale by passing in the locale param

```html
<h1>{{ $t('Hello world', { locale: 'es' }) }}</h1>
```

## Fallback locales

Localization carries the problem of different languages having different dialects. For example, french vs. canadian french. You can make distinctions as such:

```javascript
export default {
  'fr': {
    'Hello world': 'Bonjour le monde',
    'Goodbye': 'Au Revoir'
  },
  'fr_CA': {
    'Hello world': 'Bonjour tout le monde, du Canada'
  }
}
```

When the locale is set to `fr_CA`, `{{ 'Goodbye' | translate }}` still translates to `'Au Revoir'`. You can also use a hyphen instead of an underscore if you prefer: `fr-CA`.

## Variable arguments

__Don't__ do this
```html
<p>{{ 'You have used' | translate }} {{ count }} {{ 'out of' | translate }} {{ limit }}</p>
```

```javascript
'es': {
  'You have used': 'Ha utilizado',
  'out of': 'fuera de'
},
```

__Do this__
```html
<p>{{ $t('You have used {count} out of {limit}', {count, limit}) }}</p>
```

```javascript
'es': {
  'You have used {count} out of {limit}': 'Ha utilizado {count} de los {limit}'
},
```

## Inline HTML

It's often the case that your sentences will not form nice little compartmentalized strings like `Hello world`. Often you'll get HTML spliced in the middle.

__Don't__ do this
```html
  <p>{{ 'Please perform' | translate }} <a href="#" @click.prevent="action">{{ 'this action' | translate }}</a> {{ 'to complete the task' | translate }}</p>
```

```javascript
'es': {
  'Please perform': 'Por favor, realice',
  'this action': 'esta acción',
  'to complete the task': 'para completar la tarea'
},
```

__Do this__
```html
<p v-locale="$root.locale" key="Please perform |this action| to complete the task">
    <span></span>
    <a href="#" @click.prevent="action"></a>
    <span></span>
</p>
```
```javascript
'es': {
  'Please perform |this action| to complete the task': 'Por favor, realice |esta acción| para completar la tarea'
},
```
###### Important:

The directive element only expects to have children 1 level deep. So `<span v-locale="es" key="a|b"><a><b></b></a></span>` will incorrectly render as `<span><a>a</a></span>`. I haven't found an elegant solution around this yet. The main goal of this repo is to retain lingual context in translations and logical context in components, so it's an acceptable sacrifice for the time being, but if you have a solution please notify me.

## All Together Now!
```html
<div v-locale="$root.locale" key="Thanks for signing up! Confirm |{email} is correct| to continue to the site." :replace="{ email: email }">
  <span></span>
  <a href="#" @click="confirm"></a>
  <span></span>
</div>
```

```javascript
'es': {
  'Thanks for signing up! Confirm |{email} is correct| to continue to the site': 'Gracias por registrarte! Confirmar |{email} es correcta| para continuar al sitio'
},
```

## Tips

### Catching missing translations

If you provide translations for a locale and attempt to translate a string that is missing from the set that your provided, it will just fall back to the original string. If you have debug mode enabled, a warning will be sent to the browser console to help you maintain translations.

### Recommended folder structure

In the root of your main javascript folder, create an i18n folder. Create `map.js`

```javascript
import es from './es'
import it from './it'

export let locales = [
  {
    value: 'es',
    name: 'Spanish',
    native: 'Español',
  },
  {
    value: 'it',
    name: 'Italian',
    native: 'italiano',
  }
]

export default {
  es, it
}
```

And the respective translation files `es.js` and `it.js`

```javascript
// es.js
export default {
  'Hello world': 'Hola mundo',
  ...
  (however many hundreds more translations)
}
```

This way you can hand a single file to a human translator, and you can just import all translations.

```javascript
import translations from './i18n/map'
Vue.use(i18n, translations)
```

later you can import the locales separately to list a dropdown or something

```javascript
<template>
  <a v-for="locale in locales"  @click.prevent="setLanguage(locale.value)">
    {{ locale.native }}
  </a>
</template>

<script>
import { locales } as locale_list from './i18n/map'

export default {
  computed: {
    locales() {
      return locale_list;
    }
  },
  methods: {
    setLanguage(value) {
      this.$root.locale = value;
    }
  }
}
</script>
```
