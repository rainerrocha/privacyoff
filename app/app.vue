<template>
  <div class="min-h-screen select-none bg-black font-sans text-white">
    <header class="flex h-16 w-full">
      <div
        class="fixed z-10 flex h-16 w-full items-center justify-between border-b-2 border-neutral-800 bg-black"
      >
        <div class="mx-auto flex w-full max-w-6xl items-center gap-6 px-6 py-3">
          <NuxtLink to="/" class="text-3xl font-bold text-white">
            <span class="text-neutral-400">PRIVACY</span><span class="text-[#F68D3D]">OFF</span>
          </NuxtLink>

          <NuxtLink
            to="/subscription"
            class="ml-auto flex items-center justify-center gap-2 text-lg font-medium text-neutral-400 duration-300 hover:text-red-500"
          >
            <Icon name="UserPlus" class="h-6 w-6" />
            Assinatura
          </NuxtLink>

          <NuxtLink
            to="/logout"
            class="flex items-center justify-center gap-2 text-lg font-medium text-neutral-400 duration-300 hover:text-red-500"
          >
            <Icon name="SignOut" class="h-6 w-6" />
            Sair
          </NuxtLink>
        </div>
      </div>
    </header>

    <main class="w-full py-6">
      <NuxtPage />
    </main>
  </div>
</template>
