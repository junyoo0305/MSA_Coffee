<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const email = ref('')
const error = ref('')

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    error.value = '비밀번호가 일치하지 않습니다.'
    return
  }

  try {
    await axios.post('/api/auth/register', {
      username: username.value,
      password: password.value,
      email: email.value
    })
    router.push('/login')
  } catch (err: any) {
    error.value = err.response?.data?.message || '회원가입 중 오류가 발생했습니다.'
  }
}
</script>

<template>
  <div class="register-container">
    <h1 class="register-title">회원가입</h1>
    <div v-if="error" class="alert alert-danger">
      {{ error }}
    </div>
    <form @submit.prevent="handleRegister">
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
      <div class="mb-3">
        <label for="confirmPassword" class="form-label">비밀번호 확인</label>
        <input
          type="password"
          class="form-control"
          id="confirmPassword"
          v-model="confirmPassword"
          required
        />
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">이메일</label>
        <input
          type="email"
          class="form-control"
          id="email"
          v-model="email"
          required
        />
      </div>
      <button type="submit" class="btn btn-primary btn-register">회원가입</button>
    </form>
    <div class="login-link">
      이미 계정이 있으신가요? <router-link to="/login">로그인</router-link>
    </div>
  </div>
</template>

<style scoped>
.register-container {
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

.register-title {
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

.btn-register {
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

.btn-register:hover {
  background-color: #357abd;
  transform: translateY(-2px);
}

.login-link {
  text-align: center;
  margin-top: 1.5rem;
  color: var(--text-color);
}

.login-link a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.login-link a:hover {
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