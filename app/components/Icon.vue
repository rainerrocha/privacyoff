<template>
  <div class="flex-shrink-0" v-html="iconSVG" />
</template>

<script lang="ts" setup>
import { ref, watchEffect } from 'vue'

const props = defineProps<{ name: string }>()
const iconSVG = ref<string | Record<string, any>>('')

async function getIcon() {
  try {
    const iconsImport = (import.meta as any).glob('/assets/icons/**/**.svg', {
      query: 'raw',
      import: 'default'
    })

    const rawIcon = await iconsImport[`/assets/icons/${props.name}.svg`]()

    const listIds: any = {}

    let modifiedSvg = rawIcon.replace(/id="[a-zA-Z0-9_-]+"/g, (item: any) => {
      const id = item.split('"')[1].split('"')[0]
      const randomId = getUniqueId()

      listIds[id] = randomId

      return `id="${randomId}"`
    })

    Object.entries(listIds).forEach(([oldId, newId]) => {
      modifiedSvg = modifiedSvg.replace(new RegExp(`url\\(#${oldId}\\)`, 'g'), `url(#${newId})`)
    })

    iconSVG.value = modifiedSvg
  } catch {}
}

await getIcon()

watchEffect(getIcon)

function getUniqueId() {
  return Math.random().toString(36).substring(2, 9)
}
</script>

<style scoped>
div > :deep(svg) {
  width: 100%;
  height: 100%;
}
</style>
