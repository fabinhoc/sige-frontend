<template>
  <div class="container">
    <!-- <div>
      <div class="form-group" :class="{ 'form-group--error': $v.name.$error }">
        <label class="form__label">Name</label>
        <input class="form__input" v-model.trim="$v.name.$model"/>
      </div>
      <div class="error" v-if="!$v.name.required">Field is required</div>
      <div class="error" v-if="!$v.name.minLength">Name must have at least {{$v.name.$params.minLength.min}} letters.</div>
      <tree-view :data="$v.name" :options="{rootObjectKey: '$v.name', maxDepth: 2}"></tree-view>
      <div class="form-group" :class="{ 'form-group--error': $v.age.$error }">
        <label class="form__label">Age</label>
        <input class="form__input" v-model.trim.lazy="$v.age.$model"/>
      </div>
      <div class="error" v-if="!$v.age.between">Must be between {{$v.age.$params.between.min}} and {{$v.age.$params.between.max}}</div><span tabindex="0">Blur to see changes</span>
      <tree-view :data="$v.age" :options="{rootObjectKey: '$v.age', maxDepth: 2}"></tree-view>
    </div> -->

    <b-card tag="article" class="mb-2" width="600">
      <logo />
      <h3>SIGE</h3>
      <p class="text-secondary">
        Sistema de Gerenciamento de Empresas
      </p>
      <b-form v-if="show" @submit.prevent="login">
        <div>
          <span class="text-danger text-center">
            {{ authError }}
          </span>
        </div>
        <b-form-group
          id="email-group"
          label="Email address:"
          label-for="email"
          class="text-left"
          :class="{ 'form-group--error': $v.email.$error }"
        >
          <b-form-input
            id="email"
            v-model.trim="$v.email.$model"
            type="email"
            placeholder="Digite seu email"
          />
          <small v-if="!$v.email.required && $v.email.$dirty" class="text-danger">
            * Este campo é obrigatório
          </small>
        </b-form-group>
        <b-form-group
          id="password-group"
          label="Password:"
          label-for="password"
          class="text-left"
          :class="{ 'form-group--error': $v.email.$error }"
        >
          <b-form-input
            id="password"
            v-model.trim="$v.password.$model"
            type="password"
            placeholder="Enter password"
          />
          <small v-if="!$v.password.required && $v.password.$dirty" class="text-danger">
            * Este campo é obrigatório
          </small>
        </b-form-group>
        <b-overlay
          :show="busy"
          rounded
          opacity="0.6"
          spinner-small
          spinner-variant="success"
          class="d-inline-block col-md-12 m-0 p-0"
        >
          <b-button :disabled="busy" type="submit" block variant="success" class="col-md-12">
            Entrar
          </b-button>
        </b-overlay>
      </b-form>
    </b-card>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import Logo from '~/components/Logo.vue'

export default {
  layout: null,
  components: {
    Logo
  },
  data () {
    return {
      authError: null,
      show: true,
      email: '',
      password: '',
      busy: false
    }
  },
  validations: {
    email: {
      required
    },
    password: {
      required
    }
  },
  methods: {
    login () {
      this.$v.$touch()
      this.authError = null
      this.busy = true

      if (this.$v.$invalid) {
        return false
      }

      this.$store.dispatch('retrieveToken', { email: this.email, password: this.password })
        .then((response) => {
          window.location.href = '/home'
        })
        .catch(() => {
          this.authError = 'Failed Login'
          this.busy = false
        })
    }
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family:
    'Quicksand',
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
