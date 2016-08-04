export var replace = function (translation, replacements = {}) {
  return translation.replace(/\{\w+\}/g, function (placeholder) {
    var key = placeholder.replace('{', '').replace('}', '')

    if (replacements[key] !== undefined) {
      return replacements[key]
    }

    return placeholder
  })
}
