<template>
  <form @submit.prevent="handleSubmit" method="POST">
    <slot />
  </form>
</template>

<script lang="ts" setup>
import { set } from 'lodash-es'

const props = defineProps<{ onSubmit: any }>()

const handleSubmit = (event: any) => {
  try {
    const form = event.target
    const formData = new FormData(form)

    form.querySelectorAll('input[type=checkbox]').forEach((checkbox: any) => {
      if (!checkbox.checked) formData.append(checkbox.name, 'off')
    })

    let error = false
    const data = {}

    formData.forEach((val, key) => {
      if (!error) {
        const elm = form.elements[key]

        if (elm) {
          if (elm.blur) elm.blur()
          if (elm.setError) elm.setError()

          if (elm.isValid) {
            if (elm.isValid()) set(data, key, val)
            else error = true
          } else {
            set(data, key, val)
          }
        }
      }
    })

    if (!error) props.onSubmit(data)
  } catch (error) {
    console.error(error)
  }
}
</script>
