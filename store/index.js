export const state = () => ({
  token: localStorage.getItem('token') || null,
  me: []
})

export const mutations = {
  retrieveToken (state, token) {
    state.token = token
  },
  retrieveLoggedUser (state, user) {
    state.me = user
  },
  logoutUser (state) {
    state.token = ''
  }
}

export const actions = {

  retrieveToken (context, credentials) {
    return new Promise((resolve, reject) => {
      this.$axios.$post(process.env.baseUrl + '/login', credentials)
        .then((response) => {
          const token = response.access_token

          localStorage.setItem('token', token)
          context.commit('retrieveToken', token)

          resolve(token)
        })
        .catch((error) => {
          localStorage.removeItem('token')
          context.commit('retrieveToken', null)
          // eslint-disable-next-line no-console
          console.log(error)
          reject(error)
        })
    })
  },

  retrieveLoggedUser (context) {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('token')
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }
      this.$axios.$post(process.env.baseUrl + '/me', [], config).then((response) => {
        context.commit('retrieveLoggedUser', response)
        resolve(response)
      }).catch((error) => {
        localStorage.removeItem('token')
        context.commit('retrieveToken', null)

        // eslint-disable-next-line no-console
        console.log(error)

        reject(error)
      })
    })
  },

  logoutUser (context) {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('token')
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }
      this.$axios.$post(process.env.baseUrl + '/logout', [], config).then((response) => {
        context.commit('logoutUser', response)
        localStorage.removeItem('token')
        resolve(response)
      }).catch((error) => {
        localStorage.removeItem('token')
        context.commit('retrieveToken', null)

        // eslint-disable-next-line no-console
        console.log(error)

        reject(error)
      })
    })
  }
}

export const getters = {
  loggedIn (state) {
    return state.token !== null
  }
}
