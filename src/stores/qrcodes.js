import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useQRCodesStore = defineStore("qrcodes", () => {
  // Carregar QR codes do localStorage
  const loadQRCodes = () => {
    const stored = localStorage.getItem("qrcodes");
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  };

  const qrcodes = ref(loadQRCodes());

  // Salvar no localStorage
  function saveToLocalStorage() {
    localStorage.setItem("qrcodes", JSON.stringify(qrcodes.value));
  }

  // Computed
  const totalQRCodes = computed(() => qrcodes.value.length);

  // Actions
  function addQRCode(qrcode) {
    const newQRCode = {
      ...qrcode,
      id: Date.now(), // Usar timestamp como ID único
      createdAt: new Date().toISOString(),
    };
    qrcodes.value.unshift(newQRCode); // Adicionar no início da lista
    saveToLocalStorage();
    return newQRCode;
  }

  function deleteQRCode(id) {
    const index = qrcodes.value.findIndex((q) => q.id === id);
    if (index !== -1) {
      qrcodes.value.splice(index, 1);
      saveToLocalStorage();
      return true;
    }
    return false;
  }

  function deleteAllQRCodes() {
    qrcodes.value = [];
    saveToLocalStorage();
  }

  function getQRCodeById(id) {
    return qrcodes.value.find((q) => q.id === id);
  }

  return {
    qrcodes,
    totalQRCodes,
    addQRCode,
    deleteQRCode,
    deleteAllQRCodes,
    getQRCodeById,
  };
});
