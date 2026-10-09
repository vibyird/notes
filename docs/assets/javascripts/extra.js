;(function () {
  function getPaletteTheme() {
    const palette = __md_get('__palette')
    if (palette && typeof palette.color === 'object' && palette.color.media) {
      const match = palette.color.media.match(/prefers-color-scheme:\s*(\w+)/)
      if (match) {
        return match[1]
      }
    }
    return undefined
  }

  function updateGiscusTheme(theme) {
    const frame = document.querySelector('.giscus-frame')
    frame && frame.contentWindow.postMessage({ giscus: { setConfig: { theme } } }, 'https://giscus.app')
  }

  // Register event handlers after documented loaded
  document.addEventListener('DOMContentLoaded', function () {
    // Register event handler for palette change
    const ref = document.querySelector('[data-md-component=palette]')
    ref.addEventListener('change', function () {
      const paletteTheme = getPaletteTheme()
      const giscusTheme = (
        paletteTheme ? paletteTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
      )
        ? 'transparent_dark'
        : 'light'

      updateGiscusTheme(giscusTheme)
    })

    // Register event handler for system theme change
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    query.addEventListener('change', function () {
      const paletteTheme = getPaletteTheme()
      if (paletteTheme) {
        return
      }
      const giscusTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'transparent_dark' : 'light'

      updateGiscusTheme(giscusTheme)
    })
  })
})()
