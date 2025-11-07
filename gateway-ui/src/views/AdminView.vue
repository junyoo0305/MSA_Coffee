<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { Modal } from 'bootstrap'

interface User {
  id: number
  username: string
  email: string
  role: string
}

const users = ref<User[]>([])
const error = ref('')
const selectedUser = ref<User | null>(null)
const editModal = ref<Modal | null>(null)
const editForm = ref({
  username: '',
  email: '',
  role: ''
})

const fetchUsers = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      error.value = '인증 토큰이 없습니다.'
      return
    }

    const response = await axios.get('/api/admin/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    users.value = response.data
  } catch (err) {
    console.error('사용자 목록 조회 실패:', err)
    error.value = '사용자 목록을 불러오는데 실패했습니다.'
  }
}

const openEditModal = (user: User) => {
  selectedUser.value = user
  editForm.value = {
    username: user.username,
    email: user.email,
    role: user.role
  }
  editModal.value?.show()
}

const handleEdit = async () => {
  if (!selectedUser.value) return

  try {
    const token = localStorage.getItem('token')
    if (!token) {
      error.value = '인증 토큰이 없습니다.'
      return
    }

    await axios.put(`/api/admin/users/${selectedUser.value.id}`, editForm.value, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    await fetchUsers()
    editModal.value?.hide()
  } catch (err) {
    console.error('사용자 정보 수정 실패:', err)
    error.value = '사용자 정보 수정에 실패했습니다.'
  }
}

const handleDelete = async (userId: number) => {
  if (!confirm('정말로 이 사용자를 삭제하시겠습니까?')) return

  try {
    const token = localStorage.getItem('token')
    if (!token) {
      error.value = '인증 토큰이 없습니다.'
      return
    }

    await axios.delete(`/api/admin/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    await fetchUsers()
  } catch (err) {
    console.error('사용자 삭제 실패:', err)
    error.value = '사용자 삭제에 실패했습니다.'
  }
}

onMounted(async () => {
  const modalElement = document.getElementById('editUserModal')
  if (modalElement) {
    editModal.value = new Modal(modalElement)
  }
  await fetchUsers()
})
</script>

<template>
  <div class="container">
    <h2 class="mb-4">사용자 관리</h2>
    
    <div v-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <div class="card">
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>사용자명</th>
              <th>이메일</th>
              <th>역할</th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.username }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.role }}</td>
              <td>
                <button class="btn btn-sm btn-primary me-2" @click="openEditModal(user)">
                  수정
                </button>
                <button class="btn btn-sm btn-danger" @click="handleDelete(user.id)">
                  삭제
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 수정 모달 -->
    <div class="modal fade" id="editUserModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">사용자 정보 수정</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">사용자명</label>
              <input type="text" class="form-control" v-model="editForm.username">
            </div>
            <div class="mb-3">
              <label class="form-label">이메일</label>
              <input type="email" class="form-control" v-model="editForm.email">
            </div>
            <div class="mb-3">
              <label class="form-label">역할</label>
              <select class="form-select" v-model="editForm.role">
                <option value="USER">일반 사용자</option>
                <option value="ADMIN">관리자</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button>
            <button type="button" class="btn btn-primary" @click="handleEdit">저장</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.admin-title {
  margin-bottom: 2rem;
  color: var(--primary-color);
  font-weight: 700;
}

.table th {
  background-color: var(--background-color);
  font-weight: 600;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.modal-content {
  border-radius: 8px;
}

.modal-header {
  border-bottom: 1px solid var(--border-color);
}

.modal-footer {
  border-top: 1px solid var(--border-color);
}
</style> 