<script setup lang="ts"></script>

<template>
  <div class="header">
    <h1>作业缺交登记系统</h1>
  </div>
</template>

<style scoped>
.header {
  background-color: var(--color-primary);
  color: var(--color-background-light);
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
  color: var(--color-background-light);
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
