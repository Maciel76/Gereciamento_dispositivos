<template>
  <div class="timeline-page">
    <div class="page-header">
      <div>
        <h1>Timeline de Atividades</h1>
        <p class="page-description">
          Registro de todas as atividades do assistente de TI
        </p>
      </div>
      <BaseButton @click="showModal = true">
        ➕ Registrar Atividade
      </BaseButton>
    </div>

    <div class="timeline">
      <div
        v-for="(activity, index) in activities"
        :key="index"
        class="timeline-item"
      >
        <div class="timeline-marker" :class="activity.type">
          <span class="timeline-icon">{{ getIcon(activity.type) }}</span>
        </div>
        <BaseCard hover>
          <div class="activity-content">
            <div class="activity-header">
              <div>
                <BaseBadge :variant="getBadgeVariant(activity.type)">
                  {{ activity.type }}
                </BaseBadge>
                <h3 class="activity-title">{{ activity.title }}</h3>
              </div>
              <span class="activity-time">{{
                formatTime(activity.timestamp)
              }}</span>
            </div>
            <p class="activity-description">{{ activity.description }}</p>
            <div v-if="activity.device" class="activity-device">
              🖥️ <strong>{{ activity.device }}</strong>
            </div>
            <div v-if="activity.duration" class="activity-duration">
              ⏱️ Duração: {{ activity.duration }}
            </div>
          </div>
        </BaseCard>
      </div>
    </div>

    <!-- Modal -->
    <BaseModal v-model="showModal" title="Registrar Atividade Manual" size="md">
      <form @submit.prevent="saveActivity">
        <div class="form-group">
          <label>Tipo *</label>
          <select v-model="formData.type" class="form-input" required>
            <option value="manual">Manual</option>
            <option value="chamado">Chamado</option>
            <option value="manutencao">Manutenção</option>
          </select>
        </div>

        <div class="form-group">
          <label>Título *</label>
          <input
            v-model="formData.title"
            type="text"
            class="form-input"
            placeholder="Ex: Manutenção preventiva"
            required
          />
        </div>

        <div class="form-group">
          <label>Descrição *</label>
          <textarea
            v-model="formData.description"
            class="form-input"
            rows="4"
            placeholder="Descreva a atividade realizada..."
            required
          ></textarea>
        </div>

        <div class="form-group">
          <label>Dispositivo (opcional)</label>
          <input
            v-model="formData.device"
            type="text"
            class="form-input"
            placeholder="Nome do dispositivo"
          />
        </div>

        <div class="form-group">
          <label>Duração (opcional)</label>
          <input
            v-model="formData.duration"
            type="text"
            class="form-input"
            placeholder="Ex: 30 minutos"
          />
        </div>
      </form>

      <template #footer>
        <BaseButton variant="outline" @click="showModal = false"
          >Cancelar</BaseButton
        >
        <BaseButton @click="saveActivity">Salvar</BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useActivitiesStore } from "../stores/activities";
import BaseCard from "../components/common/BaseCard.vue";
import BaseButton from "../components/common/BaseButton.vue";
import BaseBadge from "../components/common/BaseBadge.vue";
import BaseModal from "../components/common/BaseModal.vue";

const activitiesStore = useActivitiesStore();
const showModal = ref(false);

const activities = computed(() => activitiesStore.activities);

const formData = ref({
  type: "manual",
  title: "",
  description: "",
  device: "",
  duration: "",
});

function getIcon(type) {
  const icons = {
    manual: "✍️",
    chamado: "🎫",
    sistema: "⚙️",
    manutencao: "🔧",
    dispositivo: "🖥️",
  };
  return icons[type] || "📝";
}

function getBadgeVariant(type) {
  const variants = {
    manual: "primary",
    chamado: "warning",
    sistema: "info",
    manutencao: "secondary",
    dispositivo: "success",
  };
  return variants[type] || "light";
}

function formatTime(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);

  if (hours > 24) {
    return new Date(date).toLocaleString("pt-BR");
  }
  if (hours > 0) return `${hours}h atrás`;
  if (minutes > 0) return `${minutes}min atrás`;
  return "Agora";
}

function saveActivity() {
  activitiesStore.addActivity({
    type: formData.value.type,
    title: formData.value.title,
    description: formData.value.description,
    device: formData.value.device || null,
    duration: formData.value.duration || null,
  });
  showModal.value = false;
  formData.value = {
    type: "manual",
    title: "",
    description: "",
    device: "",
    duration: "",
  };
}
</script>

<style scoped>
.timeline-page {
  max-width: 100%;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-2xl);
}

.page-header h1 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--gray-900);
  margin: 0 0 8px 0;
}

.page-description {
  color: var(--gray-600);
  margin: 0;
}

.timeline {
  position: relative;
  padding-left: 40px;
}

.timeline::before {
  content: "";
  position: absolute;
  left: 16px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--border-color);
}

.timeline-item {
  position: relative;
  margin-bottom: var(--spacing-xl);
}

.timeline-marker {
  position: absolute;
  left: -32px;
  top: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--white);
  border: 3px solid var(--primary);
  z-index: 1;
}

.timeline-marker.chamado {
  border-color: var(--warning);
}

.timeline-marker.sistema {
  border-color: var(--info);
}

.timeline-marker.manutencao {
  border-color: var(--secondary);
}

.timeline-marker.dispositivo {
  border-color: var(--success);
}

.timeline-icon {
  font-size: 14px;
}

.activity-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-md);
}

.activity-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--gray-900);
  margin: 8px 0 0 0;
}

.activity-time {
  font-size: var(--font-size-sm);
  color: var(--gray-600);
  white-space: nowrap;
}

.activity-description {
  color: var(--gray-700);
  margin: 0;
}

.activity-device,
.activity-duration {
  font-size: var(--font-size-sm);
  color: var(--gray-600);
  padding: 8px 12px;
  background: var(--gray-100);
  border-radius: var(--border-radius-sm);
  display: inline-block;
}

.form-group {
  margin-bottom: var(--spacing-md);
}

.form-group label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--gray-700);
  margin-bottom: 6px;
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: var(--font-size-base);
  font-family: var(--font-family);
  transition: var(--transition);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-alpha);
}

textarea.form-input {
  resize: vertical;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: var(--spacing-md);
  }
}
</style>
