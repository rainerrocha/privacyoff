<template>
  <img :src="qrCodeData" />
</template>

<script lang="ts" setup>
// @ts-ignore
import QRCode from 'qrcode'

const modelValue = defineModel<string>()

const qrCodeData = await computedAsync(async () => {
  try {
    return await QRCode.toDataURL(modelValue.value)
  } catch {
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=='
  }
})
</script>
