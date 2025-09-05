<template>
  <Transition
    enter-active-class="duration-300 transition-opacity"
    leave-active-class="duration-300 transition-opacity"
    enter-from-class="opacity-0"
    leave-from-class="opacity-1"
    enter-to-class="opacity-1"
    leave-to-class="opacity-0"
  >
    <div
      class="left-0 top-0 z-50 flex items-center justify-center"
      :class="[
        fixed ? 'fixed h-dvh w-screen' : 'absolute h-full w-full',
        background && 'bg-black/80'
      ]"
      v-if="active"
    >
      <svg viewBox="25 25 50 50" :class="size">
        <circle r="20" cx="50" cy="50" fill="none" />
      </svg>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{ size?: string; fixed?: boolean; active?: boolean; background?: boolean }>(),
  {
    size: 'h-14 w-14',
    fixed: false,
    active: false,
    background: false
  }
)
</script>

<style scoped>
svg {
  animation: loading-rotate 2s linear infinite;

  @keyframes loading-rotate {
    100% {
      transform: rotate(1turn);
    }
  }

  > circle {
    animation: loading-dash 1.5s ease-in-out infinite;
    stroke-width: 2;
    stroke: #dc2626;

    @keyframes loading-dash {
      0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
      }
      50% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -40px;
      }
      100% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -120px;
      }
    }
  }
}
</style>
