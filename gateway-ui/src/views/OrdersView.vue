<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

interface Order {
  id: number
  productId: number
  quantity: number
  totalPrice: number
  customerName: string
  customerEmail: string
  orderDate: string
  status: string
}

const orders = ref<Order[]>([])
const showModal = ref(false)
const editingOrder = ref<Order | null>(null)
const form = ref({
  productId: 0,
  quantity: 0,
  totalPrice: 0,
  customerName: '',
  customerEmail: ''
})

const loadOrders = async () => {
  try {
    const response = await axios.get('/api/orders')
    orders.value = response.data
  } catch (error) {
    console.error('주문 목록을 불러오는데 실패했습니다:', error)
  }
}

const showAddOrderModal = () => {
  editingOrder.value = null
  form.value = {
    productId: 0,
    quantity: 0,
    totalPrice: 0,
    customerName: '',
    customerEmail: ''
  }
  showModal.value = true
}

const showEditOrderModal = (order: Order) => {
  editingOrder.value = order
  form.value = {
    productId: order.productId,
    quantity: order.quantity,
    totalPrice: order.totalPrice,
    customerName: order.customerName,
    customerEmail: order.customerEmail
  }
  showModal.value = true
}

const saveOrder = async () => {
  try {
    if (editingOrder.value) {
      await axios.put(`/api/orders/${editingOrder.value.id}`, form.value)
    } else {
      await axios.post('/api/orders', form.value)
    }
    showModal.value = false
    loadOrders()
  } catch (error) {
    console.error('주문 저장에 실패했습니다:', error)
  }
}

const deleteOrder = async (id: number) => {
  if (confirm('정말 삭제하시겠습니까?')) {
    try {
      await axios.delete(`/api/orders/${id}`)
      loadOrders()
    } catch (error) {
      console.error('주문 삭제에 실패했습니다:', error)
    }
  }
}

onMounted(() => {
  loadOrders()
})
</script>

<template>
  <div class="card">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>주문 관리</h2>
      <button class="btn btn-primary" @click="showAddOrderModal">주문 추가</button>
    </div>

    <div class="table-responsive">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>상품 ID</th>
            <th>수량</th>
            <th>총 가격</th>
            <th>고객명</th>
            <th>이메일</th>
            <th>주문일</th>
            <th>상태</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>{{ order.productId }}</td>
            <td>{{ order.quantity }}</td>
            <td>{{ order.totalPrice }}</td>
            <td>{{ order.customerName }}</td>
            <td>{{ order.customerEmail }}</td>
            <td>{{ new Date(order.orderDate).toLocaleString() }}</td>
            <td>{{ order.status }}</td>
            <td>
              <button class="btn btn-sm btn-primary me-2" @click="showEditOrderModal(order)">수정</button>
              <button class="btn btn-sm btn-danger" @click="deleteOrder(order.id)">삭제</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- 주문 추가/수정 모달 -->
  <div v-if="showModal" class="modal show d-block" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ editingOrder ? '주문 수정' : '주문 추가' }}</h5>
          <button type="button" class="btn-close" @click="showModal = false"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveOrder">
            <div class="mb-3">
              <label class="form-label">상품 ID</label>
              <input type="number" class="form-control" v-model="form.productId" required>
            </div>
            <div class="mb-3">
              <label class="form-label">수량</label>
              <input type="number" class="form-control" v-model="form.quantity" required>
            </div>
            <div class="mb-3">
              <label class="form-label">총 가격</label>
              <input type="number" class="form-control" v-model="form.totalPrice" required>
            </div>
            <div class="mb-3">
              <label class="form-label">고객명</label>
              <input type="text" class="form-control" v-model="form.customerName" required>
            </div>
            <div class="mb-3">
              <label class="form-label">이메일</label>
              <input type="email" class="form-control" v-model="form.customerEmail" required>
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