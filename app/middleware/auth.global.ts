export default defineNuxtRouteMiddleware(async (to) => {
  try {
    const { ssid, isLogged, getData } = useUser()

    if (!isLogged.value && ssid.value) await getData()
  } catch (error) {
    console.log(error)
  }
})
