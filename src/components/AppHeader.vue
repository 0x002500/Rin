<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isDark = ref(false)

const applyTheme = (dark: boolean) => {
  document.documentElement.dataset.theme = dark ? 'dark' : 'light'
  try { localStorage.setItem('theme', dark ? 'dark' : 'light') } catch (e) {}
  isDark.value = dark
}

const toggleTheme = () => applyTheme(!isDark.value)

onMounted(() => {
  const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('theme') : null
  if (stored === 'dark' || stored === 'light') {
    applyTheme(stored === 'dark')
    return
  }
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  applyTheme(prefersDark)
})
</script>

<template>
  <div class="header">
    <h1>作业缺交登记系统</h1>
    <div class="buttons">
      <button class="theme-toggle" @click="toggleTheme" :title="isDark ? '切换为浅色模式' : '切换为深色模式'">
        {{ isDark ? '☀️' : '🌙' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.header {
  background-color: var(--color-primary);
  color: var(--color-on-primary);
  padding: var(--spacing-md) var(--spacing-xl);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top-left-radius: var(--border-radius-lg);
  border-top-right-radius: var(--border-radius-lg);
}

.header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 500;
}

.header .buttons {
  display: flex;
  gap: var(--spacing-sm);
}

.header .buttons button {
  background-color: var(--color-secondary);
  color: var(--color-on-primary);
  border: none;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.header .buttons button:hover {
  background-color: var(--color-secondary-dark);
}

.header .buttons button.restore {
  background-color: var(--color-accent-orange);
}

.header .buttons button.restore:hover {
  background-color: var(--color-accent-orange-dark);
}
</style>
