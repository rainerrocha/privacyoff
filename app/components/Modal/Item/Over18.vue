<template>
  <div class="w-full px-6 py-6 sm:max-w-[500px] sm:px-10 sm:pt-10 sm:pb-10">
    <form
      class="flex h-full flex-col items-center text-center text-base"
      @submit.prevent="handleSubmit"
    >
      <h1 class="text-xl font-semibold">🔥 Este é o ponto sem volta.</h1>

      <div class="mt-4">
        Aqui você encontra as mulheres mais desejadas, com conteúdos ousados e exclusivos, feitos
        para quem sabe o que quer.
      </div>

      <div class="mt-4">
        Mas só entra quem tem <strong class="text-red-500">18 anos ou mais.</strong>
      </div>

      <div class="mt-4 mb-6">Quer descobrir o que está por trás?</div>

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
  </div>
</template>

<script lang="ts" setup>
const cookie = useCookie('over18', {
  path: '/',
  secure: true,
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
})

const handleSubmit = async () => {
  cookie.value = 'yes'
  return closeModal()
}

const handleClose = () => {
  return navigateTo('https://www.google.com/', { external: true })
}
</script>
