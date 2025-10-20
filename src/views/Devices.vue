<template>
  <div class="devices-page">
    <!-- Header -->
    <div class="page-header">
      <div class="header-left">
        <h1>Inventário de Dispositivos2</h1>
        <p class="page-description">
          Gerencie todos os dispositivos de TI da loja
        </p>
      </div>
      <BaseButton @click="openAddModal"> ➕ Novo Dispositivo </BaseButton>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <BaseCard hover>
        <div class="stat-card">
          <div
            class="stat-icon"
            style="background: var(--primary-alpha); color: var(--primary)"
          >
            🖥️
          </div>
          <div class="stat-info">
            <h3 class="stat-value">{{ devicesStore.devicesByCategory.pdv }}</h3>
            <p class="stat-label">PDV</p>
          </div>
        </div>
      </BaseCard>

      <BaseCard hover>
        <div class="stat-card">
          <div
            class="stat-icon"
            style="background: var(--success-light); color: var(--success)"
          >
            ⚖️
          </div>
          <div class="stat-info">
            <h3 class="stat-value">
              {{ devicesStore.devicesByCategory.balanca }}
            </h3>
            <p class="stat-label">Balanças</p>
          </div>
        </div>
      </BaseCard>

      <BaseCard hover>
        <div class="stat-card">
          <div
            class="stat-icon"
            style="background: var(--warning-light); color: #856404"
          >
            📱
          </div>
          <div class="stat-info">
            <h3 class="stat-value">
              {{ devicesStore.devicesByCategory.coletor }}
            </h3>
            <p class="stat-label">Coletores</p>
          </div>
        </div>
      </BaseCard>

      <BaseCard hover>
        <div class="stat-card">
          <div
            class="stat-icon"
            style="background: var(--info-light); color: var(--info)"
          >
            🖨️
          </div>
          <div class="stat-info">
            <h3 class="stat-value">
              {{ devicesStore.devicesByCategory.impressora }}
            </h3>
            <p class="stat-label">Impressoras</p>
          </div>
        </div>
      </BaseCard>

      <BaseCard hover>
        <div class="stat-card">
          <div
            class="stat-icon"
            style="background: var(--secondary-alpha); color: var(--secondary)"
          >
            💻
          </div>
          <div class="stat-info">
            <h3 class="stat-value">
              {{ devicesStore.devicesByCategory.computador }}
            </h3>
            <p class="stat-label">Computadores</p>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Filters -->
    <BaseCard>
      <div class="filters">
        <div class="filter-group">
          <label>Categoria</label>
          <select v-model="filters.category" class="filter-select">
            <option value="">Todas</option>
            <option value="pdv">PDV</option>
            <option value="balanca">Balança</option>
            <option value="coletor">Coletor</option>
            <option value="impressora">Impressora</option>
            <option value="computador">Computador</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Status</label>
          <select v-model="filters.status" class="filter-select">
            <option value="">Todos</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Setor</label>
          <select v-model="filters.sector" class="filter-select">
            <option value="">Todos</option>
            <option value="caixa">Caixa</option>
            <option value="administrativo">Administrativo</option>
            <option value="estoque">Estoque</option>
            <option value="vendas">Vendas</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Buscar</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Nome, IP, Série..."
            class="filter-input"
          />
        </div>

        <BaseButton
          variant="outline"
          @click="clearFilters"
          style="align-self: flex-end"
        >
          Limpar
        </BaseButton>
      </div>
    </BaseCard>

    <!-- Table -->
    <BaseCard>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Tipo</th>
              <th>Série</th>
              <th>Local</th>
              <th>IP</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="device in filteredDevices" :key="device.id">
              <td>
                <strong>{{ device.name }}</strong>
              </td>
              <td>{{ getCategoryLabel(device.category) }}</td>
              <td>{{ device.type }}</td>
              <td>
                <code>{{ device.serial }}</code>
              </td>
              <td>{{ device.location }}</td>
              <td>
                <code>{{ device.ip || "N/A" }}</code>
              </td>
              <td>
                <BaseBadge
                  :variant="device.status === 'online' ? 'success' : 'danger'"
                >
                  {{ device.status === "online" ? "Online" : "Offline" }}
                </BaseBadge>
              </td>
              <td>
                <div class="action-buttons">
                  <button
                    class="btn-icon"
                    @click="editDevice(device)"
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    class="btn-icon"
                    @click="deleteDevice(device)"
                    title="Excluir"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="filteredDevices.length === 0" class="no-data">
          <p>Nenhum dispositivo encontrado</p>
        </div>
      </div>
    </BaseCard>

    <!-- Modal de Cadastro/Edição -->
    <BaseModal
      v-model="showModal"
      :title="editingDevice ? 'Editar Dispositivo' : 'Novo Dispositivo'"
      size="lg"
    >
      <form @submit.prevent="saveDevice">
        <div class="form-grid">
          <div class="form-group">
            <label>Nome *</label>
            <input
              v-model="formData.name"
              type="text"
              class="form-input"
              placeholder="Ex: PDV01-CPU"
              required
            />
          </div>

          <div class="form-group">
            <label>Categoria *</label>
            <select v-model="formData.category" class="form-input" required>
              <option value="">Selecione...</option>
              <option value="pdv">PDV</option>
              <option value="balanca">Balança</option>
              <option value="coletor">Coletor</option>
              <option value="impressora">Impressora</option>
              <option value="computador">Computador</option>
            </select>
          </div>

          <div class="form-group">
            <label>Tipo *</label>
            <select v-model="formData.type" class="form-input" required>
              <option value="">Selecione...</option>
              <option v-for="type in availableTypes" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Marca</label>
            <input
              v-model="formData.brand"
              type="text"
              class="form-input"
              placeholder="Ex: Dell"
            />
          </div>

          <div class="form-group">
            <label>Modelo</label>
            <input
              v-model="formData.model"
              type="text"
              class="form-input"
              placeholder="Ex: Optiplex 3090"
            />
          </div>

          <div class="form-group">
            <label>Número de Série *</label>
            <input
              v-model="formData.serial"
              type="text"
              class="form-input"
              placeholder="Ex: ABC123456"
              required
            />
          </div>

          <div class="form-group">
            <label>Local *</label>
            <input
              v-model="formData.location"
              type="text"
              class="form-input"
              placeholder="Ex: PDV 01"
              required
            />
          </div>

          <div class="form-group">
            <label>Setor *</label>
            <select v-model="formData.sector" class="form-input" required>
              <option value="">Selecione...</option>
              <option value="caixa">Caixa</option>
              <option value="administrativo">Administrativo</option>
              <option value="estoque">Estoque</option>
              <option value="vendas">Vendas</option>
            </select>
          </div>

          <div class="form-group">
            <label>Endereço IP</label>
            <input
              v-model="formData.ip"
              type="text"
              class="form-input"
              placeholder="Ex: 192.168.1.100"
              pattern="^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$"
            />
          </div>

          <div class="form-group">
            <label>Status *</label>
            <select v-model="formData.status" class="form-input" required>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </div>
        </div>
      </form>

      <template #footer>
        <BaseButton variant="outline" @click="closeModal">Cancelar</BaseButton>
        <BaseButton @click="saveDevice">
          {{ editingDevice ? "Salvar Alterações" : "Cadastrar" }}
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useDevicesStore } from "../stores/devices";
import BaseCard from "../components/common/BaseCard.vue";
import BaseButton from "../components/common/BaseButton.vue";
import BaseBadge from "../components/common/BaseBadge.vue";
import BaseModal from "../components/common/BaseModal.vue";

const devicesStore = useDevicesStore();

const showModal = ref(false);
const editingDevice = ref(null);

const filters = ref({
  category: "",
  status: "",
  sector: "",
  search: "",
});

const formData = ref({
  name: "",
  category: "",
  type: "",
  brand: "",
  model: "",
  serial: "",
  location: "",
  sector: "",
  ip: "",
  status: "online",
});

const availableTypes = computed(() => {
  if (!formData.value.category) return [];
  return devicesStore.categories[formData.value.category] || [];
});

const filteredDevices = computed(() => {
  let devices = devicesStore.devices;

  if (filters.value.category) {
    devices = devices.filter((d) => d.category === filters.value.category);
  }

  if (filters.value.status) {
    devices = devices.filter((d) => d.status === filters.value.status);
  }

  if (filters.value.sector) {
    devices = devices.filter((d) => d.sector === filters.value.sector);
  }

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase();
    devices = devices.filter(
      (d) =>
        d.name.toLowerCase().includes(search) ||
        d.serial.toLowerCase().includes(search) ||
        (d.ip && d.ip.toLowerCase().includes(search))
    );
  }

  return devices;
});

function getCategoryLabel(category) {
  const labels = {
    pdv: "PDV",
    balanca: "Balança",
    coletor: "Coletor",
    rube: "RUBE",
    computador: "Computador",
  };
  return labels[category] || category;
}

function openAddModal() {
  editingDevice.value = null;
  resetForm();
  showModal.value = true;
}

function editDevice(device) {
  editingDevice.value = device;
  formData.value = { ...device };
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  resetForm();
}

function resetForm() {
  formData.value = {
    name: "",
    category: "",
    type: "",
    brand: "",
    model: "",
    serial: "",
    location: "",
    sector: "",
    ip: "",
    status: "online",
  };
}

function saveDevice() {
  if (editingDevice.value) {
    devicesStore.updateDevice(editingDevice.value.id, formData.value);
  } else {
    devicesStore.addDevice(formData.value);
  }
  closeModal();
}

function deleteDevice(device) {
  if (
    confirm(`Tem certeza que deseja excluir o dispositivo "${device.name}"?`)
  ) {
    devicesStore.deleteDevice(device.id);
  }
}

function clearFilters() {
  filters.value = {
    category: "",
    status: "",
    sector: "",
    search: "",
  };
}
</script>

<style scoped>
.devices-page {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-xl);
}

/* Stats Cards */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.stat-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-sm);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--border-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--gray-900);
  margin: 0;
  line-height: 1;
}

.stat-label {
  margin: 4px 0 0 0;
  color: var(--gray-600);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.header-left h1 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--gray-900);
  margin: 0 0 8px 0;
}

.page-description {
  color: var(--gray-600);
  margin: 0;
}

.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-group label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--gray-700);
}

.filter-select,
.filter-input {
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: var(--font-size-base);
  font-family: var(--font-family);
  transition: var(--transition);
}

.filter-select:focus,
.filter-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-alpha);
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  padding: 12px;
  background: var(--gray-100);
  font-weight: var(--font-weight-semibold);
  color: var(--gray-700);
  font-size: var(--font-size-sm);
  border-bottom: 2px solid var(--border-color);
  white-space: nowrap;
}

td {
  padding: 12px;
  border-bottom: 1px solid var(--border-color);
  color: var(--gray-800);
  font-size: var(--font-size-sm);
}

tbody tr {
  transition: var(--transition);
}

tbody tr:hover {
  background: var(--gray-100);
}

code {
  background: var(--gray-200);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: "Courier New", monospace;
  font-size: var(--font-size-xs);
}

.action-buttons {
  display: flex;
  gap: var(--spacing-sm);
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  font-size: 16px;
  border-radius: var(--border-radius-sm);
  transition: var(--transition);
}

.btn-icon:hover {
  background: var(--gray-200);
}

.no-data {
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--gray-600);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--gray-700);
}

.form-input {
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

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .filters {
    grid-template-columns: 1fr;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .table-container {
    font-size: var(--font-size-xs);
  }
}
</style>
