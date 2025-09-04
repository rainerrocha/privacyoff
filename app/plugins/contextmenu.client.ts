export default defineNuxtPlugin(() => {
  if (process.env.NODE_ENV === 'development') return

  document.addEventListener('contextmenu', (event) => {
    event.preventDefault()
  })
})
