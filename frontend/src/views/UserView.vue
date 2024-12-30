<template>
    <div>
        <nav>
    <button @click="logout">Cerrar sesión</button>
  </nav>
      <h1>Perfil de Usuario</h1>
      <p>Modifica tu nombre y contraseña.</p>
      <form @submit.prevent="updateMyInfo">
        <input v-model="firstName" placeholder="Nombre" />
        <input v-model="lastName" placeholder="Apellido" />
        <input v-model="password" type="password" placeholder="Nueva Contraseña (opcional)" />
        <button type="submit">Guardar</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        userId: null,
        firstName: '',
        lastName: '',
        password: ''
      }
    },
    async created() {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        this.$router.push('/login');
        return;
      }
  
      this.userId = user.id;
      const res = await fetch(`/api/users/${this.userId}`);
      const data = await res.json();
      if (res.ok) {
        this.firstName = data.first_name;
        this.lastName = data.last_name;
      } else {
        alert('Error obteniendo datos del usuario');
      }
    },
    methods: {
      async updateMyInfo() {
        const res = await fetch(`/api/users/${this.userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: this.firstName,
            lastName: this.lastName,
            password: this.password || undefined
          })
        });
        const data = await res.json();
        if (res.ok) {
          alert('Datos actualizados con éxito');
        } else {
          alert('Error: ' + data.error);
        }
      },
      logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      this.$router.push('/login');
    }
    }
  }
  </script>
  