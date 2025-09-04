<template>
  <div class="relative h-auto w-full">
    <label class="flex flex-col">
      <div class="flex items-center">
        <span class="text-base font-medium">{{ label }}</span>
        <span v-if="smlabel" class="ml-1 text-xs text-gray-600">
          {{ smlabel }}
        </span>
      </div>

      <input
        ref="input"
        v-model="modelValue"
        :name="name"
        :type="type"
        :disabled="disabled"
        :readonly="props.readonly"
        :autocomplete="autocomplete"
        class="h-10 w-full rounded-lg px-3 py-2 text-base text-gray-800 shadow-sm outline-none ring-1 transition-all duration-300 placeholder:text-gray-800/40 placeholder:duration-300 hover:placeholder:text-gray-800/70 focus:placeholder:text-gray-800/70"
        :class="[
          props.class,
          props.readonly && 'opacity-70',
          errorMessage ? 'ring-[#e63939]' : 'ring-gray-300 hover:ring-gray-400 focus:ring-gray-400'
        ]"
        :placeholder="placeholder"
        @blur="onBlur"
      />
    </label>

    <Alert class="text-sm" :active="Boolean(errorMessage)" :input-error="true" :padding-bottom="16">
      {{ errorMessage }}
    </Alert>
  </div>
</template>

<script lang="ts" setup>
import { find, isFunction } from 'lodash-es'

const props = withDefaults(
  defineProps<{
    name?: string
    type?: string
    class?: string
    label?: string
    smlabel?: string
    disabled?: boolean
    readonly?: boolean
    formatter?: Function
    formatterBlur?: Function
    validator?: any
    modelValue?: any
    placeholder?: string
    autocomplete?: string
  }>(),
  {
    type: 'text',
    placeholder: ' '
  }
)

const input = ref()
const modelValue = defineModel<string>()
const errorMessage = ref('')

const isValid = () => {
  const isInvalid = find(props.validator, (validator) => {
    try {
      const [fn, message] = validator

      if (!isFunction(fn)) return false
      if (!message) return false

      const valid = fn(modelValue.value)
      if (!valid) return setError(message)

      return false
    } catch (error) {
      console.error(error)

      return false
    }
  })

  return !isInvalid
}

const setError = (message?: string) => {
  if (message) {
    errorMessage.value = message

    nextTick(() => input.value.focus())
  } else {
    errorMessage.value = ''
  }

  return true
}

watch(modelValue, (newVal) => {
  if (!newVal) return

  nextTick(() => {
    setError()
    if (isFunction(props.formatter)) modelValue.value = props.formatter(newVal)
  })
})

const onBlur = () => {
  if (isFunction(props.formatterBlur)) modelValue.value = props.formatterBlur(modelValue.value)
}

defineExpose({ isValid, setError })

onMounted(() => {
  Object.defineProperty(input.value, 'isValid', { value: isValid })
  Object.defineProperty(input.value, 'setError', { value: setError })
})
</script>
