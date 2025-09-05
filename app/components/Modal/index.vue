<template>
  <Teleport to="body">
    <Transition enter-from-class="scale-modal opacity-0" leave-to-class="scale-modal opacity-0">
      <div
        v-if="active"
        class="fixed left-0 top-0 z-40 flex h-screen w-full select-none items-center justify-center bg-black/90 duration-300 before:fixed before:h-[200%] before:w-[200%] before:bg-black before:bg-opacity-20"
      >
        <OnClickOutside
          class="relative z-10 h-full max-h-screen w-screen overflow-hidden border border-neutral-100 bg-neutral-100 transition-transform duration-300 sm:h-auto sm:rounded-lg sm:shadow-2xl"
          :class="additionalClasses"
          @trigger="handleClickOutside"
        >
          <button
            type="button"
            @click="handleClose"
            class="absolute right-2 top-3 flex h-10 w-10 items-center justify-center text-neutral-500 duration-300 hover:text-neutral-800 active:scale-95"
          >
            <Icon name="Close" class="h-5 w-5" />
          </button>

          <slot name="content" :close="handleClose" :submit="handleSubmit" :loading="loading">
            <h1 class="text-xl font-semibold">
              <slot name="header" />
            </h1>

            <p class="mt-4 text-sm font-normal text-[#778490]">
              <slot name="body" />
            </p>

            <div class="mt-10 flex justify-end gap-2">
              <slot name="footer" :close="handleClose" :submit="handleSubmit" :loading="loading" />
            </div>
          </slot>
        </OnClickOutside>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import { delay } from 'lodash-es'
import { OnClickOutside } from '@vueuse/components'

const props = withDefaults(
  defineProps<{
    class?: string
    submit?: () => Promise<boolean>
    closeOnSuccess?: boolean
    disableOutsideClick?: boolean
  }>(),
  {
    class: 'w-[490px] p-10',
    submit: () => Promise.resolve(true),
    closeOnSuccess: true,
    disableOutsideClick: false
  }
)

const active = ref(false)
const loading = ref(false)
const blinkClass = ref('')
const additionalClasses = computed(() => [props.class, blinkClass.value])

const handleOpen = () => {
  active.value = true
}

const handleClose = () => {
  active.value = false
}

const handleSubmit = async () => {
  if (!loading.value) {
    try {
      loading.value = true

      const success = await props.submit?.()

      if (success && props.closeOnSuccess) {
        handleClose()
      }
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }
}

const handleClickOutside = () => {
  if (props.disableOutsideClick || loading.value) {
    blinkClass.value = 'blink'

    return delay(() => (blinkClass.value = ''), 100)
  }

  handleClose()
}

defineExpose({
  open: handleOpen,
  close: handleClose
})
</script>

<style scoped>
.blink {
  transform: scale(1.1);
}

.scale-modal {
  > .relative {
    transform: scale(0.8);
  }
}
</style>
