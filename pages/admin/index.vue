<template>
  <v-container class="admin-panel">
    <v-row class="admin-panel-header">
      <v-col cols="6">
        <span>当前共：{{ categories.length }}条</span>
      </v-col>
      <v-col cols="6" class="text-right">
        <button style="color:#1677FF" class="m-1" @click="openAddDialog">添加</button>
        <button style="color:#1677FF" class="ml-3" @click="handleRefresh" :disabled="isLoading">
          {{ isLoading ? '刷新中...' : '刷新' }}
        </button>
      </v-col>
    </v-row>
    <v-table>
      <thead>
        <tr>
          <th>分类名称</th>
          <th>描述</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(category, index) in categories" :key="category.id">
          <td>{{ category.category }}</td>
          <td>{{ category.description }}</td>
          <td>
            <button style="color:#1677FF" class="mr-2" @click="openEditDialog(index)">编辑</button>
            <button style="color:#1677FF" class="mr-2" @click="deleteCategory(category.id)">删除</button>
          </td>
        </tr>
      </tbody>
    </v-table>
    <!-- Vuetify Dialog -->
    <v-dialog v-model="showAddDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ isEditMode ? '编辑分类' : '添加分类' }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="newCategory" label="分类名称" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="newDescription" label="描述" required></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showAddDialog = false">取消</v-btn>
          <v-btn @click="isEditMode ? handleEditCategory() : handleAddCategory()">
            {{ isEditMode ? '保存更改' : '添加分类' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'admin-layout'
})

const showAddDialog = ref(false)
const isLoading = ref(false)
const newCategory = ref('')
const newDescription = ref('')
const isEditMode = ref(false)
const currentCategoryId = ref(null)

// 将 categories 变成 ref
const categories = ref([])

// 创建一个异步函数来获取最新的 category 数据
const fetchCategories = async () => {
  try {
    const { body } = await queryContent('/data').findOne()
    categories.value = body
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

// 初始化时获取数据
fetchCategories()

// 修改 handleRefresh 函数
async function handleRefresh() {
  console.log('刷新操作')
  isLoading.value = true
  await fetchCategories()
  isLoading.value = false
}

const addCategory = async (category: string, description: string) => {
  isLoading.value = true

  try {
    const { data, error } = await useFetch('/api/data-manager', {
      method: 'POST',
      server: false,
      key: "data-manager",
      body: {
        action: 'addCategory',
        data: { category, description }
      }
    })

    if (error.value) {
      throw new Error(error.value.message)
    }

    // 添加成功后刷新数据
    await fetchCategories()

  } catch (error) {
    console.error('Error calling API:', error)
  } finally {
    showAddDialog.value = false
    isLoading.value = false
  }
}

const handleAddCategory = () => {
  addCategory(newCategory.value, newDescription.value)
  newCategory.value = ''
  newDescription.value = ''
}

const openAddDialog = () => {
  newCategory.value = ''
  newDescription.value = ''
  isEditMode.value = false
  showAddDialog.value = true
}

const openEditDialog = (index: number) => {
  const category = categories.value[index]
  newCategory.value = category.category
  newDescription.value = category.description
  currentCategoryId.value = category.id
  isEditMode.value = true
  showAddDialog.value = true
}

const handleEditCategory = async () => {
  isLoading.value = true

  try {
    const { data, error } = await useFetch('/api/data-manager', {
      method: 'POST',
      server: false,
      key: "data-manager",
      body: {
        action: 'editCategory',
        data: { id: currentCategoryId.value, category: newCategory.value, description: newDescription.value }
      }
    })

    if (error.value) {
      throw new Error(error.value.message)
    }

    // 编辑成功后刷新数据
    await fetchCategories()

  } catch (error) {
    console.error('Error calling API:', error)
  } finally {
    showAddDialog.value = false
    isLoading.value = false
  }
}

const deleteCategory = async (id: string) => {
  try {
    const { data, error } = await useFetch('/api/data-manager', {
      method: 'POST',
      server: false,
      key: "data-manager",
      body: {
        action: 'deleteCategory',
        data: { id }
      }
    })

    if (error.value) {
      throw new Error(error.value.message)
    }

    // 删除成功后刷新数据
    await fetchCategories()

  } catch (error) {
    console.error('Error calling API:', error)
  } finally {
    showAddDialog.value = false
    isLoading.value = false
  }

  console.log('删除分类:', id)
}
</script>

<style scoped>
.admin-panel-header bottom {
  margin: 5px;
}
</style>
