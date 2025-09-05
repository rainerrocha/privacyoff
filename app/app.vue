<template>
  <div class="min-h-dvh bg-black font-sans text-white select-none">
    <header class="flex h-16 w-full">
      <div
        class="fixed z-20 flex h-16 w-full items-center justify-between border-b border-neutral-800 bg-black"
      >
        <div class="mx-auto flex w-full max-w-4xl items-center gap-6 px-6 py-3">
          <NuxtLink
            to="/"
            class="flex items-center justify-center text-2xl font-bold text-white sm:text-3xl"
          >
            <div class="relative flex flex-col">
              <div class="border-b-3 text-red-600" />
              <div class="absolute top-0 left-0 h-full w-0 border-l-3 text-red-600" />
              <span class="ml-2 pr-2 leading-none text-red-600">PRIVACY</span>
              <div class="mt-[4px] border-t-3 text-red-600" />
            </div>

            <div class="flex flex-col">
              <div class="border-b-3 border-transparent" />
              <span class="-ml-2 leading-none text-red-900">OFF</span>
              <div class="mt-[4px] border-t-3 border-transparent" />
            </div>
          </NuxtLink>

          <div class="ml-auto flex gap-1 sm:gap-6">
            <button
              type="button"
              @click="openModal('subscription')"
              class="flex items-center justify-center gap-2 px-2 text-base font-medium text-neutral-300 duration-300 hover:text-red-500 sm:text-lg"
              v-if="isLogged"
            >
              Assinatura
            </button>

            <button
              type="button"
              @click="useLogout()"
              class="flex items-center justify-center gap-2 px-2 text-base font-medium text-neutral-300 duration-300 hover:text-red-500 sm:text-lg"
              v-if="isLogged"
            >
              Sair
            </button>

            <button
              type="button"
              @click="openModal('login')"
              class="flex items-center justify-center gap-2 px-2 text-base font-medium text-neutral-300 duration-300 hover:text-red-500 sm:text-lg"
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
    <ModalItemRegister />
    <ModalItemOver18 />
    <ModalItemSubscription />

    <div class="hidden sm:flex">
      <Toaster position="bottom-right" :expand="false" richColors />
    </div>

    <div class="flex sm:hidden">
      <Toaster position="top-right" :expand="false" richColors />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'

const { isLogged } = useUser()
const { isLoading } = useLoader()
</script>
