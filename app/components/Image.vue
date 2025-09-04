<template>
  <div class="overflow-hidden" :class="[absolute ? 'absolute' : 'relative']">
    <img
      v-if="isReady"
      :src="src"
      :alt="alt"
      class="pointer-events-none absolute left-0 top-0 h-full w-full duration-300"
      :class="{
        'opacity-0': !isLoaded,
        'opacity-100': isLoaded,
        'object-cover': cover
      }"
      @load="handleLoad"
      @error="handleError"
    />

    <div
      class="absolute left-0 top-0 h-full w-full overflow-hidden bg-neutral-500 duration-300"
      :class="{ 'opacity-0': isLoaded, 'opacity-100': !isLoaded }"
    >
      <div
        class="shimmer after h-full w-full duration-300 after:absolute after:left-[-150px] after:top-0 after:h-full after:w-[150px] after:bg-gradient-to-r after:from-transparent after:via-neutral-400/40 after:to-transparent"
        :class="{ 'opacity-0': isError, 'opacity-100': !isError }"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  src: { type: String, required: true },
  alt: { type: String, default: '' },
  cover: { type: Boolean, default: false },
  absolute: { type: Boolean, default: false }
})

const isReady = ref(false)
const isError = ref(false)
const isLoaded = ref(false)

const handleLoad = () => {
  isLoaded.value = true
}

const handleError = () => {
  isError.value = true
  isLoaded.value = false
}

onMounted(() => {
  isReady.value = true
})
</script>

<style scoped>
.shimmer::after {
  animation: moving 1.5s infinite;
}

@keyframes moving {
  0% {
    left: -150px;
  }
  100% {
    left: 100%;
  }
}
</style>
