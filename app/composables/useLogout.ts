export const useLogout = async () => {
  await useApi('/v1/auth/logout')
  await useUser().setData()

  openModal('login')
}
