<script setup lang="ts">
defineProps({
  statusMessage: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="footer">
    <span :class="{ 'status-text': statusMessage }">{{ statusMessage }}</span>
  </div>
</template>

<style scoped>
.footer {
  background-color: var(--color-background-lightest-gray);
  padding: var(--spacing-sm) var(--spacing-xl);
  border-top: 1px solid var(--color-border);
  color: var(--color-text-light);
  font-size: 14px;
  display: flex;
  align-items: center;
}

.footer .status-text {
  color: var(--color-accent-red);
}
</style>
