<template>
  <div class="layout">
    <aside class="sidebar">
      <nav>
        <ul>
          <li :class="{ active: isActive('/admin') }">
            <NuxtLink to="/admin">分类管理</NuxtLink>
          </li>
          <li :class="{ active: isActive('/admin/tool-management') }">
            <NuxtLink to="/admin/tool-management">工具管理</NuxtLink>
          </li>
          <li :class="{ active: isActive('/admin/api-token') }">
            <NuxtLink to="/admin/api-token">API Token</NuxtLink>
          </li>
          <li :class="{ active: isActive('/admin/system-management') }">
            <NuxtLink to="/admin/system-management">系统管理</NuxtLink>
          </li>
        </ul>
      </nav>
    </aside>
    <main class="content">
      <slot />
    </main>
  </div>
</template>

<script lang="ts" setup>

const route = useRoute()

const isActive = (path: string) => {
  return route.path === path
}
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  background-color: #F5F5F5;
}

.sidebar {
  min-width: 175px;
  background-color: #fff;
  padding: 10px;
}

.sidebar nav ul {
  list-style-type: none;
  padding: 0;
}

.sidebar nav ul li {
  margin-bottom: 10px;
}

.sidebar nav ul li a {
  text-decoration: none;
  color: #333;
  font-size: 16px;
  display: block;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.sidebar nav ul li.active a {
  background-color: #E6F4FF;
  color: #1677FE;
  font-weight: bold;
}

.sidebar nav ul li a:hover {
  background-color: #f5f5f5;
}

.content {
  flex: 1;
  padding: 20px;
}
</style>