<template>
  <div class="container">
    <b-breadcrumb :items="breadcrumbItems" />
    <div class="">
      <img class="mb-3 mt-3 center" :src="image">
    </div>
    <b-alert
      :show="dismissCountDown"
      dismissible
      variant="success"
      @dismissed="dismissCountDown=0"
      @dismiss-count-down="countDownChanged"
    >
      Salvo com sucesso!
    </b-alert>
    <b-form enctype="multipart/form-data" method="POST" @submit.prevent="save">
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
          placeholder="Digite o nome"
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
          placeholder="Digite o email"
        />
        <small v-if="!$v.email.required && $v.email.$dirty" class="text-danger">
          * Este campo é obrigatório
        </small>
        <small v-if="errors.email && $v.email.$dirty" class="text-danger">
          {{ errors.email }}
        </small>
      </b-form-group>
      <b-form-group
        id="logo-group"
        label="Imagem:"
        label-for="logo"
        class="text-left"
      >
        <b-form-file id="logo" v-model="$v.logo.$model" name="logo" @change="handleFileChange" />
      </b-form-group>
      <b-form-group
        id="website-group"
        label="WebSite:"
        label-for="website"
        class="text-left"
      >
        <b-form-input
          id="website"
          v-model.trim="$v.website.$model"
          type="text"
          placeholder="Digite o website"
        />
        <small v-if="!$v.website.required && $v.website.$dirty" class="text-danger">
          * Este campo é obrigatório
        </small>
        <small v-if="errors.website && $v.website.$dirty" class="text-danger">
          {{ errors.website }}
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
// import qs from 'qs'

export default {
  layout: 'main',
  data () {
    return {
      busy: false,
      name: '',
      email: '',
      logo: null,
      image: null,
      website: '',
      errors: '',
      dismissSecs: 5,
      dismissCountDown: 0,
      breadcrumbItems: [
        {
          text: 'Home',
          to: '/home'
        },
        {
          text: 'Empresa',
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
    logo: {},
    website: {
      required
    }
  },
  created () {
    this.getCompany()
  },
  methods: {
    async getCompany () {
      const id = this.$route.params.id
      const token = localStorage.getItem('token')
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }
      await this.$axios.$get(process.env.baseUrl + '/companies/' + id, config).then((response) => {
        this.name = response.name
        this.email = response.email
        this.website = response.website
        this.image = 'http://localhost:8000/storage/' + response.logo.replace('public/', '')
      })
    },
    handleFileChange (e) {
      return e.target.files || e.dataTransfer.files
    },
    async save (event) {
      this.$v.$touch()
      this.busy = true

      if (this.$v.$invalid) {
        this.busy = false
        return false
      }
      const token = localStorage.getItem('token')
      const id = this.$route.params.id
      const formData = new FormData()
      formData.append('method', 'PUT')
      formData.append('name', this.name)
      formData.append('email', this.email)
      formData.append('logo', this.logo)
      formData.append('website', this.website)

      const data = formData

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
        }
      }
      await this.$axios.$post(process.env.baseUrl + '/companies/' + id, data, config).then((response) => {
        if (response.errors) {
          this.errors = response.errors
        } else {
          this.showAlert()
          this.image = 'http://localhost:8000/storage/' + response.logo.replace('public/', '')
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

<style lang="css" scoped>
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 200px;
}
</style>
