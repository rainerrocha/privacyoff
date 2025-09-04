<template>
  <Modal
    ref="modal"
    class="w-full max-w-[550px] p-10"
    :submit="handleSubmit"
    :disable-outside-click="true"
  >
    <template #content="{ close, submit }">
      <form
        class="flex flex-col items-center justify-center text-center text-base"
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

        <div class="mt-4">Quer descobrir o que está por trás?</div>

        <div class="mt-6 flex w-full justify-end gap-2">
          <Button width="flex-1" height="h-10" @click="handleClose">Sair</Button>

          <Button
            type="submit"
            width="flex-1"
            height="h-10"
            color="red"
            font-weight="font-semibold"
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
