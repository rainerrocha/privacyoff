<template>
  <Modal
    ref="modal"
    class="w-full px-6 py-6 sm:max-w-[650px] sm:px-10 sm:pt-10 sm:pb-10"
    :submit="onSubmit"
    :disable-outside-click="true"
  >
    <template #content="{ submit, loading }">
      <div class="flex flex-col items-center justify-center" v-if="qrCode.length">
        <h1 class="text-3xl font-medium">Pagamento</h1>

        <h2 class="mt-2 mb-8 text-center">
          Escaneie o QR Code com o seu celular e efetue<br />o pagamento para desbloquear todos os
          conteúdos.
        </h2>

        <div
          class="flex cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-lg bg-white duration-300 hover:opacity-80"
          @click="copyQRCode"
        >
          <QRCode v-model="qrCode" class="square-image pointer-events-none w-52" />
        </div>

        <div class="mt-4 mb-4 flex w-full items-center justify-center">
          <hr class="flex-grow border-neutral-300" />
          <span class="mx-4 text-center text-neutral-600">ou</span>
          <hr class="flex-grow border-neutral-300" />
        </div>

        <p class="text-center text-neutral-600">
          Copie o QR Code e efetue o pagamento no seu celular
        </p>

        <textarea
          ref="qrTextarea"
          type="textarea"
          class="my-6 w-full resize-none rounded-lg bg-neutral-300 p-4 text-neutral-800 duration-300 focus:outline-none"
          rows="4"
          readonly
          @click="copyQRCode"
          @focus="selectAllText"
          v-model="qrCode"
        />

        <div class="mt-auto flex w-full flex-row justify-center gap-4 whitespace-nowrap">
          <Button
            type="button"
            @click="copyQRCode"
            class="h-14 w-full rounded-lg border-red-600 bg-red-500 px-6 text-base font-semibold text-white"
          >
            Copiar QR Code

            <Icon name="ArrowLeft" class="h-4 w-4 rotate-180" />
          </Button>
        </div>
      </div>

      <Form
        id="subscription"
        class="flex flex-col items-center justify-center"
        @submit="submit"
        v-else
      >
        <h1 class="text-3xl font-medium">Assinatura</h1>

        <h2 class="mt-2 mb-8 text-center">Escolha um plano para desbloquear todos os conteúdos.</h2>

        <div class="flex w-full flex-col justify-center gap-4 whitespace-nowrap sm:flex-row">
          <!-- Plano Mensal -->
          <label
            for="monthly"
            class="flex flex-1 cursor-pointer flex-col items-center rounded-lg border-2 px-6 py-4 transition-all duration-200 hover:border-red-400 hover:shadow-lg"
            :class="
              plan === 'monthly'
                ? 'border-red-500 bg-red-50 shadow-lg'
                : 'border-neutral-200 bg-white'
            "
          >
            <input
              type="radio"
              name="plan"
              id="monthly"
              v-model="plan"
              value="monthly"
              class="hidden"
            />

            <span class="text-lg font-semibold text-neutral-800">1 mês</span>
            <span class="mt-1 text-2xl font-bold text-red-500">R$ 29,90</span>
            <span class="mt-1 text-sm text-neutral-500">por mês</span>
          </label>

          <!-- Plano Trimestral -->
          <label
            for="quarterly"
            class="flex flex-1 cursor-pointer flex-col items-center rounded-lg border-2 px-6 py-4 transition-all duration-200 hover:border-red-400 hover:shadow-lg"
            :class="
              plan === 'quarterly'
                ? 'border-red-500 bg-red-50 shadow-lg'
                : 'border-neutral-200 bg-white'
            "
          >
            <input
              type="radio"
              name="plan"
              id="quarterly"
              v-model="plan"
              value="quarterly"
              class="hidden"
            />

            <span class="text-lg font-semibold text-neutral-800">3 meses</span>
            <span class="mt-1 text-2xl font-bold text-red-500">R$ 59,90</span>
            <span class="mt-1 text-sm font-semibold text-green-600">35% OFF</span>
            <span class="text-sm text-neutral-500">R$ 19,97/mês</span>
          </label>

          <!-- Plano Anual -->
          <label
            for="yearly"
            class="flex flex-1 cursor-pointer flex-col items-center rounded-lg border-2 px-6 py-4 transition-all duration-200 hover:border-red-400 hover:shadow-lg"
            :class="
              plan === 'yearly'
                ? 'border-red-500 bg-red-50 shadow-lg'
                : 'border-neutral-200 bg-white'
            "
          >
            <input
              type="radio"
              name="plan"
              id="yearly"
              v-model="plan"
              value="yearly"
              class="hidden"
            />
            <span class="text-lg font-semibold text-neutral-800">1 ano</span>
            <span class="mt-1 text-2xl font-bold text-red-500">R$ 119,90</span>
            <span class="mt-1 text-sm font-semibold text-green-600">70% OFF</span>
            <span class="text-sm text-neutral-500">R$ 9,99/mês</span>
          </label>
        </div>

        <Alert class="w-full" :active="Boolean(errorMessage)" :padding-bottom="24">
          {{ errorMessage }}
        </Alert>

        <span class="mt-6 flex" />

        <div
          class="mt-auto mb-3 flex w-full flex-col items-center justify-between gap-3 sm:flex-row"
        >
          <Button
            type="submit"
            class="h-14 w-full rounded-lg border-red-600 bg-red-500 px-6 text-base font-semibold text-white"
            :disabled="loading"
          >
            Gerar QR Code

            <Icon name="ArrowLeft" class="h-4 w-4 rotate-180" />
          </Button>
        </div>
      </Form>

      <div class="mt-auto w-full pt-5 text-center">
        <p class="font-medium text-neutral-600">Alguma dúvida?</p>

        <Button
          type="button"
          @click="openModal('chat')"
          class="mx-auto border-transparent font-medium text-neutral-600 hover:underline"
        >
          Fale conosco
        </Button>
      </div>
    </template>
  </Modal>
</template>

<script lang="ts" setup>
const modal = ref()

const plan = ref(isDev() ? 'monthly' : '')

const qrCode = ref('')
const qrTextarea = ref<HTMLTextAreaElement | undefined>(undefined)
const errorMessage = ref('')

const onSubmit = async () => {
  const loading = useLoader().start('auth')

  try {
    errorMessage.value = ''

    const { error, data, success } = await useApi('/v1/payment', {
      body: {
        plan: plan.value
      },
      method: 'POST'
    })

    if (success) {
      qrCode.value = data.qrCode

      return false
    } else {
      throw error
    }
  } catch (error) {
    return false
  } finally {
    loading.stop()
  }
}

const copyQRCode = async () => {
  try {
    await navigator.clipboard.writeText(qrCode.value)

    useToast('success', 'Código PIX copiado!')
  } catch (error) {
    console.error(error)
  }
}

const selectAllText = () => {
  qrTextarea.value?.select()
}

onMounted(() => {
  const win = window as any
  win.subscriptionModal = modal.value
})
</script>
