<template>
  <div :class="['card', { 'card-hover': hover }]">
    <div v-if="$slots.header" class="card-header">
      <slot name="header"></slot>
    </div>
    <div class="card-body">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  hover: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.card {
  background: var(--white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow);
  overflow: hidden;
  transition: var(--transition);
  width: 100%;
  margin: 0;
}

.card-hover:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.card-header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.card-header h3 {
  margin: 0;
  flex: 1;
}

.card-body {
  padding: var(--spacing-lg);
}

.card-footer {
  padding: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
  background: var(--gray-100);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    padding: var(--spacing-md);
  }

  .card-body {
    padding: var(--spacing-md);
  }

  .card-footer {
    padding: var(--spacing-md);
  }
}

@media (max-width: 480px) {
  .card-header {
    padding: var(--spacing-sm);
  }

  .card-body {
    padding: var(--spacing-sm);
  }

  .card-footer {
    padding: var(--spacing-sm);
  }
}
</style>
