<template>
  <div ref="container">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { Fancybox, type FancyboxOptions } from '@fancyapps/ui/dist/fancybox/'
import '@fancyapps/ui/dist/fancybox/fancybox.css'

const props = defineProps<{
  options?: FancyboxOptions
}>()

const container = ref<HTMLElement | null>(null)

onUpdated(() => {
  Fancybox.unbind(container.value)

  Fancybox.close()

  Fancybox.bind(container.value, '[data-fancybox]', {
    Hash: false,
    ...(props.options || {})
  })
})

onMounted(() => {
  Fancybox.bind(container.value, '[data-fancybox]', {
    Hash: false,
    ...(props.options || {})
  })
})
</script>

<style>
.fancybox__dialog {
  button[data-autoplay-action='toggle'] {
    display: none !important;
  }
}
</style>
