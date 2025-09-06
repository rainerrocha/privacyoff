<template>
  <Teleport to="body">
    <Transition enter-from-class="scale-modal opacity-0" leave-to-class="scale-modal opacity-0">
      <div
        v-if="active"
        class="fixed top-0 left-0 z-40 flex h-dvh w-full items-center-safe justify-center overflow-y-auto duration-300 select-none before:fixed before:h-[200%] before:w-[200%] before:bg-black/70 sm:py-6"
      >
        <OnClickOutside
          class="scroll-thin max-h-content relative z-10 flex min-h-full flex-1 flex-col border border-neutral-100 bg-neutral-100 transition-transform duration-300 sm:max-h-min sm:min-h-auto sm:max-w-fit sm:rounded-lg sm:shadow-2xl"
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

          <ModalItemLogin v-if="active === 'login'" />
          <ModalItemOver18 v-if="active === 'over18'" />
          <ModalItemRegister v-if="active === 'register'" />
          <ModalItemSubscription v-if="active === 'subscription'" />
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
    class: 'w-[490px]',
    submit: () => Promise.resolve(true),
    closeOnSuccess: true,
    disableOutsideClick: false
  }
)

const active = ref<string | null>(null)
const blinkClass = ref('')
const additionalClasses = computed(() => [props.class, blinkClass.value])

const handleOpen = (id: string) => {
  if (id) {
    active.value = id
    document.body.style.overflow = 'hidden'
  }
}

const handleClose = () => {
  active.value = null
  document.body.style.overflow = 'auto'
}

const handleClickOutside = () => {
  blinkClass.value = 'blink'

  return delay(() => (blinkClass.value = ''), 100)
}

onMounted(() => {
  const win = window as any
  win.openModal = handleOpen
  win.closeModal = handleClose
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
