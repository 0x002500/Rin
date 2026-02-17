<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: '提示',
  },
  message: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['close'])

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
        <h3>{{ title }}</h3>
        <span class="close-button" @click="closeModal">&times;</span>
      </div>
      <div class="modal-body">
        <p>{{ message }}</p>
      </div>
      <div class="modal-footer">
        <button class="confirm-button" @click="closeModal">确定</button>
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
  border: 1px solid var(--color-border);
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
  color: var(--color-on-primary);
}

.modal-footer .confirm-button:hover {
  background-color: var(--color-primary-dark);
}

.close-button {
  color: var(--color-text-light);
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close-button:hover,
.close-button:focus {
  color: var(--color-text-dark);
}
</style>
