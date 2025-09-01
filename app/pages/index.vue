<template>
  <section class="mx-auto flex max-w-6xl flex-col gap-6 text-gray-300">
    <div class="flex gap-2 px-6">
      <form
        @submit.prevent="onSearch"
        class="flex w-full items-center gap-2 overflow-hidden rounded-md bg-neutral-900"
      >
        <button
          type="submit"
          class="ml-3 flex items-center text-sm text-neutral-400 duration-300 hover:text-white active:scale-95"
        >
          <Icon name="Search" class="h-5 w-5" />
        </button>

        <input
          type="text"
          class="border-non w-full bg-transparent p-2 text-lg focus:outline-none"
          v-model="search"
          placeholder="Buscar..."
        />
      </form>
    </div>

    <div class="grid grid-cols-1 gap-6 px-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
      <NuxtLink
        v-for="item in items"
        :key="item.id"
        :to="`/profile/${item.id}`"
        class="overflow-hidden rounded-lg bg-neutral-800 ring-2 ring-transparent transition-all duration-300 hover:scale-105 hover:ring-red-600"
      >
        <div class="relative h-28 w-full overflow-hidden">
          <Image :src="item.cover" cover />
        </div>

        <div class="relative flex items-center p-4">
          <div
            class="absolute -top-16 left-0 right-0 mx-auto h-20 w-20 overflow-hidden rounded-full ring-[6px] ring-neutral-800"
          >
            <Image :src="item.avatar" cover />
          </div>

          <h2 class="text-base font-medium">{{ item.name }}</h2>

          <Icon name="FlagBR" class="ml-auto h-5 w-5 rounded-full" />
        </div>
      </NuxtLink>
    </div>

    <div class="mb-12 w-full px-6">
      <div v-if="hasMore" class="flex w-full items-center justify-center">
        <button
          type="button"
          class="mx-auto h-12 w-full rounded-md bg-transparent px-8 text-lg text-neutral-500 duration-300 hover:bg-red-500 hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:bg-transparent disabled:text-neutral-500 disabled:opacity-50 md:w-fit"
          :class="{ 'animate-pulse': isLoading }"
          :disabled="isLoading"
          @click="loadMore"
        >
          {{ isLoading ? 'Carregando...' : 'Carregar mais perfis' }}
        </button>
      </div>

      <div v-else class="flex h-12 items-center justify-center">
        <span class="text-lg text-neutral-600">Não há mais resultados</span>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { isClient, useInfiniteScroll } from '@vueuse/core'

const { data } = await useAsyncData('profiles', () => $fetch(`/v1/profiles?page=1`))

const page = ref<number>(2)
const ready = ref<boolean>(true)
const items = ref<any>(data.value?.items || [])
const search = ref<string>('')
const hasMore = ref<boolean>(data.value?.hasMore || true)

const onSearch = () => {
  console.log(search.value)
}

async function loadMore() {
  try {
    const data = await $fetch(`/v1/profiles?page=${page.value}`)

    console.log(data)

    items.value = [...items.value, ...(data.items || [])]
    hasMore.value = data.hasMore || false
  } catch {
    items.value = []
    hasMore.value = false
  } finally {
    page.value++
  }
}

const el = computed(() => (ready.value && isClient ? document : null))

const { isLoading } = useInfiniteScroll(el, () => loadMore(), {
  distance: 100,
  canLoadMore: () => hasMore.value
})

onUnmounted(() => {
  ready.value = false
})
</script>
