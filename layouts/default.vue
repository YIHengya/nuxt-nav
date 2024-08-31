<template>
  <div class="outer-container">
    <div class="inner-container">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
</script>

<style scoped>
.outer-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 使容器填满整个视口高度 */
  padding: 0px;
}

.inner-container {
  padding: 100px;
  width: 100%;
}
</style>
