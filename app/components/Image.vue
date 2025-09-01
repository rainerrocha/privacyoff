<template>
  <NuxtImg
    class="relative overflow-hidden"
    :src="src"
    :alt="alt"
    :custom="true"
    v-slot="{ src, isLoaded, imgAttrs }"
    loading="lazy"
  >
    <img
      v-if="isLoaded"
      v-bind="imgAttrs"
      :src="src"
      class="pointer-events-none absolute left-0 top-0 h-full w-full overflow-hidden duration-300"
      :class="{ 'opacity-0': !isLoaded, 'opacity-100': isLoaded, 'object-cover': cover }"
    />

    <div
      class="absolute left-0 top-0 h-full w-full overflow-hidden bg-neutral-500 duration-300"
      :class="{ 'opacity-0': isLoaded, 'opacity-100': !isLoaded }"
    >
      <div
        class="shimmer after h-full w-full after:absolute after:left-[-150px] after:top-0 after:h-full after:w-[150px] after:bg-gradient-to-r after:from-transparent after:via-neutral-400/40 after:to-transparent"
      />
    </div>
  </NuxtImg>
</template>

<script lang="ts" setup>
defineProps({
  src: { type: String, required: true },
  alt: { type: String, default: '' },
  cover: { type: Boolean, default: false }
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
