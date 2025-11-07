<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useAuthStore } from './stores/auth'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { isAuthenticated, username, role } = storeToRefs(authStore)

// 로그인 상태 변경 감지
watch(() => authStore.isAuthenticated, (newValue) => {
  if (newValue) {
    username.value = localStorage.getItem('username') || ''
    role.value = localStorage.getItem('role') || ''
  } else {
    username.value = ''
    role.value = ''
  }
})

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  localStorage.removeItem('role')
  authStore.logout()
}

onMounted(() => {
  const token = localStorage.getItem('token')
  if (token) {
    authStore.setAuth({
      isAuthenticated: true,
      username: localStorage.getItem('username') || '',
      role: localStorage.getItem('role') || ''
    })
  }
})
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
    <div class="container">
      <router-link class="navbar-brand" to="/">MSA 프로젝트</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/products">상품</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/orders">주문</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/board">게시판</router-link>
          </li>
          <li v-if="role === 'ADMIN'" class="nav-item">
            <router-link class="nav-link" to="/admin">관리자</router-link>
          </li>
        </ul>
        <ul class="navbar-nav">
          <template v-if="isAuthenticated">
            <li class="nav-item">
              <span class="nav-link">{{ username }} ({{ role }})</span>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" @click.prevent="handleLogout">로그아웃</a>
            </li>
          </template>
          <template v-else>
            <li class="nav-item">
              <router-link class="nav-link" to="/login">로그인</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/register">회원가입</router-link>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>

  <div class="container main-content">
    <router-view></router-view>
  </div>
</template>

<style>
:root {
  --primary-color: #4a90e2;
  --secondary-color: #6c757d;
  --accent-color: #ff6b6b;
  --background-color: #f8f9fa;
  --text-color: #333;
  --border-color: #dee2e6;
}

body {
  margin: 0;
  padding: 0;
  background-color: var(--background-color);
  font-family: 'Noto Sans KR', sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

#app {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.navbar {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 1rem 0;
  width: 100%;
}

.navbar-brand {
  font-weight: 700;
  color: var(--primary-color);
  font-size: 1.5rem;
  text-decoration: none;
}

.nav-link {
  color: var(--text-color);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: var(--primary-color);
  background-color: rgba(74, 144, 226, 0.1);
}

.nav-link.active {
  color: var(--primary-color);
  font-weight: 500;
}

.container {
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 0;
}

.card {
  background: white;
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  padding: 2rem;
  margin-bottom: 2rem;
}

.btn-primary {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  padding: 0.5rem 1.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: #357abd;
  border-color: #357abd;
  transform: translateY(-1px);
}

.btn-secondary {
  background-color: var(--secondary-color);
  border-color: var(--secondary-color);
  padding: 0.5rem 1.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background-color: #243342;
  border-color: #243342;
  transform: translateY(-1px);
}

.table {
  margin-bottom: 0;
}

.table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: var(--text-color);
  border-bottom: 2px solid var(--border-color);
}

.table td {
  vertical-align: middle;
  border-bottom: 1px solid var(--border-color);
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

.alert {
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.main-content {
  margin-top: 80px;
  padding-top: 2rem;
  min-height: calc(100vh - 80px);
}

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }
  
  .card {
    padding: 1rem;
  }
  
  .navbar {
    padding: 0.5rem 0;
  }

  .main-content {
    margin-top: 60px;
    padding-top: 1rem;
  }
}
</style>
