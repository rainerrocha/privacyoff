<template>
  <div class="w-screen px-6 py-6 sm:max-w-[600px] sm:px-10 sm:pt-10 sm:pb-10">
    <div class="flex flex-col items-center justify-center" v-if="subscription.status === 'active'">
      <h1 class="text-3xl font-medium">Minha assinatura</h1>

      <div class="flex w-full flex-col justify-center gap-4 pt-6 whitespace-nowrap sm:flex-row">
        <label
          class="flex flex-1 flex-col items-center rounded-lg border-2 border-red-500 bg-red-50 px-6 py-4 shadow-lg transition-all duration-200 hover:border-red-400 hover:shadow-lg"
        >
          <span class="text-lg font-semibold text-neutral-800">Válido até</span>
          <span class="mt-1 text-2xl font-bold text-red-500">
            {{ formatDate(subscription.expiresAt) }}
          </span>
        </label>
      </div>
    </div>

    <div class="flex flex-col items-center justify-center" v-else-if="qrCode.length">
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
      @submit="onSubmit"
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
            period === 'monthly'
              ? 'border-red-500 bg-red-50 shadow-lg'
              : 'border-neutral-200 bg-white'
          "
        >
          <input
            type="radio"
            name="period"
            id="monthly"
            v-model="period"
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
            period === 'quarterly'
              ? 'border-red-500 bg-red-50 shadow-lg'
              : 'border-neutral-200 bg-white'
          "
        >
          <input
            type="radio"
            name="period"
            id="quarterly"
            v-model="period"
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
          for="annual"
          class="flex flex-1 cursor-pointer flex-col items-center rounded-lg border-2 px-6 py-4 transition-all duration-200 hover:border-red-400 hover:shadow-lg"
          :class="
            period === 'annual'
              ? 'border-red-500 bg-red-50 shadow-lg'
              : 'border-neutral-200 bg-white'
          "
        >
          <input
            type="radio"
            name="period"
            id="annual"
            v-model="period"
            value="annual"
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

      <div class="mt-auto mb-3 flex w-full flex-col items-center justify-between gap-3 sm:flex-row">
        <Button
          type="submit"
          class="h-14 w-full rounded-lg border-red-600 bg-red-500 px-6 text-base font-semibold text-white"
          :disabled="isLoading"
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
  </div>
</template>

<script lang="ts" setup>
const period = ref('monthly')
const qrCode = ref('')
const qrTextarea = ref<HTMLTextAreaElement | undefined>(undefined)
const errorMessage = ref('')

const { data: userData, getData } = useUser()
const { start, isLoading } = useLoader()

const subscription = computed(() => userData.value?.subscription || {})

const onSubmit = async () => {
  const loading = start('auth')

  try {
    errorMessage.value = ''

    const { error, data, success } = await useApi('/v1/payment', {
      body: {
        period: period.value
      },
      method: 'POST'
    })

    if (success) {
      qrCode.value = data.qrCode
    } else {
      throw error
    }
  } catch (error) {
    switch (error) {
      case 'UNAUTHORIZED':
        openModal('login')
        break

      case 'PERIOD_REQUIRED':
        errorMessage.value = `Selecione um período de assinatura.`
        break

      case 'INVALID_PERIOD':
        errorMessage.value = `Selecione um período de assinatura válido.`
        break

      case 'SUBSCRIPTION_ALREADY_EXISTS':
        errorMessage.value = `Você já possui uma assinatura ativa.`
        break

      case '400_FAILED_TO_GENERATE_PIX':
        errorMessage.value = `Falha ao gerar o QR Code. Tente novamente mais tarde.`
        break

      case 'TOO_MANY_REQUESTS':
        errorMessage.value = `Muitas tentativas de login realizadas. Aguarde alguns minutos para tentar novamente.`
        break

      default:
        console.error(error)
        errorMessage.value = 'Erro interno. Tente novamente mais tarde.'
    }

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

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const isReady = ref(false)
const oldData = ref<Record<string, any> | null>(userData.value)

const checkPaymentStatus = async () => {
  const oldStatus = oldData.value?.subscription?.status || ''

  if (oldStatus === 'pending' && isReady.value) {
    const newData = await getData(false)
    const newStatus = newData.subscription?.status || ''

    if (newStatus === 'active' && oldStatus !== newStatus) {
      useToast('success', 'Assinatura ativa com sucesso!')
    }

    oldData.value = newData

    setTimeout(() => checkPaymentStatus(), 2000)
  }
}

onMounted(() => {
  isReady.value = true
  checkPaymentStatus()
})

onUnmounted(() => {
  isReady.value = false
})
</script>
