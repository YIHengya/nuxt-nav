<template>
  <div>
    <button
      :class="['category-item', { 'current-button': isCurrentButton }]"
      @click="click"
    >
      <slot />
    </button>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  isCurrentButton: { type: Boolean, required: true },
})

const click = () => {
  console.log("hello")
}
</script>

<style scoped>
.category-item {
  padding: 2px 4px;
  border-radius: 15px;
  border: solid 1px #424242;
  color: #424242;
  background-color: transparent;
  transition: all 0.3s ease;
}

.category-item:hover {
  background-color: #424242;
  color: aliceblue;
}

.current-button {
  background-color: #424242;
  color: aliceblue;
}
</style>
