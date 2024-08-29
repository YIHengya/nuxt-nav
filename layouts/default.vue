<template>
  <div class="container">
    <div v-if="categories" class="navigation">
      <div v-for="(category, index) in categories" :key="category.category" class="category-container">
        <CategoryItem 
          :isCurrentButton="currentCategory == index" 
          @click="setCurrentCategory(index)"
        >
          {{ category.category }}
        </CategoryItem>
      </div>
    </div>
    <slot />
  </div>
</template>

<script lang="ts" setup>

const { body: categories } = await queryContent('/data').findOne()
const currentCategory = ref(0)  // -1 means no category is selected initially
const setCurrentCategory = (index: number) => {
  currentCategory.value = index
}

provide("currentCategory", currentCategory)

</script>

<style scoped>
.container {
  padding: 100px;
}

.navigation {
  display: flex;
}

.category-container {
  text-align: center;
  padding-right: 4px;
}
</style>
