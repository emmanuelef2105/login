<template>
    <div>
        <nav>
    <button @click="logout">Cerrar sesión</button>
  </nav>
      <h1>Administración de Usuarios</h1>
  
      <h2>Crear Nuevo Usuario</h2>
      <form @submit.prevent="createNewUser">
        <input v-model="newUser.firstName" placeholder="Nombre" required />
        <input v-model="newUser.lastName" placeholder="Apellido" required />
        <input v-model="newUser.email" type="email" placeholder="Email" required />
        <input v-model="newUser.password" type="password" placeholder="Contraseña" required />
        <select v-model="newUser.role">
          <option value="desarrollador">Desarrollador</option>
          <option value="usuario">Usuario</option>
        </select>
        <button type="submit">Crear Usuario</button>
      </form>
  
      <h2>Lista de Usuarios</h2>
      <table border="1">
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Activo</th>
          <th>Acciones</th>
        </tr>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.first_name }}</td>
          <td>{{ user.last_name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>{{ user.active ? 'Sí' : 'No' }}</td>
          <td>
            <button @click="toggleActive(user)">{{ user.active ? 'Desactivar' : 'Activar' }}</button>
            <button @click="showUpdateForm(user)">Modificar</button>
          </td>
        </tr>
      </table>
  
      <!-- Modal sencillo para actualizar nombre/contraseña -->
      <div v-if="userToUpdate">
        <h3>Modificar Usuario</h3>
        <form @submit.prevent="updateUserInfo">
          <input v-model="updateData.firstName" placeholder="Nuevo Nombre" />
          <input v-model="updateData.lastName" placeholder="Nuevo Apellido" />
          <input v-model="updateData.password" type="password" placeholder="Nueva Contraseña" />
          <button type="submit">Guardar Cambios</button>
          <button @click="userToUpdate = null">Cancelar</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        users: [],
        newUser: {
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          role: 'usuario'
        },
        userToUpdate: null,
        updateData: {
          firstName: '',
          lastName: '',
          password: ''
        }
      }
    },
    async created() {
      await this.fetchUsers();
    },
    methods: {
      async fetchUsers() {
        const res = await fetch('/api/users'); // Debes asegurarte que el backend retorne todos los usuarios
        this.users = await res.json();
      },
      async createNewUser() {
        const res = await fetch('/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.newUser)
        });
        const data = await res.json();
        if (res.ok) {
          alert('Usuario creado con éxito');
          this.newUser = { firstName:'', lastName:'', email:'', password:'', role:'usuario' };
          await this.fetchUsers();
        } else {
          alert('Error: ' + data.error);
        }
      },
      async toggleActive(user) {
        const res = await fetch(`/api/users/${user.id}/active`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ active: !user.active })
        });
        const data = await res.json();
        if (res.ok) {
          await this.fetchUsers();
        } else {
          alert('Error: ' + data.error);
        }
      },
      showUpdateForm(user) {
        this.userToUpdate = user;
        this.updateData.firstName = user.first_name;
        this.updateData.lastName = user.last_name;
        this.updateData.password = '';
      },
      logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      this.$router.push('/login');
    },
      async updateUserInfo() {
        const res = await fetch(`/api/users/${this.userToUpdate.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: this.updateData.firstName,
            lastName: this.updateData.lastName,
            password: this.updateData.password || undefined
          })
        });
        const data = await res.json();
        if (res.ok) {
          alert('Usuario actualizado');
          this.userToUpdate = null;
          await this.fetchUsers();
        } else {
          alert('Error: ' + data.error);
        }
      }
    }
  }
  </script>
  