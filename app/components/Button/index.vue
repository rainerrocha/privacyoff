<template>
  <button
    :type="type"
    :class="[
      'flex flex-shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap border outline-none transition-all duration-300 hover:opacity-70 active:scale-95 disabled:cursor-not-allowed disabled:border-inherit disabled:bg-inherit disabled:text-inherit disabled:opacity-30'
    ]"
  >
    <slot />
  </button>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{ type?: 'button' | 'submit' }>(), { type: 'button' })
</script>
