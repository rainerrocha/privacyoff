<template>
  <Transition name="alert">
    <div class="overflow-hidden" :style="style" role="alert" v-if="active">
      <div
        ref="alert"
        class="flex items-center"
        :class="[inputError ? '' : 'rounded-lg bg-red-200 px-3 py-2']"
      >
        <Icon name="ErrorCircle" class="h-4 w-4 text-red-500" v-if="!inputError" />

        <div class="font-medium" :class="[inputError ? 'text-red-500' : 'ml-2 text-gray-600']">
          <slot />
        </div>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import { sum } from 'lodash-es'

const props = defineProps<{
  active: boolean
  inputError?: boolean
  paddingTop?: number
  paddingBottom?: number
}>()

const alert = ref()

const { height } = useElementSize(alert)

const style = computed(() => ({
  '--pt': props.paddingTop ? `${props.paddingTop}px` : '',
  '--pb': props.paddingBottom ? `${props.paddingBottom}px` : '',
  '--mh': `${sum([height.value, 16, props.paddingTop, props.paddingBottom])}px`
}))
</script>

<style scoped>
div[role='alert'] {
  padding-top: var(--pt);
  padding-bottom: var(--pb);
}

.alert-enter-active,
.alert-leave-active {
  transition:
    opacity 300ms ease,
    max-height 300ms ease,
    padding-top 300ms ease,
    padding-bottom 300ms ease;
}

.alert-enter-from,
.alert-leave-to {
  opacity: 0 !important;
  max-height: 0 !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

.alert-leave-from,
.alert-enter-to {
  opacity: 1;
  max-height: var(--mh);
  padding-top: var(--pb);
}
</style>
