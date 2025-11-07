<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
}

const products = ref<Product[]>([])
const showModal = ref(false)
const editingProduct = ref<Product | null>(null)
const form = ref({
  name: '',
  description: '',
  price: 0,
  stock: 0
})

const loadProducts = async () => {
  try {
    const response = await axios.get('/api/products')
    products.value = response.data
  } catch (error) {
    console.error('상품 목록을 불러오는데 실패했습니다:', error)
  }
}

const showAddProductModal = () => {
  editingProduct.value = null
  form.value = {
    name: '',
    description: '',
    price: 0,
    stock: 0
  }
  showModal.value = true
}

const showEditProductModal = (product: Product) => {
  editingProduct.value = product
  form.value = { ...product }
  showModal.value = true
}

const saveProduct = async () => {
  try {
    if (editingProduct.value) {
      await axios.put(`/api/products/${editingProduct.value.id}`, form.value)
    } else {
      await axios.post('/api/products', form.value)
    }
    showModal.value = false
    loadProducts()
  } catch (error) {
    console.error('상품 저장에 실패했습니다:', error)
  }
}

const deleteProduct = async (id: number) => {
  if (confirm('정말 삭제하시겠습니까?')) {
    try {
      await axios.delete(`/api/products/${id}`)
      loadProducts()
    } catch (error) {
      console.error('상품 삭제에 실패했습니다:', error)
    }
  }
}

onMounted(() => {
  loadProducts()
})
</script>

<template>
  <div class="card">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>상품 관리</h2>
      <button class="btn btn-primary" @click="showAddProductModal">상품 추가</button>
    </div>

    <div class="table-responsive">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>상품명</th>
            <th>설명</th>
            <th>가격</th>
            <th>재고</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td>{{ product.id }}</td>
            <td>{{ product.name }}</td>
            <td>{{ product.description }}</td>
            <td>{{ product.price }}</td>
            <td>{{ product.stock }}</td>
            <td>
              <button class="btn btn-sm btn-primary me-2" @click="showEditProductModal(product)">수정</button>
              <button class="btn btn-sm btn-danger" @click="deleteProduct(product.id)">삭제</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- 상품 추가/수정 모달 -->
  <div v-if="showModal" class="modal show d-block" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ editingProduct ? '상품 수정' : '상품 추가' }}</h5>
          <button type="button" class="btn-close" @click="showModal = false"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveProduct">
            <div class="mb-3">
              <label class="form-label">상품명</label>
              <input type="text" class="form-control" v-model="form.name" required>
            </div>
            <div class="mb-3">
              <label class="form-label">설명</label>
              <textarea class="form-control" v-model="form.description"></textarea>
            </div>
            <div class="mb-3">
              <label class="form-label">가격</label>
              <input type="number" class="form-control" v-model="form.price" required>
            </div>
            <div class="mb-3">
              <label class="form-label">재고</label>
              <input type="number" class="form-control" v-model="form.stock" required>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showModal = false">취소</button>
              <button type="submit" class="btn btn-primary">저장</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showModal" class="modal-backdrop show"></div>
</template> 