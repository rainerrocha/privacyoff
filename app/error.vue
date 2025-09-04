<template>
  <slot />
</template>

<script lang="ts" setup>
console.error(useError().value)

await navigateTo('/')
</script>
