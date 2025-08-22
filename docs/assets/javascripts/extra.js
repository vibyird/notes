document$.subscribe(function () {
  var palette = __md_get('__palette')
  if (palette && typeof palette.color === 'object') {
    var theme = palette.color.scheme === 'slate' ? 'dark' : 'light'

    document.querySelector('link[href*=github\\.min\\.css]').disabled = theme != 'light'
    document.querySelector('link[href*=github-dark\\.min\\.css]').disabled = theme != 'dark'
  }
  hljs.highlightAll()
})

// Register event handlers after documented loaded
document.addEventListener('DOMContentLoaded', function () {
  var ref = document.querySelector('[data-md-component=palette]')
  ref.addEventListener('change', function () {
    var palette = __md_get('__palette')
    if (palette && typeof palette.color === 'object') {
      var theme = palette.color.scheme === 'slate' ? 'dark' : 'light'

      document.querySelector('link[href*=github\\.min\\.css]').disabled = theme != 'light'
      document.querySelector('link[href*=github-dark\\.min\\.css]').disabled = theme != 'dark'
    }
  })
})
