<template>
  <Modal
    ref="modal"
    class="w-full px-6 pb-6 pt-12 sm:max-w-[550px] sm:px-10 sm:pb-10 sm:pt-10"
    :submit="handleSubmit"
    :disable-outside-click="true"
  >
    <template #content="{ submit }">
      <form
        class="flex h-full flex-col items-center text-center text-base"
        @submit.prevent="submit"
      >
        <h1 class="text-xl font-semibold">🔥 Este é o ponto sem volta.</h1>

        <div class="mt-4">
          Aqui você encontra as mulheres mais desejadas, com conteúdos ousados e exclusivos, feitos
          para quem sabe o que quer.
        </div>

        <div class="mt-4">
          Mas só entra quem tem <strong class="text-red-500">18 anos ou mais.</strong>
        </div>

        <div class="mb-6 mt-4">Quer descobrir o que está por trás?</div>

        <div class="mt-auto flex w-full justify-end gap-2">
          <Button
            class="h-14 flex-1 rounded-lg border-neutral-300 bg-neutral-200 text-base font-semibold text-neutral-600"
            @click="handleClose"
          >
            Sair
          </Button>

          <Button
            type="submit"
            class="h-14 flex-1 rounded-lg bg-red-500 text-base font-semibold text-white"
          >
            Continuar
          </Button>
        </div>
      </form>
    </template>
  </Modal>
</template>

<script lang="ts" setup>
const modal = ref()
const { isLogged } = useUser()

const cookie = useCookie('over18', {
  path: '/',
  secure: true,
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
})

const isOver18 = computed(() => {
  if (isLogged.value) return true
  else return cookie.value === 'yes'
})

const handleSubmit = async () => {
  cookie.value = 'yes'
  return modal.value.close()
}

const handleClose = () => {
  return navigateTo('https://www.google.com/', { external: true })
}

watch(isOver18, (value) => {
  if (!value) modal.value.open()
})

onMounted(() => {
  if (!isOver18.value) modal.value.open()
})
</script>
