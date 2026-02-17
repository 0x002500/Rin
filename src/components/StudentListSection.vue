<script setup lang="ts">
import { computed } from 'vue'
import type { Student } from '../stores/studentStore'
import StudentTable from './StudentTable.vue'

const props = defineProps({
  students: {
    type: Array as () => Student[],
    required: true,
  },
  selectedStudentId: {
    type: String as () => string | null,
    default: null,
  },
  searchTerm: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['select-student', 'update:search-term', 'search', 'clear-search'])

const localSearchTerm = computed({
  get: () => props.searchTerm,
  set: (value) => emit('update:search-term', value),
})

const handleSearch = () => {
  emit('search', localSearchTerm.value)
}

const handleClearSearch = () => {
  emit('clear-search')
}

const handleSelectStudent = (studentId: string | null) => {
  emit('select-student', studentId)
}
</script>

<template>
  <div class="student-list-section">
    <div class="student-list-header">
      <h2>学生列表</h2>
      <div class="search-container">
        <span>搜索:</span>
        <input
          type="text"
          placeholder="输入关键字..."
          v-model="localSearchTerm"
          @keyup.enter="handleSearch"
        />
        <button class="search-button" @click="handleSearch">搜索</button>
        <button class="clear-button" @click="handleClearSearch">清除</button>
      </div>
    </div>
    <div class="student-table-container">
      <StudentTable
        :students="students"
        :selected-student-id="selectedStudentId"
        @select-student="handleSelectStudent"
      />
    </div>
  </div>
</template>

<style scoped>
.student-list-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  overflow: hidden;
}

.student-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: var(--spacing-sm);
}

.student-list-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
  color: var(--color-text-dark);
}

.search-container {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
}

.search-container input {
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid var(--color-border-light);
  border-radius: var(--border-radius-sm);
  font-size: 14px;
  width: 200px;
}

.search-container button {
  padding: var(--spacing-xs) var(--spacing-md);
  border: none;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.search-container .search-button {
  background-color: var(--color-secondary);
  color: var(--color-background-light);
}

.search-container .search-button:hover {
  background-color: var(--color-secondary-dark);
}

.search-container .clear-button {
  background-color: #d1d5db; /* Specific shade of gray */
  color: #374151; /* Specific shade of dark gray */
}

.search-container .clear-button:hover {
  background-color: #9ca3af; /* Specific shade of gray */
}

.student-table-container {
  flex: 1;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  overflow-y: auto;
  background-color: var(--color-background-light-gray);
}
</style>
