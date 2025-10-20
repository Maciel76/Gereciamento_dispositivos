import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useActivitiesStore } from "./activities";

export const useDevicesStore = defineStore("devices", () => {
  // Carregar devices do localStorage ou usar dados iniciais
  const loadDevices = () => {
    const stored = localStorage.getItem("devices");
    if (stored) {
      return JSON.parse(stored);
    }
    // Dados iniciais
    return [
      {
        id: 1,
        name: "PDV01-CPU",
        category: "pdv",
        type: "cpu",
        brand: "Dell",
        model: "Optiplex 3090",
        serial: "ABC123456",
        ip: "192.168.1.100",
        location: "PDV 01",
        sector: "caixa",
        status: "online",
        lastSeen: new Date(),
      },
      {
        id: 2,
        name: "PDV01-Monitor",
        category: "pdv",
        type: "monitor",
        brand: "LG",
        model: "LG 20M35",
        serial: "MON789123",
        ip: null,
        location: "PDV 01",
        sector: "caixa",
        status: "online",
        lastSeen: new Date(),
      },
      {
        id: 3,
        name: "IMPRESSORA-TERMICA-01",
        category: "impressora",
        type: "termica",
        brand: "Zebra",
        model: "GK420t",
        serial: "IMP001",
        ip: "192.168.1.201",
        location: "Expedicao",
        sector: "estoque",
        status: "online",
        lastSeen: new Date(),
      },
      {
        id: 4,
        name: "COLETOR-RF-01",
        category: "coletor",
        type: "rf",
        brand: "Zebra",
        model: "MC3300",
        serial: "COL456789",
        ip: "192.168.1.220",
        location: "Depósito",
        sector: "estoque",
        status: "offline",
        lastSeen: new Date(Date.now() - 3600000),
      },
      {
        id: 5,
        name: "BALANCA-HORTIFRUTI-01",
        category: "balanca",
        type: "setor",
        brand: "Toledo",
        model: "Prix 4 Due",
        serial: "BAL987654",
        ip: "192.168.1.150",
        location: "Hortifruti",
        sector: "vendas",
        status: "online",
        lastSeen: new Date(),
      },
      {
        id: 6,
        name: "PC-ADM-01",
        category: "computador",
        type: "adm",
        brand: "HP",
        model: "ProDesk 600",
        serial: "PC112233",
        ip: "192.168.1.50",
        location: "Administrativo",
        sector: "administrativo",
        status: "online",
        lastSeen: new Date(),
      },
    ];
  };

  const devices = ref(loadDevices());

  const categories = {
    pdv: [
      "cpu",
      "monitor",
      "pinpad",
      "scanner_mao",
      "scanner_mesa",
      "teclado",
      "balanca",
      "impressora_Termica",
    ],
    balanca: ["checkout", "setor"],
    coletor: ["Operação", "Conferencia"],
    impressora: ["Adm", "etiqueta", "Nao_fiscal"],
    computador: ["adm", "Outros"],
  };

  // Salvar no localStorage
  function saveToLocalStorage() {
    localStorage.setItem("devices", JSON.stringify(devices.value));
  }

  // Computed
  const totalDevices = computed(() => devices.value.length);
  const onlineDevices = computed(
    () => devices.value.filter((d) => d.status === "online").length
  );
  const offlineDevices = computed(
    () => devices.value.filter((d) => d.status === "offline").length
  );

  // Contadores por categoria
  const devicesByCategory = computed(() => {
    return {
      pdv: devices.value.filter((d) => d.category === "pdv").length,
      balanca: devices.value.filter((d) => d.category === "balanca").length,
      coletor: devices.value.filter((d) => d.category === "coletor").length,
      impressora: devices.value.filter((d) => d.category === "impressora")
        .length,
      computador: devices.value.filter((d) => d.category === "computador")
        .length,
    };
  });

  // Actions
  function addDevice(device) {
    const activitiesStore = useActivitiesStore();

    const newDevice = {
      ...device,
      id: Math.max(0, ...devices.value.map((d) => d.id)) + 1,
      lastSeen: new Date(),
    };
    devices.value.push(newDevice);
    saveToLocalStorage();

    // Registrar atividade
    activitiesStore.trackAction(
      "dispositivo",
      "Novo dispositivo cadastrado",
      `Dispositivo ${newDevice.name} foi adicionado ao inventário`,
      newDevice.name
    );

    return newDevice;
  }

  function updateDevice(id, updates) {
    const activitiesStore = useActivitiesStore();
    const index = devices.value.findIndex((d) => d.id === id);

    if (index !== -1) {
      const oldDevice = { ...devices.value[index] };
      devices.value[index] = { ...devices.value[index], ...updates };
      saveToLocalStorage();

      // Registrar atividade
      let description = `Dispositivo ${devices.value[index].name} foi atualizado`;

      // Detectar mudança de status
      if (updates.status && updates.status !== oldDevice.status) {
        description = `Status do dispositivo ${devices.value[index].name} alterado de ${oldDevice.status} para ${updates.status}`;
      }

      activitiesStore.trackAction(
        "dispositivo",
        "Dispositivo atualizado",
        description,
        devices.value[index].name
      );

      return devices.value[index];
    }
    return null;
  }

  function deleteDevice(id) {
    const activitiesStore = useActivitiesStore();
    const index = devices.value.findIndex((d) => d.id === id);

    if (index !== -1) {
      const deviceName = devices.value[index].name;
      devices.value.splice(index, 1);
      saveToLocalStorage();

      // Registrar atividade
      activitiesStore.trackAction(
        "dispositivo",
        "Dispositivo removido",
        `Dispositivo ${deviceName} foi excluído do inventário`,
        deviceName
      );

      return true;
    }
    return false;
  }

  function getDevicesByCategory(category) {
    return devices.value.filter((d) => d.category === category);
  }

  function getDevicesBySector(sector) {
    return devices.value.filter((d) => d.sector === sector);
  }

  return {
    devices,
    categories,
    totalDevices,
    onlineDevices,
    offlineDevices,
    devicesByCategory,
    addDevice,
    updateDevice,
    deleteDevice,
    getDevicesByCategory,
    getDevicesBySector,
  };
});
