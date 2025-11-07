<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { username, role } = storeToRefs(authStore)
</script>

<template>
  <div class="card">
    <div class="card-body">
      <h1 class="card-title text-center mb-4">MSA 프로젝트에 오신 것을 환영합니다</h1>
      
      <div v-if="username" class="text-center mb-4">
        <p class="lead">안녕하세요, {{ username }}님!</p>
        <p class="text-muted">현재 권한: {{ role }}</p>
      </div>
      
      <div class="row">
        <div class="col-md-4 mb-4">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">상품 관리</h5>
              <p class="card-text">상품 목록을 조회하고 관리할 수 있습니다.</p>
              <router-link to="/products" class="btn btn-primary">상품 관리</router-link>
            </div>
          </div>
        </div>
        
        <div class="col-md-4 mb-4">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">주문 관리</h5>
              <p class="card-text">주문 내역을 조회하고 관리할 수 있습니다.</p>
              <router-link to="/orders" class="btn btn-primary">주문 관리</router-link>
            </div>
          </div>
        </div>
        
        <div class="col-md-4 mb-4">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">게시판</h5>
              <p class="card-text">게시글을 작성하고 관리할 수 있습니다.</p>
              <router-link to="/board" class="btn btn-primary">게시판</router-link>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="role === 'ADMIN'" class="row">
        <div class="col-md-4">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">사용자 관리</h5>
              <p class="card-text">사용자 정보를 관리할 수 있습니다.</p>
              <router-link to="/admin" class="btn btn-primary">사용자 관리</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  border: none;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.card-title {
  color: #333;
}

.btn-primary {
  width: 100%;
}
</style> 