<template>
  <div class="container">
    <b-breadcrumb :items="breadcrumbItems" />
    <div class="">
      <img class="mb-3 mt-3 center" :src="image">
    </div>
    <h3 class="text-center">
      {{ companyName }}
    </h3>
    <b-alert
      :show="dismissCountDown"
      dismissible
      variant="success"
      @dismissed="dismissCountDown=0"
      @dismiss-count-down="countDownChanged"
    >
      Salvo com sucesso!
    </b-alert>
    <b-form method="POST" @submit.prevent="save" class="mt-5">
      <b-row>
        <b-col cols-md="6">
          <b-form-group
            id="name-group"
            label="Nome:"
            label-for="name"
            class="text-left"
          >
            <b-form-input
              id="name"
              v-model.trim="name"
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
        </b-col>
        <b-col cols-md="6">
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
        </b-col>
      </b-row>

      <b-row>
        <b-col cols-md="6">
          <b-form-group
            id="personalNumber-group"
            label="CPF:"
            label-for="personalNumber"
            class="text-left"
          >
            <b-form-input
              id="personalNumber"
              v-model.trim="personalNumber"
              type="text"
              placeholder="Digite o CPF"
            />
          </b-form-group>
        </b-col>

        <b-col cols-md="6">
          <b-form-group
            id="phone-group"
            label="Telefone:"
            label-for="phone"
            class="text-left"
          >
            <b-form-input
              id="phone"
              v-model.trim="phone"
              type="text"
              placeholder="Digite o Telefone"
            />
          </b-form-group>
        </b-col>
      </b-row>

      <b-row>
        <b-col cols-md="4">
          <b-form-group
            id="zipcode-group"
            label="CEP:"
            label-for="zipcode"
            class="text-left"
          >
            <b-form-input
              id="zipcode"
              v-model.trim="zipcode"
              type="text"
              placeholder="Digite o CEP"
              @keydown.tab="viaCEPservice"
              @keyup.enter="viaCEPservice"
            />
          </b-form-group>
        </b-col>

        <b-col cols-md="8">
          <b-form-group
            id="address-group"
            label="Endereço:"
            label-for="address"
            class="text-left"
          >
            <b-form-input
              id="address"
              v-model.trim="address"
              type="text"
              placeholder="Digite o Endereço"
            />
          </b-form-group>
        </b-col>
      </b-row>

      <b-row>
        <b-col cols-md="4">
          <b-form-group
            id="neighborhood-group"
            label="Bairro:"
            label-for="neighborhood"
            class="text-left"
          >
            <b-form-input
              id="neighborhood"
              v-model.trim="neighborhood"
              type="text"
              placeholder="Digite o Bairro"
            />
          </b-form-group>
        </b-col>
        <b-col cols-md="4">
          <b-form-group
            id="state-group"
            label="Estado:"
            label-for="state"
            class="text-left"
          >
            <b-form-input
              id="state"
              v-model.trim="state"
              type="text"
              placeholder="Digite o Estado"
            />
          </b-form-group>
        </b-col>
        <b-col cols-md="4">
          <b-form-group
            id="city-group"
            label="Cidade:"
            label-for="city"
            class="text-left"
          >
            <b-form-input
              id="city"
              v-model.trim="city"
              type="text"
              placeholder="Digite a Cidade"
            />
          </b-form-group>
        </b-col>
        <b-col cols-md="4">
          <b-form-group
            id="houseNumber-group"
            label="Número:"
            label-for="houseNumber"
            class="text-left"
          >
            <b-form-input
              id="houseNumber"
              v-model.trim="houseNumber"
              type="text"
              placeholder="Digite o Número"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols-md="6">
          <b-form-group
            id="complement-group"
            label="Complement:"
            label-for="complement"
            class="text-left"
          >
            <b-form-input
              id="complement"
              v-model.trim="complement"
              type="text"
              placeholder="Digite o complemento"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols-md="12">
          <b-form-group>
            <b-button :disabled="busy" type="submit" variant="info">
              Salvar
            </b-button>
            <b-button type="button" variant="default" to="/home">
              Cancelar
            </b-button>
          </b-form-group>
        </b-col>
      </b-row>
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
      image: '',
      companyName: '',
      name: '',
      email: '',
      personalNumber: '',
      phone: '',
      companyId: '',
      zipcode: '',
      address: '',
      houseNumber: '',
      neighborhood: '',
      state: '',
      city: '',
      complement: '',
      errors: '',
      dismissSecs: 5,
      dismissCountDown: 0,
      breadcrumbItems: [
        {
          text: 'Home',
          to: '/home'
        },
        {
          text: 'Cliente',
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
    this.getCompany()
  },
  methods: {
    async getCompany () {
      const token = localStorage.getItem('token')
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      const companyId = this.$route.params.companyId
      await this.$axios.$get(process.env.baseUrl + '/companies/' + companyId, config).then((response) => {
        this.companyName = response.name
        this.companyId = response.id
        this.image = 'http://localhost:8000/storage/' + response.logo.replace('public/', '')
      })
    },
    async viaCEPservice () {
      const zipcode = this.zipcode
      await this.$axios.$get('http://viacep.com.br/ws/' + zipcode + '/json/').then((response) => {
        this.address = response.logradouro
        this.neighborhood = response.bairro
        this.state = response.uf
        this.city = response.localidade
      }).catch()
    },
    async save (event) {
      this.$v.$touch()
      this.busy = true

      if (this.$v.$invalid) {
        this.busy = false
        return false
      }
      const token = localStorage.getItem('token')
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const data = {
        name: this.name,
        email: this.email,
        personalNumber: this.personalNumber,
        phone: this.phone,
        company_id: this.companyId,
        zipcode: this.zipcode,
        address: this.address,
        houseNumber: this.houseNumber,
        neighborhood: this.neighborhood,
        state: this.state,
        city: this.city,
        complement: this.complement
      }

      await this.$axios.$post(process.env.baseUrl + '/clients/', data, config).then((response) => {
        console.log(response)
        if (response.errors) {
          this.errors = response.errors
        } else {
          this.showAlert()
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
