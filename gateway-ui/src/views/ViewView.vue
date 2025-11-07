<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

interface Post {
  id: number
  title: string
  content: string
  createdAt: string
}

interface Comment {
  id: number
  content: string
  createdAt: string
}

const route = useRoute()
const router = useRouter()
const post = ref<Post | null>(null)
const comments = ref<Comment[]>([])
const newComment = ref('')

const loadPost = async () => {
  try {
    const response = await axios.get(`/api/posts/${route.params.id}`)
    post.value = response.data
    loadComments()
  } catch (error) {
    console.error('게시글을 불러오는데 실패했습니다:', error)
  }
}

const loadComments = async () => {
  try {
    const response = await axios.get(`/api/posts/${route.params.id}/comments`)
    comments.value = response.data
  } catch (error) {
    console.error('댓글을 불러오는데 실패했습니다:', error)
  }
}

const handleCommentSubmit = async () => {
  try {
    await axios.post(`/api/posts/${route.params.id}/comments`, {
      content: newComment.value
    })
    newComment.value = ''
    loadComments()
  } catch (error) {
    console.error('댓글 작성에 실패했습니다:', error)
  }
}

const deleteComment = async (commentId: number) => {
  if (confirm('댓글을 삭제하시겠습니까?')) {
    try {
      await axios.delete(`/api/posts/${route.params.id}/comments/${commentId}`)
      loadComments()
    } catch (error) {
      console.error('댓글 삭제에 실패했습니다:', error)
    }
  }
}

const deletePost = async () => {
  if (confirm('게시글을 삭제하시겠습니까?')) {
    try {
      await axios.delete(`/api/posts/${route.params.id}`)
      router.push('/board')
    } catch (error) {
      console.error('게시글 삭제에 실패했습니다:', error)
    }
  }
}

onMounted(() => {
  loadPost()
})
</script>

<template>
  <div v-if="post" class="card">
    <div class="card-body">
      <h2 class="card-title">{{ post.title }}</h2>
      <p class="text-muted mb-4">{{ new Date(post.createdAt).toLocaleString() }}</p>
      <div class="card-text mb-4">{{ post.content }}</div>
      <div class="d-flex gap-2">
        <router-link :to="`/board/${post.id}/edit`" class="btn btn-primary">수정</router-link>
        <button class="btn btn-danger" @click="deletePost">삭제</button>
        <router-link to="/board" class="btn btn-secondary">목록</router-link>
      </div>
    </div>
  </div>

  <div class="card mt-4">
    <div class="card-body">
      <h3 class="card-title">댓글</h3>
      <form @submit.prevent="handleCommentSubmit" class="mb-4">
        <div class="mb-3">
          <textarea
            class="form-control"
            v-model="newComment"
            rows="3"
            placeholder="댓글을 입력하세요"
            required
          ></textarea>
        </div>
        <button type="submit" class="btn btn-primary">댓글 작성</button>
      </form>

      <div class="comments">
        <div v-for="comment in comments" :key="comment.id" class="card mb-2">
          <div class="card-body">
            <p class="card-text">{{ comment.content }}</p>
            <div class="d-flex justify-content-between align-items-center">
              <small class="text-muted">{{ new Date(comment.createdAt).toLocaleString() }}</small>
              <button class="btn btn-sm btn-danger" @click="deleteComment(comment.id)">삭제</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 