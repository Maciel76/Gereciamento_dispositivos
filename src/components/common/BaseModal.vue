<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click="closeOnOverlay && close()">
        <div :class="['modal-container', `modal-${size}`]" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">{{ title }}</h3>
            <button class="modal-close" @click="close" aria-label="Fechar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <slot></slot>
          </div>
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: 'Modal'
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  closeOnOverlay: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

function close() {
  emit('update:modelValue', false)
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
}

.modal-container {
  background: var(--white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-xl);
  max-height: 95vh;
  display: flex;
  flex-direction: column;
  animation: slideInRight 0.3s ease-out;
  width: 95vw;
  max-width: 600px;
}

.modal-sm { max-width: 90vw; width: 90vw; }
.modal-md { max-width: 90vw; width: 90vw; }
.modal-lg { max-width: 95vw; width: 95vw; }
.modal-xl { max-width: 98vw; width: 98vw; }

.modal-header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  margin: 0;
  color: var(--gray-900);
  flex: 1;
  word-break: break-word;
}

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gray-600);
  border-radius: var(--border-radius-sm);
  transition: var(--transition);
  flex-shrink: 0;
  margin-left: var(--spacing-sm);
}

.modal-close:hover {
  background: var(--gray-200);
  color: var(--gray-900);
}

.modal-body {
  padding: var(--spacing-lg);
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
  display: flex;
  gap: var(--spacing-sm);
  justify-content: flex-end;
  flex-wrap: wrap;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container {
  animation: slideInRight 0.3s ease-out;
}

.modal-leave-active .modal-container {
  animation: slideOutRight 0.3s ease-in;
}

@keyframes slideOutRight {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.9);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .modal-overlay {
    align-items: flex-end;
    padding: var(--spacing-sm);
  }
  
  .modal-container {
    width: 100%;
    max-height: 90vh;
    margin: 0;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: var(--spacing-md);
  }
  
  .modal-footer {
    flex-direction: column;
  }
  
  .modal-footer > * {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .modal-overlay {
    padding: var(--spacing-xs);
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: var(--spacing-sm);
  }
  
  .modal-title {
    font-size: var(--font-size-lg);
  }
}
</style>
