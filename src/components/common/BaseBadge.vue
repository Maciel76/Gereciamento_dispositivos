<template>
  <span :class="['badge', `badge-${variant}`]">
    <slot></slot>
  </span>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'].includes(value)
  }
})
</script>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  min-height: 24px;
  min-width: 24px;
  justify-content: center;
}

.badge-primary {
  background: var(--primary-alpha);
  color: var(--primary);
}

.badge-secondary {
  background: var(--secondary-alpha);
  color: var(--secondary);
}

.badge-success {
  background: var(--success-light);
  color: var(--success);
}

.badge-danger {
  background: var(--danger-light);
  color: var(--danger);
}

.badge-warning {
  background: var(--warning-light);
  color: #856404;
}

.badge-info {
  background: var(--info-light);
  color: var(--info);
}

.badge-light {
  background: var(--gray-200);
  color: var(--gray-700);
}

.badge-dark {
  background: var(--gray-800);
  color: var(--white);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .badge {
    padding: 3px 8px;
    font-size: var(--font-size-xs);
  }
}

@media (max-width: 480px) {
  .badge {
    padding: 2px 6px;
    font-size: var(--font-size-xs);
  }
}
</style>
