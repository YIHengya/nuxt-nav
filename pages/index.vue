<template>
  <div class="container">
    <input v-model="searchQuery" placeholder="搜索关键词..." class="search-input" />
    <div v-if="categories" class="navigation">
      <div class="category-container">
        <CategoryItem 
          :isCurrentButton="currentCategory === 'all'" 
          @click="setCurrentCategory('all')"
        >
          全部工具
        </CategoryItem>
      </div>
      <div v-for="(category, index) in categories" :key="category.category" class="category-container">
        <CategoryItem 
          :isCurrentButton="currentCategory === index" 
          @click="setCurrentCategory(index)"
        >
          {{ category.category }}
        </CategoryItem>
      </div>
    </div>
    <div class="scrollable-container pt-2">
      <LinkCard 
        class="link-card" 
        v-for="link in filteredLinks" 
        :key="link.name" 
        :link="link" 
        :icon="link.icon" 
        :url="link.url"
      >
        {{link.name}}
      </LinkCard>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const { body: categories } = await queryContent('/data').findOne()
const currentCategory = ref('all')
const searchQuery = ref('')

const setCurrentCategory = (index) => {
  currentCategory.value = index
}

const allLinks = computed(() => {
  return categories.flatMap(category => category.links)
})

const filteredLinks = computed(() => {
  const links = currentCategory.value === 'all' ? allLinks.value : categories[currentCategory.value].links
  if (!searchQuery.value) {
    return links
  }
  return links.filter(link =>
    link.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// 监听 searchQuery 的变化
watch(searchQuery, (newValue) => {
  if (newValue && currentCategory.value !== 'all') {
    currentCategory.value = 'all'
  }
})
</script>

<style scoped>
.container {
  margin-top: 10px;
}

.search-input {
  width: 100%;
  padding: 8px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.scrollable-container {
  display: flex;
  flex-wrap: wrap;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 10px;
}

.link-card {
  margin: 2px;
  flex: 0 0 calc(33.333% - 4px);
  max-width: calc(33.333% - 4px);
}

.scrollable-container::-webkit-scrollbar {
  width: 8px;
}

.scrollable-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.scrollable-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.scrollable-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.navigation {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.category-container {
  text-align: center;
  padding-right: 4px;
  margin-bottom: 4px;
}

@media (max-width: 768px) {
  .link-card {
    flex: 0 0 calc(50% - 4px);
    max-width: calc(50% - 4px);
  }
}

@media (max-width: 480px) {
  .link-card {
    flex: 0 0 100%;
    max-width: 100%;
  }
}
</style>