import { defineStore } from 'pinia'
import axios from 'axios'

interface AuthState {
  token: string | null
  username: string | null
  role: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('token'),
    username: localStorage.getItem('username'),
    role: localStorage.getItem('role')
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.role === 'ADMIN'
  },

  actions: {
    setAuth(auth: { isAuthenticated: boolean; username: string; role: string }) {
      this.token = auth.isAuthenticated ? localStorage.getItem('token') : null
      this.username = auth.username
      this.role = auth.role
    },

    login(token: string, username: string, role: string) {
      this.token = token
      this.username = username
      this.role = role
      localStorage.setItem('token', token)
      localStorage.setItem('username', username)
      localStorage.setItem('role', role)
    },

    async loginWithCredentials(username: string, password: string) {
      try {
        const response = await axios.post('/api/auth/login', { username, password })
        const { token, role } = response.data
        this.login(token, username, role)
        return true
      } catch (error) {
        console.error('Login failed:', error)
        return false
      }
    },

    async register(username: string, password: string, email: string) {
      try {
        await axios.post('/api/auth/register', { username, password, email })
        return true
      } catch (error) {
        console.error('Registration failed:', error)
        return false
      }
    },

    logout() {
      this.token = null
      this.username = null
      this.role = null
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('role')
    }
  }
}) 