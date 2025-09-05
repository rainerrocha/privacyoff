<template>
  <Modal
    ref="modal"
    class="w-full px-6 pb-6 pt-12 sm:max-w-[550px] sm:px-10 sm:pb-10 sm:pt-10"
    :submit="onSubmit"
    :disable-outside-click="true"
  >
    <template #content="{ close, submit, loading }">
      <Form id="register" class="flex h-full flex-col items-center justify-center" @submit="submit">
        <h1 class="text-[32px] font-medium">Criar conta</h1>

        <h2 class="mb-8 mt-2 text-center">Crie sua conta para acessar todo o conteúdo.</h2>

        <Alert class="w-full" :active="Boolean(errorMessage)" :padding-bottom="24">
          {{ errorMessage }}
        </Alert>

        <Input
          ref="emailRef"
          name="email"
          label="Endereço de e-mail"
          placeholder="E-mail de acesso"
          autocomplete="email"
          class="my-2"
          :formatter="formatEmail"
          :validator="[
            [isRequired, 'Qual é seu e-mail?'],
            [isEmail, 'Insira um endereço de e-mail válido']
          ]"
          v-model="email"
        />

        <Input
          ref="passwordRef"
          name="password"
          type="password"
          label="Senha"
          placeholder="Senha de acesso"
          autocomplete="password"
          class="my-2"
          :validator="[
            [isRequired, 'Crie uma senha'],
            [minLength(6), 'A senha deve ter pelo menos 6 caracteres']
          ]"
          v-model="password"
        />

        <div class="my-3 flex w-full flex-col items-center justify-between gap-3 sm:flex-row">
          <Button
            type="submit"
            class="h-14 w-full rounded-lg border-red-600 bg-red-500 px-6 text-base font-semibold text-white"
            :disabled="loading"
          >
            Criar conta

            <Icon name="ArrowLeft" class="h-4 w-4 rotate-180" />
          </Button>
        </div>

        <div class="mt-auto w-full pt-5 text-center">
          <p class="font-medium text-neutral-600">Já tem uma conta?</p>

          <Button
            type="button"
            @click="openModal('login')"
            class="mx-auto border-transparent font-medium text-neutral-600 hover:underline"
          >
            Fazer login
          </Button>
        </div>
      </Form>
    </template>
  </Modal>
</template>

<script lang="ts" setup>
const modal = ref()

const email = ref(isDev() ? 'rainer.rocha@icloud.com' : '')
const password = ref(isDev() ? 'rr051195' : '')

const emailRef = ref()
const passwordRef = ref()
const errorMessage = ref('')

const { getData } = useUser()

const onSubmit = async () => {
  const loading = useLoader().start('auth')

  try {
    errorMessage.value = ''

    const { error, success } = await useApi('/v1/auth/register', {
      body: {
        email: email.value,
        password: password.value
      },
      method: 'POST'
    })

    if (success) {
      await getData()

      return true
    } else {
      throw error
    }
  } catch (error) {
    console.error({ error })

    switch (error) {
      case 'REQUIRED_EMAIL':
        emailRef.value.setError('Por favor, digite seu endereço de e-mail.')
        break

      case 'REQUIRED_PASSWORD':
        passwordRef.value.setError('Por favor, digite a sua senha.')
        break

      case 'INVALID_EMAIL':
        emailRef.value.setError('Insira um endereço de e-mail válido.')
        break

      case 'INVALID_PASSWORD':
        passwordRef.value.setError('A senha deve ter pelo menos 6 caracteres.')
        break

      case 'USER_ALREADY_REGISTERED':
        emailRef.value.setError('Já existe uma conta para o e-mail informado.')
        break

      case 'TOO_MANY_REQUESTS':
        errorMessage.value = `Muitas tentativas de cadastro realizadas. Aguarde alguns minutos para tentar novamente.`
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

onMounted(() => {
  const win = window as any
  win.registerModal = modal.value
})
</script>
