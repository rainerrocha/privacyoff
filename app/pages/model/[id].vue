<template>
  <section class="mx-auto flex max-w-4xl flex-col gap-6 px-4 text-gray-300 sm:px-6">
    <div class="mt-2 flex h-12 w-full items-center justify-between whitespace-nowrap">
      <button
        type="button"
        @click="navigateTo('/')"
        class="flex h-10 w-10 items-center justify-center rounded-full duration-300 hover:bg-neutral-800 hover:text-red-500 active:scale-95"
      >
        <Icon name="ArrowLeft" class="h-6 w-6" />
      </button>

      <h1 class="text-xl font-bold whitespace-nowrap duration-300 md:text-2xl">
        {{ model.name }}
      </h1>

      <button
        type="button"
        class="flex h-10 w-10 items-center justify-center rounded-full duration-300 hover:bg-neutral-800 hover:text-red-500 active:scale-95"
      >
        <Icon name="Ellipsis" class="h-6 w-6" />
      </button>
    </div>

    <div class="grid w-full flex-1 grid-cols-1 gap-6">
      <div class="overflow-hidden rounded-lg bg-neutral-800">
        <div
          class="relative z-10 flex h-52 w-full items-center justify-center duration-300 lg:h-64"
        >
          <Image :src="model.cover" class="h-full w-full" blur cover />

          <Image
            :src="model.avatar"
            class="z-10 mx-auto mt-0 h-32 w-32 overflow-hidden rounded-full ring-[6px] ring-neutral-800 duration-300 lg:mt-36 lg:h-40 lg:w-40"
            cover
            absolute
          />
        </div>

        <div class="relative flex items-center px-4 py-4">
          <div class="relative ml-2 flex items-center">
            <h2 class="text-lg font-bold text-neutral-200 duration-300 md:text-xl">
              {{ model.name }}
            </h2>

            <Icon
              name="FlagBR"
              class="ml-2 h-5 w-5 rounded-full md:h-6 md:w-6"
              v-if="model.country === 'br'"
            />
          </div>

          <div class="relative ml-auto flex items-center">
            <button
              type="button"
              class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full duration-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              :class="
                !isLogged
                  ? 'text-neutral-200'
                  : liked
                    ? 'text-red-500'
                    : 'text-neutral-200 hover:text-red-500'
              "
              @click="toggleLiked"
              :disabled="!isLogged"
            >
              <Transition
                enter-active-class="transition-all duration-500"
                leave-active-class="transition-all duration-500"
                enter-from-class="scale-50"
                leave-to-class="scale-0"
              >
                <Icon name="Liked" class="absolute h-6 w-6" v-if="liked" />
                <Icon name="Like" class="absolute h-6 w-6" v-else />
              </Transition>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-6 w-full">
      <div class="flex w-full flex-col overflow-hidden rounded-lg bg-neutral-800">
        <div class="flex w-full items-center justify-center gap-4 px-6 py-4">
          <button
            type="button"
            class="flex h-10 max-w-48 items-center justify-center gap-2 rounded-full bg-neutral-800 bg-transparent px-3 font-medium duration-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-28 sm:px-6"
            :class="
              activeTab === 'all'
                ? ['text-red-600 ring-2 ring-red-600']
                : ['ring-2 ring-transparent hover:ring-neutral-600']
            "
            @click="changeTab('all')"
            :disabled="!isLogged"
          >
            Todos
          </button>

          <button
            type="button"
            class="flex h-10 max-w-48 items-center justify-center gap-2 rounded-full bg-neutral-800 bg-transparent px-3 font-medium duration-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-28 sm:px-6"
            :class="
              !isLogged
                ? 'text-neutral-200'
                : activeTab === 'photo'
                  ? ['text-red-600 ring-2 ring-red-600']
                  : ['ring-2 ring-transparent hover:ring-neutral-600']
            "
            @click="changeTab('photo')"
            :disabled="!isLogged"
          >
            Fotos
          </button>

          <button
            type="button"
            class="flex h-10 max-w-48 items-center justify-center gap-2 rounded-full bg-neutral-800 bg-transparent px-3 font-medium duration-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-28 sm:px-6"
            :class="
              !isLogged
                ? 'text-neutral-200'
                : activeTab === 'video'
                  ? ['text-red-600 ring-2 ring-red-600']
                  : ['ring-2 ring-transparent hover:ring-neutral-600']
            "
            @click="changeTab('video')"
            :disabled="!isLogged"
          >
            Vídeos
          </button>
        </div>

        <div
          class="grid w-full flex-1 grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-4"
          v-if="locked"
        >
          <button
            type="button"
            class="cursor-pointer duration-300 hover:opacity-50"
            v-for="photo in medias"
            :key="photo.id"
            @click="isLogged ? openModal('subscription') : openModal('login')"
          >
            <div
              class="relative flex aspect-square flex-1 items-center justify-center bg-neutral-500"
            >
              <Image :src="photo.preview" class="relative aspect-square flex-1" cover />

              <div class="pointer-events-none absolute flex items-center justify-center">
                <Icon name="Locked" class="h-10 w-10" />
              </div>
            </div>
          </button>
        </div>

        <Gallery class="grid w-full flex-1 grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-4" v-else>
          <button
            type="button"
            class="cursor-pointer duration-300 hover:opacity-50"
            v-for="photo in medias"
            :key="photo.id"
            :href="photo.content"
            :data-fancybox="id"
          >
            <Image :src="photo.preview" class="relative aspect-square flex-1" cover />
          </button>
        </Gallery>

        <div class="my-12 w-full" v-if="!locked">
          <div v-if="hasMore" class="flex w-full items-center justify-center">
            <button
              type="button"
              class="relative mx-auto h-12 w-full rounded-md bg-transparent px-8 text-lg text-neutral-500 duration-300 active:scale-95 disabled:cursor-not-allowed disabled:bg-transparent disabled:text-neutral-500 disabled:opacity-50 md:w-fit"
              :class="[isLoading ? '' : 'hover:bg-red-500 hover:text-white']"
              :disabled="isLoading"
              @click="loadMore"
            >
              <Loader :active="isLoading && medias.length > 0" />

              <span class="flex items-center justify-center" v-if="!isLoading">
                Carregar mais perfis
              </span>
            </button>
          </div>

          <div v-else class="flex h-12 items-center justify-center">
            <span class="text-lg text-neutral-600">Não há mais resultados</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { isClient, useInfiniteScroll } from '@vueuse/core'
import { get, isArray, isEmpty, last, map, uniqBy } from 'lodash-es'

const { isLogged, hasActiveSubscription } = useUser()

const { id } = useRoute().params
const { data: modelData } = await useAsyncData('model', () => useApi(`/v1/model/${id}`))

const { data: mediasData } = await useAsyncData('medias', () => {
  return useApi(`/v1/model/${id}/medias`, { method: 'POST' })
})

const { start: startLoader, isLoading: isAsyncLoading } = useLoader()

const liked = ref(false)
const items = ref<any[]>(mediasData.value?.items || [])
const locked = computed(() => !isLogged.value || !hasActiveSubscription.value)
const isReady = ref<boolean>(true)
const activeTab = ref<'all' | 'photo' | 'video'>('all')

const changeTab = (tab: 'all' | 'photo' | 'video') => {
  items.value = []
  activeTab.value = tab
  loadMore()
}

const toggleLiked = () => {
  liked.value = !liked.value
}

const model = computed((): Record<string, any> => {
  try {
    const value = modelData.value?.data as Record<string, any>
    const result = value.id ? value : {}

    return {
      ...result,
      cover: useImageBlur(result.cover),
      avatar: useImageBlur(result.avatar)
    }
  } catch {
    return {}
  }
})

const medias = computed(() => {
  return map(items.value, (item) => ({
    id: item.id,
    type: item.type,
    preview: useImageBlur(item.preview, true),
    content: useImageBlur(item.content, true)
  }))
})

const lastId = computed(() => get(last(items.value), 'id', ''))
const hasMore = computed(() => !isEmpty(mediasData.value?.items))
const isLoading = computed(() => isAsyncLoading.value || isScrollLoading.value)

async function loadMore() {
  let loading

  if (isEmpty(items.value)) {
    loading = startLoader('medias')
  }

  try {
    const response = await useApi(`/v1/model/${id}/medias`, {
      body: {
        type: activeTab.value === 'all' ? null : activeTab.value,
        lastId: lastId.value
      },
      method: 'POST'
    })

    const oldItems = isArray(items.value) ? items.value : []
    const newItems = isArray(response.items) ? response.items : []

    items.value = uniqBy([...oldItems, ...newItems], 'id')
  } catch {
    items.value = []
  } finally {
    if (loading) loading.stop()
  }
}

const el = computed(() => {
  if (!isClient) return null
  if (locked.value) return null
  if (!isReady.value) return null
  if (!isLogged.value) return null

  return document
})

const { isLoading: isScrollLoading } = useInfiniteScroll(el, () => loadMore(), {
  distance: 100,
  canLoadMore: () => hasMore.value
})

watch(isLogged, () => {
  items.value = []
  loadMore()
})

if (!model.value.id) {
  throw createError({ statusCode: 404 })
}

const title = computed(() => `${model.value.name} | Privacy Off`)
const description = computed(() => `Fotos e vídeos de ${model.value.name}`)

useHead({
  title: title.value,
  titleTemplate: '',
  meta: [
    { name: 'description', content: description.value },
    { property: 'og:title', content: title.value },
    { property: 'og:image', content: model.value.avatar },
    { property: 'og:description', content: description.value }
  ]
})
</script>
