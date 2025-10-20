import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { icon: '📊', title: 'Dashboard' }
  },
  {
    path: '/devices',
    name: 'Devices',
    component: () => import('../views/Devices.vue'),
    meta: { icon: '🖥️', title: 'Inventário de Dispositivos' }
  },
  {
    path: '/tickets',
    name: 'Tickets',
    component: () => import('../views/Tickets.vue'),
    meta: { icon: '🎫', title: 'Chamados Técnicos' }
  },
  {
    path: '/employees',
    name: 'Employees',
    component: () => import('../views/Employees.vue'),
    meta: { icon: '👥', title: 'Colaboradores' }
  },
  {
    path: '/network',
    name: 'Network',
    component: () => import('../views/Network.vue'),
    meta: { icon: '🌐', title: 'Monitor de Rede' }
  },
  {
    path: '/timeline',
    name: 'Timeline',
    component: () => import('../views/Timeline.vue'),
    meta: { icon: '⏰', title: 'Timeline de Atividades' }
  },
  {
    path: '/qrcode',
    name: 'QRCode',
    component: () => import('../views/QRCode.vue'),
    meta: { icon: '🔷', title: 'Gerar QR Code' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
