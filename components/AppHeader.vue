<template>
  <!-- As a link -->
  <b-navbar type="dark" variant="info" class="mb-5">
    <b-navbar-brand href="#">
      SIGE
    </b-navbar-brand>
    <b-navbar-nav class="ml-auto">
      <b-nav-item active>
        <b-icon-person-circle />
        Olá {{ this.$store.state.me.name }}
      </b-nav-item>
      <b-nav-item active @click="logout">
        <b-icon-box-arrow-left />
        Sair
      </b-nav-item>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
export default {
  name: 'AppHeader',
  methods: {
    logout () {
      this.$store.dispatch('logoutUser').then((response) => {
        if (response) {
          this.$router.push('/')
        }
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error)
        this.$router.push('/')
      })
    }
  }
}
</script>
