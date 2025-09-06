<template>
  <div class="w-full w-screen px-6 py-6 sm:max-w-[500px] sm:px-10 sm:pt-10 sm:pb-10">
    <Form id="login" class="flex flex-col items-center justify-center" @submit="onSubmit">
      <h1 class="text-3xl font-medium">Fazer login</h1>

      <h2 class="mt-2 mb-8 text-center">Acesse sua conta para desbloquear todo o conteúdo.</h2>

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
          [isRequired, 'Digite seu e-mail'],
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
          [isRequired, 'Digite sua senha'],
          [minLength(6), 'A senha deve ter pelo menos 6 caracteres']
        ]"
        v-model="password"
      />

      <div class="my-3 flex w-full flex-col items-center justify-between gap-3 sm:flex-row">
        <Button
          type="submit"
          class="h-14 w-full rounded-lg bg-red-500 px-6 text-base font-semibold text-white sm:w-auto"
          :disabled="isLoading"
        >
          Realizar acesso

          <Icon name="ArrowLeft" class="h-4 w-4 rotate-180" />
        </Button>

        <Button
          type="button"
          @click="openModal('forgotPassword')"
          class="border-transparent py-0 font-medium text-neutral-600 hover:underline"
        >
          Recuperar senha
        </Button>
      </div>
    </Form>

    <div class="mt-auto w-full pt-5 text-center">
      <p class="font-medium text-neutral-600">Ainda não tem uma conta?</p>

      <Button
        type="button"
        @click="openModal('register')"
        class="mx-auto border-transparent font-medium text-neutral-600 hover:underline"
      >
        Criar conta
      </Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
const email = ref(isDev() ? 'rainer.rocha@icloud.com' : '')
const password = ref(isDev() ? 'rr051195' : '')

const emailRef = ref()
const passwordRef = ref()
const errorMessage = ref('')

const { getData } = useUser()
const { start, isLoading } = useLoader()

const onSubmit = async () => {
  const loading = start('auth')

  try {
    errorMessage.value = ''

    const { error, success } = await useApi('/v1/auth/login', {
      body: {
        email: email.value,
        password: password.value
      },
      method: 'POST'
    })

    if (success) {
      await getData()

      return closeModal()
    } else {
      throw error
    }
  } catch (error) {
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

      case 'INVALID_ACCOUNT':
        emailRef.value.setError(
          'Não existe uma conta para o e-mail informado. Verifique e tente novamente.'
        )
        break

      case 'INVALID_CREDENTIALS':
        passwordRef.value.setError('A senha informada é inválida. Verifique e tente novamente.')
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
</script>
