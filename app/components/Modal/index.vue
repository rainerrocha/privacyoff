<template>
  <Teleport to="body">
    <Transition enter-from-class="scale-modal opacity-0" leave-to-class="scale-modal opacity-0">
      <div
        v-if="active"
        class="fixed top-0 left-0 z-40 flex h-dvh w-full items-center-safe justify-center overflow-y-auto duration-300 select-none before:fixed before:h-[200%] before:w-[200%] before:bg-black/70 sm:py-6"
      >
        <OnClickOutside
          class="scroll-thin max-h-content relative z-10 flex min-h-full w-screen flex-1 flex-col border border-neutral-100 bg-neutral-100 transition-transform duration-300 sm:max-h-min sm:min-h-auto sm:rounded-lg sm:shadow-2xl"
          :class="additionalClasses"
          @trigger="handleClickOutside"
        >
          <button
            type="button"
            @click="handleClose"
            class="absolute top-3 right-2 flex h-10 w-10 items-center justify-center text-neutral-500 duration-300 hover:text-neutral-800 active:scale-95"
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
import { useElementBounding } from '@vueuse/core'

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
  document.body.style.overflow = 'hidden'
}

const handleClose = () => {
  active.value = false
  document.body.style.overflow = 'auto'
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
