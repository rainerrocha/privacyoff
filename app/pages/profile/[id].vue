<template>
  <section class="mx-auto flex max-w-6xl flex-col items-center gap-4 text-gray-300">
    <div class="mt-6 flex w-full flex-1 items-center justify-between whitespace-nowrap px-6">
      <button
        type="button"
        @click="router.back()"
        class="flex h-10 w-10 items-center justify-center rounded-full duration-300 hover:bg-neutral-800 hover:text-red-500 active:scale-95"
      >
        <Icon name="ArrowLeft" class="h-6 w-6" />
      </button>

      <h1 class="text-2xl font-bold">{{ item.name }}</h1>

      <button
        type="button"
        class="flex h-10 w-10 items-center justify-center rounded-full duration-300 hover:bg-neutral-800 hover:text-red-500 active:scale-95"
      >
        <Icon name="Ellipsis" class="h-6 w-6" />
      </button>
    </div>

    <div class="grid w-full flex-1 grid-cols-1 gap-6 px-6">
      <div class="overflow-hidden rounded-lg bg-neutral-800">
        <div class="relative h-52 w-full overflow-hidden">
          <Image :src="item.cover" cover />
        </div>

        <div class="relative flex items-center px-4 py-10">
          <div
            class="absolute -top-20 left-0 right-0 mx-auto h-40 w-40 overflow-hidden rounded-full ring-[6px] ring-neutral-800"
          >
            <Image :src="item.avatar" cover />
          </div>

          <Icon name="FlagBR" class="h-6 w-6 rounded-full" />

          <h2 class="ml-3 text-xl font-bold">{{ item.name }}</h2>
        </div>
      </div>
    </div>

    <div class="grid w-full flex-1 grid-cols-3 gap-6 px-6">
      <button
        type="button"
        class="flex h-10 items-center justify-center rounded-lg bg-red-600 font-medium duration-300 active:scale-95"
      >
        Todos
      </button>

      <button
        type="button"
        class="flex h-10 items-center justify-center gap-2 rounded-lg bg-neutral-800 font-medium ring-2 ring-transparent duration-300 hover:bg-transparent hover:text-red-600 hover:ring-red-600 active:scale-95"
      >
        <Icon name="Photo" class="h-5 w-5" />
        Fotos
      </button>

      <button
        type="button"
        class="flex h-10 items-center justify-center gap-2 rounded-lg bg-neutral-800 font-medium ring-2 ring-transparent duration-300 hover:bg-transparent hover:text-red-600 hover:ring-red-600 active:scale-95"
      >
        <Icon name="Video" class="h-5 w-5" />
        Vídeos
      </button>
    </div>
  </section>
</template>

<script lang="ts" setup>
const router = useRouter()

const item = ref<any>({
  cover: 'https://via.placeholder.com/150',
  avatar: 'https://via.placeholder.com/150',
  name: 'Aline Novak'
})
</script>
