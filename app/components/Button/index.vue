<template>
  <button
    :type="type"
    :class="[
      'flex select-none items-center justify-center gap-2 whitespace-nowrap border outline-none transition-all duration-300 hover:opacity-70 disabled:cursor-not-allowed disabled:border-inherit disabled:bg-inherit disabled:text-inherit disabled:opacity-30',
      width,
      height,
      active,
      margin,
      padding,
      rounded,
      fontSize,
      fontWeight
    ]"
  >
    <slot />
  </button>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    type?: 'button' | 'submit'
    width?: string
    height?: string
    active?: string
    margin?: string
    padding?: string
    rounded?: string
    fontSize?: string
    fontWeight?: string
  }>(),
  {
    type: 'button',
    width: 'w-auto',
    height: 'h-10',
    active: 'active:scale-95',
    margin: 'm-0',
    padding: 'px-4',
    rounded: 'rounded-md',
    fontSize: 'text-sm md:text-base',
    fontWeight: 'font-normal'
  }
)
</script>
