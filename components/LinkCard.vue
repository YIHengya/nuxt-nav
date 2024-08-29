<template>
  <div class="link-card">
    <a :href="url" target="_blank" rel="noopener noreferrer" class="link-content">
      <img v-if="icon" :src="icon" :alt="link.name" class="link-icon" />
      <div class="link-text">
        <span class="link-name">
          <slot>{{ link.name }}</slot>
        </span>
        <p v-if="link.description" class="link-description">{{ link.description }}</p>
      </div>
    </a>
  </div>
</template>

<script lang="ts" setup>
interface Link {
  name: string;
  url: string;
  icon?: string;
  description?: string;
}

const props = defineProps<{
  link: Link;
  icon?: string;
  url: string;
}>();
</script>

<style scoped>
.link-card {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 18px;
  margin-bottom: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex-flow: wrap;
  width: 300px;
  min-height: 100px;
}

.link-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.link-content {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  align-items: center;
  color: #333;
}

.link-icon {
  width: 36px;
  height: 36px;
  margin-right: 12px;
  object-fit: contain;
  align-content: center;
}

.link-text {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0; /* 这行很重要，确保文本可以正确截断 */
}

.link-name {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.link-description {
  font-size: 14px;
  color: #666;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4; /* 调整行高以确保两行文本的显示 */
  max-height: 2.8em; /* 2 * 1.4em，确保只显示两行 */
}
</style>