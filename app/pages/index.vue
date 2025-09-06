<template>
  <section class="mx-auto flex max-w-4xl flex-col gap-6 px-4 text-gray-300 sm:px-6">
    <div class="flex gap-2" v-if="isLogged">
      <form
        @submit.prevent="onSearch"
        class="flex h-12 w-full items-center gap-2 overflow-hidden rounded-md bg-neutral-900"
      >
        <button
          type="submit"
          class="ml-3 flex items-center text-sm text-neutral-400 duration-300 hover:text-white active:scale-95"
        >
          <Icon name="Search" class="h-5 w-5" />
        </button>

        <input
          type="text"
          class="h-full w-full border-none bg-transparent p-2 text-lg leading-none focus:outline-none"
          v-model="search"
          placeholder="Buscar..."
        />
      </form>
    </div>

    <div
      class="flex flex-col gap-2 rounded-lg bg-neutral-900 px-6 pt-6 pb-8 text-center text-[15px] sm:text-base"
      v-else
    >
      <h1 class="text-2xl font-bold sm:text-3xl">👋 Bem-vindo!</h1>

      <p class="text-center">O seu destino número #1 para conteúdos adultos exclusivos.</p>

      <p class="text-center">
        Mais de <strong class="text-red-600">1.000 modelos</strong> e uma
        <strong class="text-white">infinidade de fotos e vídeos exclusivos</strong> estão esperando
        por você.
      </p>

      <p class="text-center">
        Não perca tempo — <strong class="text-white">acesso completo imediato</strong> a tudo que só
        os adultos mais curiosos podem ver.
      </p>

      <div class="mx-auto mt-6 flex w-full flex-col items-center justify-center gap-2 sm:flex-row">
        <Button
          class="h-12 w-full rounded-lg border-red-600 bg-red-500 px-6 text-base text-white sm:h-14 sm:w-auto sm:font-semibold"
          @click="openModal('login')"
        >
          Fazer login
        </Button>

        <Button
          class="h-12 w-full rounded-lg border-neutral-600 bg-neutral-500 px-6 text-base text-white sm:h-14 sm:w-auto sm:font-semibold"
          @click="openModal('register')"
        >
          Criar uma conta agora
        </Button>
      </div>
    </div>

    <template v-if="isLogged">
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <NuxtLink
          v-for="item in models"
          :key="item.id"
          :to="`/model/${item.id}`"
          class="group relative flex flex-col items-center justify-center overflow-hidden rounded-lg bg-neutral-800 ring-2 ring-transparent transition-all duration-300 hover:scale-105 hover:ring-red-600"
        >
          <Image :src="item.cover" class="relative h-28 w-full overflow-hidden opacity-30" cover />

          <Image
            :src="item.avatar"
            class="top-4 h-20 w-20 overflow-hidden rounded-full ring-2 ring-neutral-800"
            cover
            absolute
          />

          <div class="relative flex w-full items-center p-4">
            <h2 class="overflow-hidden text-base font-medium text-ellipsis whitespace-nowrap">
              {{ item.name }}
            </h2>

            <Icon name="FlagBR" class="mx-2 h-5 w-5 rounded-full" />

            <Icon
              name="ArrowLeft"
              class="ml-auto h-5 w-5 rotate-180 opacity-20 duration-300 group-hover:opacity-100"
            />
          </div>
        </NuxtLink>
      </div>

      <div class="mb-12 w-full">
        <div v-if="hasMore" class="flex w-full items-center justify-center">
          <button
            type="button"
            class="relative mx-auto h-12 w-full rounded-md bg-transparent px-8 text-lg text-neutral-500 duration-300 active:scale-95 disabled:cursor-not-allowed disabled:bg-transparent disabled:text-neutral-500 disabled:opacity-50 md:w-fit"
            :class="[isLoading ? '' : 'hover:bg-red-500 hover:text-white']"
            :disabled="isLoading"
            @click="loadMore"
          >
            <Loader :active="isLoading" />

            <span class="flex items-center justify-center" v-if="!isLoading">
              Carregar mais perfis
            </span>
          </button>
        </div>

        <div v-else class="flex h-12 items-center justify-center">
          <span class="text-lg text-neutral-600">Não há mais resultados</span>
        </div>
      </div>
    </template>

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3" v-else>
      <button
        v-for="item in models"
        :key="item.id"
        type="button"
        class="group relative flex flex-col items-center justify-center overflow-hidden rounded-lg bg-neutral-800 ring-2 ring-transparent transition-all duration-300 hover:scale-105 hover:ring-red-600"
        @click="openModal('login')"
      >
        <Image :src="item.cover" class="relative h-28 w-full overflow-hidden opacity-30" cover />

        <Image
          :src="item.avatar"
          class="top-4 h-20 w-20 overflow-hidden rounded-full ring-2 ring-neutral-800"
          cover
          absolute
        />

        <div class="relative flex w-full items-center p-4">
          <h2 class="overflow-hidden text-base font-medium text-ellipsis whitespace-nowrap">
            {{ item.name }}
          </h2>

          <Icon name="FlagBR" class="mx-2 h-5 w-5 rounded-full" />

          <Icon
            name="ArrowLeft"
            class="ml-auto h-5 w-5 rotate-180 opacity-20 duration-300 group-hover:opacity-100"
          />
        </div>
      </button>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { isClient, useInfiniteScroll } from '@vueuse/core'
import { get, isArray, isEmpty, last, map, uniqBy } from 'lodash-es'

const { isLogged } = useUser()
const { start: startLoader, isLoading: isAsyncLoading } = useLoader()

const { data } = await useAsyncData('models', () => {
  return useApi('/v1/models', { method: 'POST' })
})

const items = ref<any[]>(data.value?.items || [])
const search = ref<string>('')
const isReady = ref<boolean>(true)

const models = computed(() => {
  return map(items.value, (item) => ({
    ...item,
    cover: useImageBlur(item.cover),
    avatar: useImageBlur(item.avatar)
  }))
})

const lastId = computed(() => get(last(items.value), 'id', ''))
const hasMore = computed(() => !isEmpty(data.value?.items))
const isLoading = computed(() => isAsyncLoading.value || isScrollLoading.value)

const onSearch = () => {
  items.value = []
  loadMore()
}

async function loadMore() {
  let loading

  if (isEmpty(items.value)) {
    loading = startLoader('models')
  }

  try {
    const response = await useApi('/v1/models', {
      body: {
        search: search.value,
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

onUnmounted(() => {
  isReady.value = false
})

useHead({
  title: 'Privacy Off | Conteúdos exclusivos',
  titleTemplate: '',
  meta: [
    { property: 'og:title', content: 'Privacy Off | Conteúdos exclusivos' },
    { property: 'og:image', content: models.value[0]?.avatar || '' }
  ]
})
</script>
