<template>
  <div class="min-h-screen select-none bg-black font-sans text-white">
    <header class="flex h-16 w-full">
      <div
        class="fixed z-20 flex h-16 w-full items-center justify-between border-b border-neutral-800 bg-black"
      >
        <div class="mx-auto flex w-full max-w-4xl items-center gap-6 px-6 py-3">
          <NuxtLink to="/" class="text-3xl font-bold text-white">
            <span class="text-red-600">PRIVACY</span><span class="text-red-900">OFF</span>
          </NuxtLink>

          <div class="ml-auto flex gap-6">
            <NuxtLink
              to="/subscription"
              class="flex items-center justify-center gap-2 px-2 text-lg font-medium text-neutral-300 duration-300 hover:text-red-500"
              v-if="isLogged"
            >
              Assinatura
            </NuxtLink>

            <button
              type="button"
              @click="useLogout()"
              class="flex items-center justify-center gap-2 px-2 text-lg font-medium text-neutral-300 duration-300 hover:text-red-500"
              v-if="isLogged"
            >
              Sair
            </button>

            <button
              type="button"
              @click="openModal('login')"
              class="flex items-center justify-center gap-2 px-2 text-lg font-medium text-neutral-300 duration-300 hover:text-red-500"
              v-else
            >
              Fazer login
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="w-full py-6">
      <NuxtPage />
    </main>

    <Loader :active="isLoading" fixed background />
    <ModalItemLogin />
    <ModalItemOver18 />
  </div>
</template>

<script lang="ts" setup>
const { isLogged } = useUser()
const { isLoading } = useLoader()
</script>
