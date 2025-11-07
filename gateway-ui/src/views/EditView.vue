<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

interface Post {
  id: number
  title: string
  content: string
}

const route = useRoute()
const router = useRouter()
const title = ref('')
const content = ref('')

const loadPost = async () => {
  try {
    const response = await axios.get(`/api/posts/${route.params.id}`)
    title.value = response.data.title
    content.value = response.data.content
  } catch (error) {
    console.error('게시글을 불러오는데 실패했습니다:', error)
  }
}

const handleSubmit = async () => {
  try {
    await axios.put(`/api/posts/${route.params.id}`, {
      title: title.value,
      content: content.value
    })
    router.push(`/board/${route.params.id}`)
  } catch (error) {
    console.error('게시글 수정에 실패했습니다:', error)
  }
}

onMounted(() => {
  loadPost()
})
</script>

<template>
  <div class="card">
    <h2 class="mb-4">게시글 수정</h2>
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
        <button type="submit" class="btn btn-primary">수정</button>
        <router-link :to="`/board/${route.params.id}`" class="btn btn-secondary">취소</router-link>
      </div>
    </form>
  </div>
</template> 