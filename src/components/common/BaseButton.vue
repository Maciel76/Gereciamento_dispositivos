<template>
  <button
    :class="['btn', `btn-${variant}`, { 'btn-sm': size === 'sm', 'btn-lg': size === 'lg', 'btn-block': block }]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot></slot>
  </button>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'danger', 'warning', 'outline'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  block: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])
</script>

<style scoped>
.btn {
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  padding: 10px 20px;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  white-space: nowrap;
  text-decoration: none;
  min-height: 44px; /* Ensure touch-friendly size on mobile */
  min-width: 44px;
}

.btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn:active:not(:disabled) {
  transform: translateY(0);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Variants */
.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-dark);
}

.btn-secondary {
  background: var(--secondary);
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: var(--secondary-dark);
}

.btn-success {
  background: var(--success);
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #218838;
}

.btn-danger {
  background: var(--danger);
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #c82333;
}

.btn-warning {
  background: var(--warning);
  color: var(--dark);
}

.btn-warning:hover:not(:disabled) {
  background: #e0a800;
}

.btn-outline {
  background: transparent;
  color: var(--primary);
  border: 2px solid var(--primary);
}

.btn-outline:hover:not(:disabled) {
  background: var(--primary);
  color: white;
}

/* Sizes */
.btn-sm {
  font-size: var(--font-size-sm);
  padding: 6px 12px;
  min-height: 36px;
}

.btn-lg {
  font-size: var(--font-size-lg);
  padding: 12px 24px;
  min-height: 52px;
}

.btn-block {
  width: 100%;
  display: flex;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .btn {
    padding: 10px 16px;
    font-size: var(--font-size-sm);
    min-height: 40px;
  }
  
  .btn-sm {
    padding: 6px 10px;
    font-size: var(--font-size-xs);
    min-height: 34px;
  }
  
  .btn-lg {
    padding: 12px 20px;
    font-size: var(--font-size-base);
    min-height: 48px;
  }
}

@media (max-width: 480px) {
  .btn {
    padding: 8px 12px;
    font-size: var(--font-size-xs);
    min-height: 36px;
  }
  
  .btn-block {
    padding: 10px 16px;
  }
}
</style>
