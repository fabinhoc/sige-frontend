<template>
  <div class="container">
    <b-breadcrumb :items="breadcrumbItems" />
    <b-alert
      dismissible
      :show="dismissCountDown"
      variant="success"
      @dismissed="dismissCountDown=0"
      @dismiss-count-down="countDownChanged"
    >
      Salvo com sucesso!
    </b-alert>
    <b-form @submit.prevent="save">
      <b-form-group
        id="name-group"
        label="Nome:"
        label-for="name"
        class="text-left"
      >
        <b-form-input
          id="name"
          v-model.trim="$v.name.$model"
          type="text"
          placeholder="Digite seu nome"
        />
        <small v-if="!$v.name.required && $v.name.$dirty" class="text-danger">
          * Este campo é obrigatório
        </small>
        <small v-if="errors.name && $v.name.$dirty" class="text-danger">
          {{ errors.name }}
        </small>
      </b-form-group>
      <b-form-group
        id="email-group"
        label="Email:"
        label-for="email"
        class="text-left"
      >
        <b-form-input
          id="email"
          v-model.trim="$v.email.$model"
          type="text"
          placeholder="Digite seu email"
        />
        <small v-if="!$v.email.required && $v.email.$dirty" class="text-danger">
          * Este campo é obrigatório
        </small>
        <small v-if="errors.email && $v.email.$dirty" class="text-danger">
          {{ errors.email }}
        </small>
      </b-form-group>
      <b-form-group
        id="password-group"
        label="Senha:"
        label-for="password"
        class="text-left"
      >
        <b-form-input
          id="password"
          v-model.trim="$v.password.$model"
          type="password"
          placeholder="Digite sua senha"
        />
        <small v-if="!$v.password.required && $v.password.$dirty" class="text-danger">
          * Este campo é obrigatório
        </small>
        <small v-if="errors.password && $v.password.$dirty" class="text-danger">
          {{ errors.password }}
        </small>
      </b-form-group>
      <b-form-group>
        <b-button :disabled="busy" type="submit" variant="info">
          Salvar
        </b-button>
        <b-button type="button" variant="default" to="/home">
          Cancelar
        </b-button>
      </b-form-group>
    </b-form>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'

export default {
  layout: 'main',
  data () {
    return {
      busy: false,
      name: '',
      email: '',
      password: '',
      errors: '',
      dismissSecs: 5,
      dismissCountDown: 0,
      breadcrumbItems: [
        {
          text: 'Home',
          to: '/home'
        },
        {
          text: 'Usuário',
          href: '#'
        }
      ]
    }
  },
  validations: {
    email: {
      required
    },
    name: {
      required
    },
    password: {
      required
    }
  },
  methods: {
    async save () {
      this.$v.$touch()
      this.busy = true

      if (this.$v.$invalid) {
        this.busy = false
        return false
      }

      const token = localStorage.getItem('token')
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }
      const data = {
        name: this.name,
        email: this.email,
        password: this.password
      }

      await this.$axios.$post(process.env.baseUrl + '/users/', data, config).then((response) => {
        if (response.errors) {
          this.errors = response.errors
        } else {
          this.showAlert()
          event.target.reset()
        }

        this.busy = false
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error)
        this.busy = false
      })
    },
    countDownChanged (dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    showAlert () {
      this.dismissCountDown = this.dismissSecs
    }
  }
}
</script>
