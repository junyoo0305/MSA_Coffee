<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

interface Post {
  id: number
  title: string
  createdAt: string
}

const router = useRouter()
const posts = ref<Post[]>([])
const currentPage = ref(0)
const totalPages = ref(0)

const loadPosts = async (page: number) => {
  try {
    const response = await axios.get(`/api/posts?page=${page}`)
    posts.value = response.data.content
    currentPage.value = response.data.number
    totalPages.value = response.data.totalPages
  } catch (error) {
    console.error('게시글 목록을 불러오는데 실패했습니다:', error)
  }
}

const goToPage = (page: number) => {
  loadPosts(page)
}

onMounted(() => {
  loadPosts(0)
})
</script>

<template>
  <div class="card">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>게시판</h2>
      <router-link to="/board/write" class="btn btn-primary">글쓰기</router-link>
    </div>

    <div class="table-responsive">
      <table class="table">
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="post in posts" :key="post.id">
            <td>{{ post.id }}</td>
            <td>
              <router-link :to="`/board/${post.id}`">{{ post.title }}</router-link>
            </td>
            <td>{{ new Date(post.createdAt).toLocaleDateString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <nav v-if="totalPages > 1">
      <ul class="pagination justify-content-center">
        <li
          v-for="page in totalPages"
          :key="page"
          class="page-item"
          :class="{ active: page - 1 === currentPage }"
        >
          <a class="page-link" href="#" @click.prevent="goToPage(page - 1)">{{ page }}</a>
        </li>
      </ul>
    </nav>
  </div>
</template> 