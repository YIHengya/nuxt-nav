<template>
  <v-container class="admin-panel">
    <v-row class="admin-panel-header">
      <v-col cols="4">
        <span>当前共：{{ tools.length }}条</span>
      </v-col>
      <v-col cols="4">
        <v-select
          v-model="selectedCategory"
          :items="categoryOptions"
          item-title="category"
          item-value="id"
          label="选择分类"
          @update:model-value="filterTools"
          density="compact"
        ></v-select>
      </v-col>
      <v-col cols="4" class="text-right">
        <button style="color:#1677FF" class="m-1" @click="openAddDialog">添加</button>
        <button style="color:#1677FF" class="ml-3" @click="handleRefresh" :disabled="isLoading">
          {{ isLoading ? '刷新中...' : '刷新' }}
        </button>
      </v-col>
    </v-row>
    
    <!-- Tools Table -->
    <v-table v-if="filteredTools.length > 0" class="mt-4">
      <thead>
        <tr>
          <th>工具名称</th>
          <th>描述</th>
          <th>链接</th>
          <th>图标</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tool in filteredTools" :key="tool.name">
          <td>{{ tool.name }}</td>
          <td :title="tool.description">
            {{ truncateDescription(tool.description) }}
          </td>
          <td>{{ tool.url }}</td>
          <td>
            <img :src="tool.icon" alt="工具图标" style="width: 24px; height: 24px;" />
          </td>
          <td>
            <button style="color:#1677FF" class="mr-2" @click="openEditDialog(tool)">编辑</button>
            <button style="color:#1677FF" class="mr-2" @click="deleteTool(tool.id)">删除</button>
          </td>
        </tr>
      </tbody>
    </v-table>
    
    <!-- Vuetify Dialog -->
    <v-dialog v-model="showAddDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ isEditMode ? '编辑工具' : '添加工具' }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="newTool.name" label="工具名称" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="newTool.description" label="描述" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="newTool.url" label="链接" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="newTool.icon" label="图标链接" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="newTool.categoryId"
                  :items="categories"
                  item-title="category"
                  item-value="id"
                  label="选择分类"
                  required
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showAddDialog = false">取消</v-btn>
          <v-btn @click="isEditMode ? handleEditTool() : handleAddTool()">
            {{ isEditMode ? '保存更改' : '添加工具' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'admin-layout'
})

const showAddDialog = ref(false)
const isLoading = ref(false)
const isEditMode = ref(false)
const selectedCategory = ref(null)

const categories = ref([])
const tools = ref([])

const newTool = ref({
  id: null,
  name: '',
  description: '',
  url: '',
  icon: '',
  categoryId: null
})

// 获取最新的数据
const fetchData = async () => {
  try {
    const { body } = await queryContent('/data').findOne()
    categories.value = body
    tools.value = categories.value.flatMap((category: { links: any; id: any }) => 
      (category.links || []).map((link: any) => ({...link, categoryId: category.id}))
    )
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

// 初始化时获取数据
fetchData()

// 刷新函数
async function handleRefresh() {
  isLoading.value = true
  await fetchData()
  isLoading.value = false
}

// 计算属性：分类选项
const categoryOptions = computed(() => {
  return [{ id: null, category: '全部分类' }, ...categories.value]
})

// 计算属性：过滤后的工具
const filteredTools = computed(() => {
  if (!selectedCategory.value) {
    return tools.value
  }
  return tools.value.filter((tool: { categoryId: any }) => tool.categoryId === selectedCategory.value)
})

const addTool = async (tool: any) => {
  isLoading.value = true
  console.log('add tool:', tool)

  try {
    const { data, error } = await useFetch('/api/data-manager', {
      method: 'POST',
      server: false,
      key: "data-manager",
      body: {
        action: 'addTool',
        data: tool
      }
    })

    if (error.value) {
      throw new Error(error.value.message)
    }

    // 添加成功后刷新数据
    await fetchData()

  } catch (error) {
    console.error('Error calling API:', error)
  } finally {
    showAddDialog.value = false
    isLoading.value = false
  }
}

const handleAddTool = () => {
  addTool(newTool.value)
  resetNewTool()
}

const openAddDialog = () => {
  resetNewTool()
  isEditMode.value = false
  showAddDialog.value = true
}

const openEditDialog = (tool: any) => {
  newTool.value = { ...tool }
  isEditMode.value = true
  showAddDialog.value = true
}

const handleEditTool = async () => {
  isLoading.value = true

  try {
    const { data, error } = await useFetch('/api/data-manager', {
      method: 'POST',
      server: false,
      key: "data-manager",
      body: {
        action: 'editTool',
        data: newTool.value
      }
    })

    if (error.value) {
      throw new Error(error.value.message)
    }

    // 编辑成功后刷新数据
    await fetchData()

  } catch (error) {
    console.error('Error calling API:', error)
  } finally {
    showAddDialog.value = false
    isLoading.value = false
  }
}

const deleteTool = async (id: string) => {
  try {
    console.log(id)
    const { data, error } = await useFetch('/api/data-manager', {
      method: 'POST',
      server: false,
      key: "data-manager",
      body: {
        action: 'deleteTool',
        data: { id }
      }
    })

    if (error.value) {
      throw new Error(error.value.message)
    }

    // 删除成功后刷新数据
    await fetchData()

  } catch (error) {
    console.error('Error calling API:', error)
  }
}

// 重置新工具的数据
const resetNewTool = () => {
  newTool.value = {
    id: null,
    name: '',
    description: '',
    url: '',
    icon: '',
    categoryId: null
  }
}

// 截断描述方法
const truncateDescription = (description: string) => {
  if (description.length <= 30) {
    return description;
  }
  return description.slice(0, 30) + '...';
}
</script>

<style scoped>
.v-table td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px; /* 或者根据需要调整 */
}
</style>