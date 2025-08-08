hljs.highlightAll()
// Register event handlers after documented loaded
window.addEventListener('pushState', function () {
  hljs.highlightAll()
})
window.addEventListener('replaceState', function () {
  hljs.highlightAll()
})
