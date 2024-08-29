<template>
  <div class="container">
    <div class="scrollable-container">
      <LinkCard 
        class="link-card" 
        v-for="link in categories[currentCategory].links" 
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
import { inject } from 'vue'
const { body: categories } = await queryContent('/data').findOne()

const currentCategory = inject('currentCategory')
</script>

<style scoped>
.container {
  margin-top: 10px;
}

.scrollable-container {
  display: flex;
  flex-wrap: wrap;
  max-height: 400px; /* 设置一个固定的最大高度 */
  overflow-y: auto; /* 允许垂直滚动 */
  padding-right: 10px; /* 为滚动条留出空间 */
}

.link-card {
  margin: 2px;
  flex: 0 0 calc(33.333% - 4px); /* 假设每行显示3个卡片，可以根据需要调整 */
  max-width: calc(33.333% - 4px);
}

/* 自定义滚动条样式（可选） */
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

/* 适配不同屏幕尺寸 */
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