import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useEmployeesStore = defineStore('employees', () => {
  const employees = ref([
    {
      id: 1,
      name: 'Maria Silva',
      department: 'caixa',
      position: 'Operadora de Caixa',
      extension: '2001',
      email: 'maria.silva@assai.com.br',
      photo: null
    },
    {
      id: 2,
      name: 'João Santos',
      department: 'administrativo',
      position: 'Assistente Administrativo',
      extension: '2010',
      email: 'joao.santos@assai.com.br',
      photo: null
    },
    {
      id: 3,
      name: 'Ana Costa',
      department: 'estoque',
      position: 'Conferente',
      extension: '2020',
      email: 'ana.costa@assai.com.br',
      photo: null
    },
    {
      id: 4,
      name: 'Carlos Oliveira',
      department: 'gerencia',
      position: 'Gerente de Loja',
      extension: '2000',
      email: 'carlos.oliveira@assai.com.br',
      photo: null
    }
  ])

  const departments = [
    { value: 'caixa', label: 'Caixa' },
    { value: 'administrativo', label: 'Administrativo' },
    { value: 'estoque', label: 'Estoque' },
    { value: 'gerencia', label: 'Gerência' }
  ]

  // Computed
  const totalEmployees = computed(() => employees.value.length)

  function getEmployeesByDepartment(department) {
    return employees.value.filter(e => e.department === department)
  }

  return {
    employees,
    departments,
    totalEmployees,
    getEmployeesByDepartment
  }
})
