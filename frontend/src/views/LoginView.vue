<template>
    <div>
      <h1>Login</h1>
      <form @submit.prevent="login">
        <input v-model="email" type="text" placeholder="Email" />
        <input v-model="password" type="password" placeholder="Password" />
        <button type="submit">Iniciar Sesión</button>
      </form>
      <div v-if="error">{{ error }}</div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        email: '',
        password: '',
        error: null
      }
    },
    methods: {
      async login() {
        try {
          const res = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: this.email, password: this.password })
          });
          const data = await res.json();
          if (!res.ok) {
            this.error = data.error;
          } else {
            localStorage.setItem('user', JSON.stringify(data.user));
            if (data.user.role === 'desarrollador') {
              this.$router.push('/admin');
            } else {
              this.$router.push('/user');
            }
          }
        } catch (err) {
          console.error(err);
          this.error = 'Error al conectar con el servidor';
        }
      }
    }
  }
  </script>
  