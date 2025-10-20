import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useActivitiesStore = defineStore('activities', () => {
  // Carregar atividades do localStorage
  const loadActivities = () => {
    const stored = localStorage.getItem('activities')
    return stored ? JSON.parse(stored) : []
  }

  const activities = ref(loadActivities())

  // Salvar no localStorage sempre que modificar
  function saveToLocalStorage() {
    localStorage.setItem('activities', JSON.stringify(activities.value))
  }

  // Adicionar nova atividade
  function addActivity(activity) {
    const newActivity = {
      id: Date.now(),
      timestamp: new Date(),
      ...activity
    }
    activities.value.unshift(newActivity)
    saveToLocalStorage()
    return newActivity
  }

  // Registrar atividade do sistema
  function trackAction(type, title, description, device = null, duration = null) {
    return addActivity({
      type: type, // 'sistema', 'manual', 'chamado', 'dispositivo'
      title,
      description,
      device,
      duration
    })
  }

  // Limpar atividades antigas (opcional)
  function clearOldActivities(daysToKeep = 30) {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

    activities.value = activities.value.filter(
      activity => new Date(activity.timestamp) > cutoffDate
    )
    saveToLocalStorage()
  }

  return {
    activities,
    addActivity,
    trackAction,
    clearOldActivities
  }
})
