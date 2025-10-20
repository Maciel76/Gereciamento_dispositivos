<template>
  <div class="qrcode-page">
    <div class="page-header">
      <div>
        <h1>Gerador de QR Code</h1>
        <p class="page-description">
          Gere QR Codes para identificação de dispositivos
        </p>
      </div>
      <div class="header-actions">
        <button
          :class="['mode-btn', { active: mode === 'single' }]"
          @click="mode = 'single'"
        >
          <Icon icon="mdi:qrcode-plus" class="btn-icon" /> Gerador QR code
        </button>
        <button
          :class="['mode-btn', { active: mode === 'bulk' }]"
          @click="mode = 'bulk'"
        >
          <Icon icon="mdi:view-grid" class="btn-icon" /> Meus QR codes
        </button>
      </div>
    </div>

    <!-- Modo Individual -->
    <div v-if="mode === 'single'" class="single-mode">
      <div class="qrcode-container">
        <BaseCard>
          <div class="panel-header">
            <h2>Configuração do QR Code</h2>
          </div>

          <div class="panel-content">
            <div class="form-group">
              <label>Selecione o Dispositivo *</label>
              <select
                v-model="selectedDeviceId"
                class="form-input"
                @change="loadDevice"
              >
                <option value="">Selecione um dispositivo...</option>
                <option
                  v-for="device in devicesStore.devices"
                  :key="device.id"
                  :value="device.id"
                >
                  {{ device.name }} - {{ device.location }}
                </option>
              </select>
            </div>

            <div v-if="selectedDevice" class="device-info">
              <h4>Informações do Dispositivo</h4>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">Nome:</span>
                  <strong>{{ selectedDevice.name }}</strong>
                </div>
                <div class="info-item">
                  <span class="label">Categoria:</span>
                  <strong>{{
                    getCategoryLabel(selectedDevice.category)
                  }}</strong>
                </div>
                <div class="info-item">
                  <span class="label">Número de Série:</span>
                  <strong>{{ selectedDevice.serial }}</strong>
                </div>
                <div class="info-item">
                  <span class="label">Local:</span>
                  <strong>{{ selectedDevice.location }}</strong>
                </div>
                <div class="info-item">
                  <span class="label">IP:</span>
                  <strong>{{ selectedDevice.ip || "N/A" }}</strong>
                </div>
                <div class="info-item">
                  <span class="label">Marca/Modelo:</span>
                  <strong
                    >{{ selectedDevice.brand }}
                    {{ selectedDevice.model }}</strong
                  >
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>Informações Adicionais (opcional)</label>
              <textarea
                v-model="additionalText"
                class="form-input"
                rows="4"
                placeholder="Digite informações extras, instruções, observações, etc..."
              ></textarea>
              <small class="helper-text">
                Essas informações aparecerão quando o QR Code for escaneado
              </small>
            </div>

            <div class="options-grid">
              <div class="option-group">
                <label for="qrSize">Tamanho do QR Code</label>
                <input
                  type="number"
                  id="qrSize"
                  v-model.number="qrOptions.size"
                  min="64"
                  max="256"
                  class="form-input"
                />
              </div>

              <div class="option-group">
                <label for="qrColor">Cor do QR Code</label>
                <input
                  type="color"
                  id="qrColor"
                  v-model="qrOptions.color"
                  class="form-input"
                />
              </div>
            </div>

            <BaseButton
              @click="generateSingleQRCode"
              :disabled="!selectedDevice"
              block
            >
              <Icon icon="mdi:qrcode" class="btn-icon" /> Gerar QR Code
            </BaseButton>
          </div>
        </BaseCard>

        <BaseCard v-if="singleQRGenerated">
          <div class="panel-header">
            <h2>QR Code Gerado</h2>
          </div>

          <div class="qrcode-preview">
            <div class="qrcode-display">
              <div ref="singleQRRef" class="qrbox-large"></div>
              <p class="qrcode-label">{{ selectedDevice.name }}</p>
            </div>

            <div class="qr-data-preview">
              <h4>Dados no QR Code:</h4>
              <div class="data-content">
                <p><strong>Dispositivo:</strong> {{ selectedDevice.name }}</p>
                <p><strong>Série:</strong> {{ selectedDevice.serial }}</p>
                <p><strong>IP:</strong> {{ selectedDevice.ip || "N/A" }}</p>
                <p>
                  <strong>Modelo:</strong> {{ selectedDevice.brand }}
                  {{ selectedDevice.model }}
                </p>
                <p><strong>Local:</strong> {{ selectedDevice.location }}</p>
                <p v-if="additionalText">
                  <strong>Informações:</strong> {{ additionalText }}
                </p>
              </div>
            </div>

            <div class="qrcode-actions">
              <BaseButton variant="success" @click="downloadSingleQRCode">
                <Icon icon="mdi:download" class="btn-icon" /> Download PNG
              </BaseButton>
              <BaseButton variant="outline" @click="printSingleQRCode">
                <Icon icon="mdi:printer" class="btn-icon" /> Imprimir
              </BaseButton>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>

    <!-- Modo Em Massa - QR Codes Salvos -->
    <div v-if="mode === 'bulk'" class="bulk-mode">
      <div class="page-subheader">
        <div>
          <h2>QR Codes Salvos</h2>
          <p class="subheader-description">
            Gerencie todos os QR Codes criados individualmente
          </p>
        </div>
        <div class="header-actions" v-if="qrCodesStore.qrcodes.length > 0">
          <BaseButton variant="outline" @click="confirmDeleteAll">
            <Icon icon="mdi:delete-sweep" class="btn-icon" /> Limpar Todos
          </BaseButton>
        </div>
      </div>

      <!-- Estatísticas dos QR Codes -->
      <div v-if="qrCodesStore.qrcodes.length > 0" class="stats-grid qr-stats">
        <BaseCard hover>
          <div class="stat-card">
            <div class="stat-icon" style="background: var(--primary-alpha); color: var(--primary);">
              <Icon icon="mdi:qrcode" width="32" height="32" />
            </div>
            <div class="stat-info">
              <h3 class="stat-value">{{ qrCodesStore.totalQRCodes }}</h3>
              <p class="stat-label">Total de QR Codes</p>
            </div>
          </div>
        </BaseCard>

        <BaseCard hover>
          <div class="stat-card">
            <div class="stat-icon" style="background: var(--success-light); color: var(--success);">
              <Icon icon="mdi:desktop-classic" width="32" height="32" />
            </div>
            <div class="stat-info">
              <h3 class="stat-value">{{ qrCodesByCategory.pdv }}</h3>
              <p class="stat-label">PDV</p>
            </div>
          </div>
        </BaseCard>

        <BaseCard hover>
          <div class="stat-card">
            <div class="stat-icon" style="background: var(--info-light); color: var(--info);">
              <Icon icon="mdi:barcode-scan" width="32" height="32" />
            </div>
            <div class="stat-info">
              <h3 class="stat-value">{{ qrCodesByCategory.coletor }}</h3>
              <p class="stat-label">Coletores</p>
            </div>
          </div>
        </BaseCard>

        <BaseCard hover>
          <div class="stat-card">
            <div class="stat-icon" style="background: var(--warning-light); color: #856404;">
              <Icon icon="mdi:printer" width="32" height="32" />
            </div>
            <div class="stat-info">
              <h3 class="stat-value">{{ qrCodesByCategory.impressora }}</h3>
              <p class="stat-label">Impressoras</p>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Filtros e Busca -->
      <BaseCard v-if="qrCodesStore.qrcodes.length > 0" class="filters-card">
        <div class="filters-section">
          <div class="search-box">
            <Icon icon="mdi:magnify" class="search-icon" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar por nome, série ou local..."
              class="search-input"
            />
            <button v-if="searchQuery" @click="searchQuery = ''" class="clear-search">
              <Icon icon="mdi:close" />
            </button>
          </div>

          <div class="filter-group">
            <label>Categoria:</label>
            <select v-model="filterCategory" class="filter-select">
              <option value="">Todas</option>
              <option value="pdv">PDV</option>
              <option value="balanca">Balança</option>
              <option value="coletor">Coletor</option>
              <option value="impressora">Impressora</option>
              <option value="computador">Computador</option>
              <option value="outros">Outros</option>
            </select>
          </div>

          <BaseButton
            v-if="searchQuery || filterCategory"
            variant="outline"
            size="sm"
            @click="clearFilters"
          >
            <Icon icon="mdi:filter-off" class="btn-icon" /> Limpar Filtros
          </BaseButton>
        </div>
      </BaseCard>

      <!-- View Toggle -->
      <div v-if="qrCodesStore.qrcodes.length > 0" class="view-options">
        <div class="view-toggle">
          <button
            :class="['view-btn', { active: viewMode === 'cards' }]"
            @click="viewMode = 'cards'"
          >
            <Icon icon="mdi:view-grid" /> Cards
          </button>
          <button
            :class="['view-btn', { active: viewMode === 'table' }]"
            @click="viewMode = 'table'"
          >
            <Icon icon="mdi:view-list" /> Lista
          </button>
        </div>
        <div class="results-info">
          <span
            >{{ filteredQRCodes.length }}
            {{
              filteredQRCodes.length === 1 ? "QR Code" : "QR Codes"
            }}
            <span v-if="filteredQRCodes.length !== qrCodesStore.qrcodes.length" class="filter-indicator">
              (filtrado de {{ qrCodesStore.qrcodes.length }})
            </span>
          </span>
        </div>
      </div>

      <!-- Cards View -->
      <div
        v-if="viewMode === 'cards' && filteredQRCodes.length > 0"
        class="qr-grid"
      >
        <BaseCard v-for="qrcode in filteredQRCodes" :key="qrcode.id" hover>
          <div class="qr-card saved">
            <div class="qr-header">
              <span class="qr-badge">{{
                getCategoryLabel(qrcode.deviceCategory)
              }}</span>
              <button
                class="delete-btn"
                @click="deleteQRCode(qrcode.id)"
                title="Excluir"
              >
                <Icon icon="mdi:delete" />
              </button>
            </div>
            <div class="qr-content">
              <div class="qr-code-wrapper">
                <img
                  :src="qrcode.imageData"
                  :alt="`QR Code - ${qrcode.deviceName}`"
                  class="qr-image"
                />
              </div>
              <div class="qr-details">
                <h3>{{ qrcode.deviceName }}</h3>
                <p class="qr-info">
                  <strong>Série:</strong> {{ qrcode.deviceSerial }}
                </p>
                <p class="qr-info">
                  <strong>Local:</strong> {{ qrcode.deviceLocation }}
                </p>
                <p class="qr-info" v-if="qrcode.deviceIp">
                  <strong>IP:</strong> {{ qrcode.deviceIp }}
                </p>
                <p class="qr-date">{{ formatDate(qrcode.createdAt) }}</p>
              </div>
            </div>
            <div class="qr-actions">
              <BaseButton
                variant="success"
                size="sm"
                @click="downloadQRCode(qrcode)"
              >
                <Icon icon="mdi:download" class="btn-icon" /> Baixar
              </BaseButton>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Empty State for Filtered Results -->
      <div v-if="qrCodesStore.qrcodes.length > 0 && filteredQRCodes.length === 0" class="empty-state">
        <div class="empty-icon">
          <Icon icon="mdi:filter-remove" />
        </div>
        <h3>Nenhum resultado encontrado</h3>
        <p>Nenhum QR Code corresponde aos filtros aplicados.</p>
        <BaseButton variant="outline" @click="clearFilters">
          <Icon icon="mdi:filter-off" class="btn-icon" /> Limpar Filtros
        </BaseButton>
      </div>

      <!-- Table View -->
      <BaseCard v-if="viewMode === 'table' && filteredQRCodes.length > 0">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>QR Code</th>
                <th>Dispositivo</th>
                <th>Série</th>
                <th>Local</th>
                <th>Categoria</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="qrcode in filteredQRCodes" :key="qrcode.id">
                <td class="qr-container">
                  <img
                    :src="qrcode.imageData"
                    :alt="`QR Code - ${qrcode.deviceName}`"
                    class="qr-image-small"
                  />
                </td>
                <td>
                  <strong>{{ qrcode.deviceName }}</strong>
                </td>
                <td>{{ qrcode.deviceSerial }}</td>
                <td>{{ qrcode.deviceLocation }}</td>
                <td>{{ getCategoryLabel(qrcode.deviceCategory) }}</td>
                <td>{{ formatDate(qrcode.createdAt) }}</td>
                <td>
                  <div class="table-actions">
                    <button
                      class="action-btn download"
                      @click="downloadQRCode(qrcode)"
                      title="Baixar"
                    >
                      <Icon icon="mdi:download" />
                    </button>
                    <button
                      class="action-btn delete"
                      @click="deleteQRCode(qrcode.id)"
                      title="Excluir"
                    >
                      <Icon icon="mdi:delete" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </BaseCard>

      <!-- Empty State -->
      <div v-if="qrCodesStore.qrcodes.length === 0" class="empty-state">
        <div class="empty-icon">
          <Icon icon="mdi:qrcode-scan" />
        </div>
        <h3>Nenhum QR Code salvo ainda</h3>
        <p>
          Gere QR Codes na aba "Individual" e eles aparecerão aqui
          automaticamente.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from "vue";
import { useDevicesStore } from "../stores/devices";
import { useQRCodesStore } from "../stores/qrcodes";
import BaseCard from "../components/common/BaseCard.vue";
import BaseButton from "../components/common/BaseButton.vue";
import { Icon } from "@iconify/vue";
import QRCode from "qrcode";
import Papa from "papaparse";

const devicesStore = useDevicesStore();
const qrCodesStore = useQRCodesStore();

// Mode
const mode = ref("single");

// Single Mode
const selectedDeviceId = ref("");
const additionalText = ref("");
const singleQRGenerated = ref(false);
const singleQRRef = ref(null);

// Bulk Mode
const inputData = ref("");
const fileName = ref("Nenhum arquivo selecionado");
const viewMode = ref("cards");
const statusMessage = ref("");
const statusType = ref("success");
const qrCodes = ref([]);
const qrRefs = ref([]);
const qrRefsTable = ref([]);

// Filtros
const searchQuery = ref("");
const filterCategory = ref("");

const qrOptions = ref({
  size: 180,
  color: "#000000",
});

const selectedDevice = computed(() => {
  if (!selectedDeviceId.value) return null;
  return devicesStore.devices.find(
    (d) => d.id === Number(selectedDeviceId.value)
  );
});

// Computed - Estatísticas e Filtros
const qrCodesByCategory = computed(() => {
  return {
    pdv: qrCodesStore.qrcodes.filter(q => q.deviceCategory === 'pdv').length,
    balanca: qrCodesStore.qrcodes.filter(q => q.deviceCategory === 'balanca').length,
    coletor: qrCodesStore.qrcodes.filter(q => q.deviceCategory === 'coletor').length,
    impressora: qrCodesStore.qrcodes.filter(q => q.deviceCategory === 'impressora').length,
    computador: qrCodesStore.qrcodes.filter(q => q.deviceCategory === 'computador').length,
    outros: qrCodesStore.qrcodes.filter(q => q.deviceCategory === 'outros').length
  }
});

const filteredQRCodes = computed(() => {
  let filtered = [...qrCodesStore.qrcodes];

  // Filtro por busca
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(qr =>
      qr.deviceName.toLowerCase().includes(query) ||
      qr.deviceSerial.toLowerCase().includes(query) ||
      qr.deviceLocation.toLowerCase().includes(query)
    );
  }

  // Filtro por categoria
  if (filterCategory.value) {
    filtered = filtered.filter(qr => qr.deviceCategory === filterCategory.value);
  }

  return filtered;
});

function clearFilters() {
  searchQuery.value = "";
  filterCategory.value = "";
}

function getCategoryLabel(category) {
  const labels = {
    pdv: "PDV",
    balanca: "Balança",
    coletor: "Coletor",
    impressora: "Impressora",
    computador: "Computador",
    outros: "Outros",
  };
  return labels[category] || category;
}

function loadDevice() {
  singleQRGenerated.value = false;
  additionalText.value = "";
}

// Gerar dados estruturados para o QR Code
function generateQRData(device, additionalInfo = "") {
  let data = `DISPOSITIVO: ${device.name}\n`;
  data += `SÉRIE: ${device.serial}\n`;
  data += `IP: ${device.ip || "N/A"}\n`;
  data += `MODELO: ${device.brand} ${device.model}\n`;
  data += `LOCAL: ${device.location}\n`;
  data += `CATEGORIA: ${getCategoryLabel(device.category)}\n`;

  if (additionalInfo) {
    data += `\nINFORMAÇÕES:\n${additionalInfo}`;
  }

  return data;
}

async function generateSingleQRCode() {
  if (!selectedDevice.value) return;

  const qrData = generateQRData(selectedDevice.value, additionalText.value);

  singleQRGenerated.value = true;

  await nextTick();

  if (singleQRRef.value) {
    singleQRRef.value.innerHTML = "";
    const canvas = document.createElement("canvas");
    singleQRRef.value.appendChild(canvas);

    try {
      await QRCode.toCanvas(canvas, qrData, {
        width: qrOptions.value.size,
        margin: 2,
        color: {
          dark: qrOptions.value.color,
          light: "#FFFFFF",
        },
      });

      // Salvar o QR code gerado no localStorage
      const imageData = canvas.toDataURL("image/png");
      qrCodesStore.addQRCode({
        deviceName: selectedDevice.value.name,
        deviceSerial: selectedDevice.value.serial,
        deviceLocation: selectedDevice.value.location,
        deviceCategory: selectedDevice.value.category,
        deviceBrand: selectedDevice.value.brand,
        deviceModel: selectedDevice.value.model,
        deviceIp: selectedDevice.value.ip,
        additionalInfo: additionalText.value,
        imageData: imageData,
        qrData: qrData,
        size: qrOptions.value.size,
        color: qrOptions.value.color,
      });
    } catch (error) {
      console.error("Erro ao gerar QR Code:", error);
    }
  }
}

function downloadSingleQRCode() {
  if (!singleQRRef.value) return;

  const canvas = singleQRRef.value.querySelector("canvas");
  if (canvas) {
    const link = document.createElement("a");
    link.download = `qrcode-${selectedDevice.value.name}.png`;
    link.href = canvas.toDataURL();
    link.click();
  }
}

function printSingleQRCode() {
  window.print();
}

// ===== SAVED QR CODES MANAGEMENT FUNCTIONS =====

function downloadQRCode(qrcode) {
  const link = document.createElement("a");
  link.download = `qrcode-${qrcode.deviceName}-${qrcode.deviceSerial}.png`;
  link.href = qrcode.imageData;
  link.click();
}

function deleteQRCode(id) {
  if (confirm("Deseja realmente excluir este QR Code?")) {
    qrCodesStore.deleteQRCode(id);
  }
}

function confirmDeleteAll() {
  if (
    confirm(
      "Deseja realmente excluir TODOS os QR Codes salvos? Esta ação não pode ser desfeita."
    )
  ) {
    qrCodesStore.deleteAllQRCodes();
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
</script>

<style scoped>
.qrcode-page {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-xl);
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

.page-subheader {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
}

.page-subheader h2 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--gray-900);
  margin: 0 0 8px 0;
}

.subheader-description {
  color: var(--gray-600);
  margin: 0;
  font-size: var(--font-size-sm);
}

.header-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.mode-btn {
  background: white;
  color: var(--gray-600);
  border: 1px solid var(--border-color);
  padding: 10px 20px;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-base);
  display: flex;
  align-items: center;
  gap: 8px;
}

.mode-btn.active,
.mode-btn:hover {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.btn-icon {
  font-size: 1.2em;
  display: inline-flex;
  align-items: center;
}

/* Single Mode */
.single-mode .qrcode-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
}

.panel-header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
  background: var(--gray-100);
}

.panel-header h2 {
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--gray-900);
}

.panel-content {
  padding: var(--spacing-lg);
}

.form-group {
  margin-bottom: var(--spacing-lg);
}

.form-group label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--gray-700);
  margin-bottom: 8px;
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
  font-family: var(--font-family);
}

.helper-text {
  display: block;
  margin-top: 6px;
  font-size: var(--font-size-xs);
  color: var(--gray-600);
  font-style: italic;
}

.device-info {
  margin: var(--spacing-lg) 0;
  padding: var(--spacing-lg);
  background: var(--gray-100);
  border-radius: var(--border-radius);
}

.device-info h4 {
  margin: 0 0 var(--spacing-md) 0;
  color: var(--gray-900);
  font-size: var(--font-size-lg);
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item .label {
  font-size: var(--font-size-xs);
  color: var(--gray-600);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.options-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.option-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.option-group label {
  font-weight: var(--font-weight-medium);
  color: var(--gray-700);
  font-size: var(--font-size-sm);
}

.option-group input[type="color"] {
  height: 45px;
  padding: 5px;
  cursor: pointer;
}

.qrcode-preview {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.qrcode-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-xl);
  background: var(--gray-100);
  border-radius: var(--border-radius-lg);
}

.qrbox-large {
  background: white;
  padding: var(--spacing-lg);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
  display: flex;
  justify-content: center;
  align-items: center;
}

.qrcode-label {
  margin: var(--spacing-md) 0 0 0;
  font-weight: var(--font-weight-semibold);
  color: var(--gray-900);
  text-align: center;
  font-size: var(--font-size-lg);
}

.qr-data-preview {
  padding: var(--spacing-lg);
  background: var(--info-light);
  border-radius: var(--border-radius);
  border-left: 4px solid var(--info);
}

.qr-data-preview h4 {
  margin: 0 0 var(--spacing-md) 0;
  color: var(--gray-900);
  font-size: var(--font-size-base);
}

.data-content p {
  margin: var(--spacing-sm) 0;
  color: var(--gray-700);
  font-size: var(--font-size-sm);
  line-height: 1.6;
}

.qrcode-actions {
  display: flex;
  gap: var(--spacing-md);
}

/* Bulk Mode */
.control-panel {
  margin-bottom: var(--spacing-xl);
}

.input-section {
  margin-bottom: var(--spacing-lg);
}

.input-label {
  display: block;
  margin-bottom: var(--spacing-sm);
  font-weight: var(--font-weight-medium);
  color: var(--gray-700);
}

textarea {
  width: 100%;
  padding: var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-family: monospace;
  font-size: var(--font-size-sm);
  resize: vertical;
  transition: var(--transition);
}

textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-alpha);
}

.file-upload {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
}

.file-upload-label {
  background: var(--primary);
  color: white;
  padding: 10px 20px;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  font-weight: var(--font-weight-medium);
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.file-upload-label:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
}

.file-upload input[type="file"] {
  display: none;
}

.file-name {
  font-style: italic;
  color: var(--gray-600);
  font-size: var(--font-size-sm);
}

.actions {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
  margin-bottom: var(--spacing-md);
}

.status {
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  font-weight: var(--font-weight-medium);
  margin-top: var(--spacing-md);
}

.status.error {
  background-color: var(--danger-light);
  color: var(--danger);
  border-left: 4px solid var(--danger);
}

.status.success {
  background-color: var(--success-light);
  color: var(--success);
  border-left: 4px solid var(--success);
}

.view-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.view-toggle {
  display: flex;
  gap: var(--spacing-sm);
}

.view-btn {
  background: white;
  color: var(--gray-600);
  border: 1px solid var(--border-color);
  padding: 10px 20px;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  font-weight: var(--font-weight-medium);
  display: flex;
  align-items: center;
  gap: 6px;
}

.view-btn.active,
.view-btn:hover {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.results-info {
  color: var(--gray-600);
  font-weight: var(--font-weight-medium);
}

.qr-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.qr-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.qr-card.saved {
  padding-bottom: var(--spacing-md);
}

.qr-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: var(--font-size-lg);
  padding: 4px 8px;
  border-radius: var(--border-radius);
  transition: var(--transition);
  opacity: 0.6;
}

.delete-btn:hover {
  background: var(--danger-light);
  opacity: 1;
  transform: scale(1.1);
}

.qr-badge {
  background: var(--success);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
}

.qr-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: var(--spacing-md);
}

.qr-code-wrapper {
  background: white;
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--border-color);
}

.qr-details {
  width: 100%;
  text-align: center;
}

.qr-details h3 {
  font-size: var(--font-size-lg);
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--gray-900);
  font-weight: var(--font-weight-semibold);
  word-break: break-all;
}

.qr-details p {
  color: var(--gray-600);
  margin: 0 0 var(--spacing-sm) 0;
  font-size: var(--font-size-sm);
}

.qr-details .quantity {
  display: inline-block;
  background: var(--info-light);
  color: var(--info);
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-xs);
}

.qr-info {
  color: var(--gray-600);
  margin: 4px 0;
  font-size: var(--font-size-xs);
  text-align: left;
  width: 100%;
  line-height: 1.5;
}

.qr-date {
  color: var(--gray-500);
  font-size: var(--font-size-xs);
  font-style: italic;
  margin-top: var(--spacing-sm);
  text-align: center;
}

.qr-actions {
  width: 100%;
  display: flex;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
}

.qr-image {
  width: 120px;
  height: 120px;
  object-fit: contain;
}

.qr-image-small {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

.table-actions {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: center;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: var(--font-size-lg);
  padding: 6px 10px;
  border-radius: var(--border-radius);
  transition: var(--transition);
  opacity: 0.7;
}

.action-btn:hover {
  opacity: 1;
  transform: scale(1.1);
}

.action-btn.download:hover {
  background: var(--success-light);
}

.action-btn.delete:hover {
  background: var(--danger-light);
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: var(--spacing-md);
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

th {
  background: var(--gray-100);
  font-weight: var(--font-weight-semibold);
  color: var(--gray-700);
}

tr:hover {
  background: var(--gray-100);
}

.qr-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.qrbox {
  display: flex;
  justify-content: center;
  align-items: center;
}

.empty-state {
  text-align: center;
  padding: var(--spacing-3xl);
  color: var(--gray-600);
  background: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-lg);
  opacity: 0.3;
  display: flex;
  justify-content: center;
  align-items: center;
}

.empty-icon svg {
  width: 4rem;
  height: 4rem;
}

.empty-state h3 {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-sm);
  color: var(--gray-900);
}

.empty-state p {
  font-size: var(--font-size-base);
}

/* Stats Grid for QR Codes */
.stats-grid.qr-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.stat-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-sm);
}

.stat-card .stat-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--border-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
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

/* Filtros e Busca */
.filters-card {
  margin-bottom: var(--spacing-xl);
}

.filters-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
  padding: var(--spacing-md);
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 250px;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: var(--gray-500);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 10px 40px 10px 40px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: var(--font-size-base);
  transition: var(--transition);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-alpha);
}

.clear-search {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: var(--border-radius);
  transition: var(--transition);
  color: var(--gray-500);
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-search:hover {
  background: var(--gray-200);
  color: var(--gray-700);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--gray-700);
  white-space: nowrap;
}

.filter-select {
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: var(--font-size-base);
  background: white;
  cursor: pointer;
  transition: var(--transition);
  min-width: 150px;
}

.filter-select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-alpha);
}

.filter-indicator {
  color: var(--gray-500);
  font-size: var(--font-size-xs);
  font-style: italic;
}

@media (max-width: 968px) {
  .single-mode .qrcode-container {
    grid-template-columns: 1fr;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .options-grid {
    grid-template-columns: 1fr;
  }

  .qrcode-actions {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .qr-grid {
    grid-template-columns: 1fr;
  }
}

@media print {
  .page-header,
  .control-panel,
  .view-options,
  .panel-content,
  .mode-btn,
  .qrcode-actions {
    display: none !important;
  }

  .panel-header {
    display: none !important;
  }

  .qrcode-display {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .qr-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 10mm;
  }

  .qr-card {
    break-inside: avoid;
    page-break-inside: avoid;
  }
}
</style>
