<template>
  <div class="container mt-10">
    <b-breadcrumb :items="breadcrumbItems" />
    <b-tabs content-class="mt-3">
      <b-tab title="Empresas" active>
        <b-button variant="success" class="mb-3" to="/company/new">
          <b-icon-building /> adicionar novo
        </b-button>
        <b-table
          id="company-table"
          striped
          hover
          small
          :items="itemsCompany"
          :fields="fieldsCompany"
        >
          <template v-slot:cell(logo)="data">
            <img v-if="data.item.logo" width="60" :src="'http://localhost:8000/storage/' + data.item.logo.replace('public/', '')">
          </template>
          <template v-slot:cell(actions)="data">
            <b-icon-person-plus style="cursor:pointer" class="text-primary" @click="addClient('/client/new/' + data.item.id)" />
            <b-icon-pencil style="cursor:pointer" class="text-primary" @click="edit('/company/edit/' + data.item.id)" />
            <b-icon-trash style="cursor:pointer" class="text-danger" @click="remove('/companies/' + data.item.id)" />
          </template>
        </b-table>
        <b-pagination
          v-model="currentPageCompany"
          aria-controls="company-table"
          :total-rows="totalRowsCompany"
          :per-page="perPageCompany"
          @input="clickedPage('company-table', currentPageCompany)"
        />
      </b-tab>
      <b-tab title="Funcionários">
        <b-table
          id="client-table"
          responsive
          striped
          hover
          small
          :items="itemsClient"
          :fields="fieldsClient"
        >
          <template v-slot:cell(company_id)="data">
            {{ data.item.company.name }}
          </template>
          <template v-slot:cell(actions)="data">
            <b-icon-pencil style="cursor:pointer" class="text-primary" @click="edit('/client/edit/' + data.item.id)" />
            <b-icon-trash style="cursor:pointer" class="text-danger" @click="remove('/clients/' + data.item.id)" />
          </template>
        </b-table>
        <b-pagination
          v-model="currentPageClient"
          aria-controls="client-table"
          :total-rows="totalRowsClient"
          :per-page="perPageClient"
          @input="clickedPage('client-table', currentPageClient)"
        />
      </b-tab>
      <b-tab title="Usuários">
        <b-button variant="success" class="mb-3" to="/user/new">
          <b-icon-person-plus-fill /> adicionar novo
        </b-button>
        <b-table
          id="user-table"
          striped
          hover
          small
          :items="items"
          :fields="fields"
        >
          <template v-slot:cell(actions)="data">
            <b-icon-pencil style="cursor:pointer" class="text-primary" @click="edit('user/edit/' + data.item.id)" />
            <b-icon-trash style="cursor:pointer" class="text-danger" @click="remove('/users/' + data.item.id)" />
          </template>
        </b-table>
        <b-pagination
          v-model="currentPageUser"
          aria-controls="user-table"
          :total-rows="totalRowsUser"
          :per-page="perPageUser"
          @input="clickedPage('user-table', currentPageUser)"
        />
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
export default {
  layout: 'main',
  data () {
    return {
      title: 'Home',
      items: [],
      itemsCompany: [],
      fields: [],
      fieldsCompany: [],
      itemsClient: [],
      fieldsClient: [],
      logo: '',
      currentPageCompany: 1,
      totalRowsCompany: 0,
      perPageCompany: 0,
      currentPageClient: 1,
      totalRowsClient: 0,
      perPageClient: 0,
      currentPageUser: 1,
      totalRowsUser: 0,
      perPageUser: 0,
      breadcrumbItems: [
        {
          text: 'Home',
          href: '#'
        }
      ]
    }
  },
  created () {
    this.getCompanies()
    this.getClients()
    this.getUsers()
  },
  methods: {
    clickedPage (table, page) {
      if (table === 'company-table') {
        this.getCompanies(page)
      } else if (table === 'client-table') {
        this.getClients(page)
      } else if (table === 'user-table') {
        this.getUsers(page)
      }
    },
    addClient (url) {
      this.$router.push(url)
    },
    edit (url) {
      this.$router.push(url)
    },
    async remove (url) {
      const token = localStorage.getItem('token')
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }

      await this.$axios.$delete(process.env.baseUrl + url, config).then((response) => {
        this.getCompanies()
        this.getUsers()
        this.getClients()
      })
    },
    async getCompanies (page = 1) {
      const token = localStorage.getItem('token')
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }

      await this.$axios.$get(process.env.baseUrl + '/companies/?page=' + page, config).then((response) => {
        this.currentPageCompany = page
        this.totalRowsCompany = response.total
        this.perPageCompany = response.per_page

        this.itemsCompany = response.data
        this.fieldsCompany = [
          {
            key: 'logo',
            label: 'Logo'
          },
          {
            key: 'name',
            label: 'Nome',
            sortable: true
          },
          {
            key: 'email',
            label: 'Email',
            sortable: true
          },
          {
            key: 'website',
            label: 'WebSite',
            sortable: true
          },
          {
            key: 'actions',
            label: 'Ações',
            sortable: false
          }
        ]
      })
    },
    async getUsers (page = 1) {
      const token = localStorage.getItem('token')
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }
      await this.$axios.$get(process.env.baseUrl + '/users/?page=' + page, config).then((response) => {
        this.currentPageUser = page
        this.totalRowsUser = response.total
        this.perPageUser = response.per_page

        this.items = response.data
        this.fields = [
          {
            key: 'id',
            label: '#',
            sortable: true
          },
          {
            key: 'name',
            label: 'Nome',
            sortable: true
          },
          {
            key: 'email',
            label: 'Email',
            sortable: true
          },
          {
            key: 'actions',
            label: 'Ações',
            sortable: false,
            width: '25px'
          }
        ]
      })
    },
    async getClients (page = 1) {
      const token = localStorage.getItem('token')
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }
      await this.$axios.$get(process.env.baseUrl + '/clients/?page=' + page, config).then((response) => {
        this.currentPageClient = page
        this.totalRowsClient = response.total
        this.perPageClient = response.per_page

        this.itemsClient = response.data
        this.fieldsClient = [
          {
            key: 'id',
            label: '#',
            sortable: true
          },
          {
            key: 'name',
            label: 'Nome',
            sortable: true
          },
          {
            key: 'email',
            label: 'Email',
            sortable: true
          },
          {
            key: 'personalNumber',
            label: 'CPF',
            sortable: true
          },
          {
            key: 'phone',
            label: 'Telefone',
            sortable: true
          },
          {
            key: 'company_id',
            label: 'Empresa',
            sortable: true
          },
          {
            key: 'zipcode',
            label: 'CEP',
            sortable: true
          },
          {
            key: 'address',
            label: 'Endereço',
            sortable: true
          },
          {
            key: 'houseNumber',
            label: 'Número',
            sortable: true
          },
          {
            key: 'neighborhood',
            label: 'Bairro',
            sortable: true
          },
          {
            key: 'city',
            label: 'Cidade',
            sortable: true
          },
          {
            key: 'state',
            label: 'Estado',
            sortable: true
          },
          {
            key: 'complement',
            label: 'Complemento',
            sortable: true
          },
          {
            key: 'actions',
            label: 'Ações',
            sortable: false
          }
        ]
      })
    }
  }
}
</script>
