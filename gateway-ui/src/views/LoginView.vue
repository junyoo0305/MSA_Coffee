<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const username = ref('')
const password = ref('')
const error = ref('')
const errorMessage = ref('')

const handleLogin = async () => {
  try {
    const success = await authStore.loginWithCredentials(username.value, password.value)
    if (success) {
      router.push('/')
    } else {
      errorMessage.value = '로그인에 실패했습니다. 사용자명과 비밀번호를 확인해주세요.'
    }
  } catch (error) {
    console.error('로그인 실패:', error)
    errorMessage.value = '로그인에 실패했습니다. 사용자명과 비밀번호를 확인해주세요.'
  }
}
</script>

<template>
  <div class="login-container">
    <h1 class="login-title">로그인</h1>
    <div v-if="error" class="alert alert-danger">
      {{ error }}
    </div>
    <form @submit.prevent="handleLogin">
      <div class="mb-3">
        <label for="username" class="form-label">아이디</label>
        <input
          type="text"
          class="form-control"
          id="username"
          v-model="username"
          required
        />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">비밀번호</label>
        <input
          type="password"
          class="form-control"
          id="password"
          v-model="password"
          required
        />
      </div>
      <button type="submit" class="btn btn-primary btn-login">로그인</button>
    </form>
    <div class="register-link">
      계정이 없으신가요? <router-link to="/register">회원가입</router-link>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 800px;
  width: 100%;
  margin: 2rem auto;
  padding: 4rem;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-title {
  text-align: center;
  margin-bottom: 2.5rem;
  color: var(--primary-color);
  font-weight: 700;
  font-size: 2.5rem;
}

.form-label {
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.form-control {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.2rem rgba(74, 144, 226, 0.25);
}

.btn-login {
  width: 100%;
  padding: 0.75rem;
  font-weight: 500;
  font-size: 1.1rem;
  margin-top: 1rem;
  background-color: var(--primary-color);
  border: none;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.btn-login:hover {
  background-color: #357abd;
  transform: translateY(-2px);
}

.register-link {
  text-align: center;
  margin-top: 1.5rem;
  color: var(--text-color);
}

.register-link a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.register-link a:hover {
  color: #357abd;
}

.alert-danger {
  background-color: #fff5f5;
  border: 1px solid #feb2b2;
  color: #c53030;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

form {
  width: 100%;
  max-width: 500px;
}
</style> 