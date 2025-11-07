<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const title = ref('')
const content = ref('')

const handleSubmit = async () => {
  try {
    await axios.post('/api/posts', {
      title: title.value,
      content: content.value
    })
    router.push('/board')
  } catch (error) {
    console.error('게시글 작성에 실패했습니다:', error)
  }
}
</script>

<template>
  <div class="card">
    <h2 class="mb-4">글쓰기</h2>
    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label for="title" class="form-label">제목</label>
        <input
          type="text"
          class="form-control"
          id="title"
          v-model="title"
          required
        >
      </div>
      <div class="mb-3">
        <label for="content" class="form-label">내용</label>
        <textarea
          class="form-control"
          id="content"
          v-model="content"
          rows="10"
          required
        ></textarea>
      </div>
      <div class="d-flex gap-2">
        <button type="submit" class="btn btn-primary">저장</button>
        <router-link to="/board" class="btn btn-secondary">취소</router-link>
      </div>
    </form>
  </div>
</template> 