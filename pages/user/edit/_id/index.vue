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
      <div>
        <small v-for="error in errors" :key="error">{{ error }}</small>
      </div>
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
    }
  },
  created () {
    this.getUser()
  },
  methods: {
    async getUser () {
      const id = this.$route.params.id
      const token = localStorage.getItem('token')
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }
      await this.$axios.$get(process.env.baseUrl + '/users/' + id, config).then((response) => {
        this.name = response.name
        this.email = response.email
      })
    },
    async save () {
      this.$v.$touch()

      if (this.$v.$invalid) {
        return false
      }

      const id = this.$route.params.id
      const token = localStorage.getItem('token')
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }
      const data = {
        name: this.name,
        email: this.email
      }

      await this.$axios.$put(process.env.baseUrl + '/users/' + id, data, config).then((response) => {
        if (response.errors) {
          this.errors = response.errors
        } else {
          this.showAlert()
        }

        this.name = response.name
        this.email = response.email
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error)
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
