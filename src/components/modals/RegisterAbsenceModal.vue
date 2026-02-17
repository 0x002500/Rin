<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['save', 'close'])

const homework = ref('')
const reason = ref('')

watch(
  () => props.isVisible,
  (newVal) => {
    if (newVal) {
      homework.value = ''
      reason.value = ''
    }
  },
)

const handleSave = () => {
  if (!homework.value.trim()) {
    // This validation will be handled by the parent component (App.vue) via the catch block
    emit('save', null, null) // Emit null or an indicator of invalid data
    return
  }
  emit('save', homework.value.trim(), reason.value.trim())
}

const closeModal = () => {
  emit('close')
}

const handleOverlayClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    closeModal()
  }
}
</script>

<template>
  <div v-if="isVisible" class="modal" @click="handleOverlayClick">
    <div class="modal-content">
      <div class="modal-header">
        <h3>登记作业缺交</h3>
        <span class="close-button" @click="closeModal">&times;</span>
      </div>
      <div class="modal-body modal-form">
        <p>
          正在为学生: <span>{{ studentName }}</span> 登记缺交。
        </p>
        <label for="absence-homework">作业名称:</label>
        <input type="text" id="absence-homework" v-model="homework" required />
        <label for="absence-reason">缺交原因:</label>
        <input type="text" id="absence-reason" v-model="reason" />
      </div>
      <div class="modal-footer">
        <button class="cancel-button" @click="closeModal">取消</button>
        <button class="confirm-button" @click="handleSave">登记</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal {
  display: flex;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: var(--color-background-light);
  padding: var(--spacing-xl);
  border: 1px solid #888;
  border-radius: var(--border-radius-lg);
  width: 90%;
  max-width: 500px;
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.modal-form label {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: 500;
}

.modal-form input,
.modal-form select {
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border-light);
  border-radius: var(--border-radius-sm);
  box-sizing: border-box;
  margin-bottom: var(--spacing-sm);
}

.modal-form input:focus,
.modal-form select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-lg);
}

.modal-footer button {
  padding: var(--spacing-sm) var(--spacing-lg);
  border: none;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  font-weight: 500;
}

.modal-footer .confirm-button {
  background-color: var(--color-primary);
  color: var(--color-background-light);
}

.modal-footer .confirm-button:hover {
  background-color: var(--color-primary-dark);
}

.modal-footer .cancel-button {
  background-color: #d1d5db;
  color: #374151;
}

.modal-footer .cancel-button:hover {
  background-color: #9ca3af;
}

.close-button {
  color: #aaa;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close-button:hover,
.close-button:focus {
  color: black;
}
</style>
