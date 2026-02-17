<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  isStudentSelected: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits([
  'add-student',
  'edit-student',
  'delete-student',
  'register-absence',
  'view-record',
  'stats',
  'export-data',
])
</script>

<template>
  <div class="sidebar">
    <h2>操作</h2>
    <button class="add-student" @click="emit('add-student')">添加学生</button>
    <button class="edit-student" :disabled="!isStudentSelected" @click="emit('edit-student')">
      编辑学生
    </button>
    <button class="delete-student" :disabled="!isStudentSelected" @click="emit('delete-student')">
      删除学生
    </button>
    <button
      class="register-absence"
      :disabled="!isStudentSelected"
      @click="emit('register-absence')"
    >
      登记作业缺交
    </button>
    <button class="view-record" :disabled="!isStudentSelected" @click="emit('view-record')">
      查看作业记录
    </button>
    <button class="stats" @click="emit('stats')">缺交统计</button>
    <button class="export-data" @click="emit('export-data')">导出数据</button>
  </div>
</template>

<style scoped>
.sidebar {
  width: 250px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  border-right: 1px solid var(--color-border);
  padding-right: var(--spacing-xl);
}

.sidebar h2 {
  margin: 0 0 var(--spacing-sm) 0;
  font-size: 18px;
  font-weight: 500;
  color: var(--color-text-medium);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: var(--spacing-sm);
}

.sidebar button {
  width: 100%;
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  border: none;
  font-size: 16px;
  font-weight: 500;
  color: var(--color-background-light);
  cursor: pointer;
  text-align: left;
  box-shadow: var(--shadow-sm);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.sidebar button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.sidebar button:disabled {
  background-color: #ccc !important;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.sidebar .add-student {
  background-color: var(--color-secondary);
}

.sidebar .edit-student {
  background-color: #60a5fa; /* Specific shade of blue */
}

.sidebar .delete-student {
  background-color: var(--color-accent-red);
}

.sidebar .register-absence {
  background-color: var(--color-accent-orange);
}

.sidebar .view-record {
  background-color: var(--color-accent-green);
}

.sidebar .stats {
  background-color: var(--color-accent-purple);
}

.sidebar .export-data {
  background-color: var(--color-accent-light-green);
}
</style>
