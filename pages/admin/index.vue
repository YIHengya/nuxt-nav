<template>
  <div>
    <button
      @click="handleAddCategory"
      :disabled="isLoading"
    >
      {{ isLoading ? '添加中...' : '添加测试类别' }}
    </button>
    <div v-if="result">
      <p>{{ result.success ? '添加成功！' : '添加失败！' }}</p>
      <p>{{ result.message }}</p>
      <pre v-if="result.data">{{ JSON.stringify(result.data, null, 2) }}</pre>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'admin-layout'
})

const isLoading = ref(false)
const result = ref(null)

const addCategory = async (category: string, description: string) => {
  isLoading.value = true

  try {
    const { data, error } = await useFetch('/api/data-manager', {
      method: 'POST',
      body: {
        action: 'addCategory',
        data: { category, description }
      }
    })

    if (error.value) {
      throw new Error(error.value.message)
    }

    result.value = data.value
    console.log('API Response:', data.value)
  } catch (error) {
    result.value = {
      success: false,
      message: '调用 API 时发生错误',
      error: error.toString()
    }
    console.error('Error calling API:', error)
  } finally {
    isLoading.value = false
  }
}

const handleAddCategory = () => {
  addCategory('测试类别', '这是一个测试类别的描述')
}
</script>

<style scoped>
button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

pre {
  background-color: #f4f4f4;
  padding: 10px;
  border-radius: 4px;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
