<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AppMenuItem from './AppMenuItem.vue';
const route = useRoute();
const model = computed(() =>
    route.path.includes('admin')
        ? [
              {
                  label: 'Principal',
                  items: [
                      { label: 'Dashboard', icon: 'bx bx-home', to: '/admin/dashboard' },
                      { label: 'Punto de Venta', icon: 'bx bx-restaurant', to: '/pos' },
                      {
                          label: 'Ventas',
                          icon: 'bx bx-dollar',
                          to: '/admin/sales'
                      }
                  ]
              },
              {
                  separator: true
              },
              {
                  label: 'Administración',
                  items: [
                      { label: 'Productos', icon: 'bx bx-coffee', to: '/admin/products' },
                      { label: 'Categorias', icon: 'bx bx-category', to: '/admin/categories' },
                      { label: 'Clientes', icon: 'bx bx-user', to: '/admin/customers' },
                      { label: 'Proveedores', icon: 'bx bxs-truck', to: '/admin/providers' }
                  ]
              },
              {
                  separator: true
              },
              {
                  label: 'Acceso',
                  items: [
                      { label: 'Usuarios', icon: 'bx bx-group', to: '/admin/users' },
                      { label: 'Roles', icon: 'bx bx-shield', to: '/admin/roles' }
                  ]
              },
              {
                  separator: true
              },
              {
                  label: 'Reportes',
                  items: [
                      {
                          label: 'Ventas',
                          icon: 'bx bx-receipt',
                          to: '/admin/reports/sales'
                      },
                      {
                          label: 'Compras',
                          icon: 'bx bx-pie-chart-alt',
                          to: '/admin/reports/purchases'
                      }
                  ]
              },
              {
                  separator: true
              },
              {
                  label: 'Configuración',
                  items: [
                      {
                          label: 'Cajas',
                          icon: 'bx bx-wallet',
                          to: '/admin/cash-registers'
                      },
                      {
                          label: 'Impresoras',
                          icon: 'bx bx-printer',
                          to: '/admin/printers'
                      },
                      { label: 'Salas y mesas', icon: 'bx bx-table', to: '/admin/rooms' },
                      {
                          label: 'Turnos',
                          icon: 'bx bx-time',
                          to: '/admin/shifts'
                      }
                  ]
              }
          ]
        : [
              {
                  label: 'Principal',
                  items: [
                      { label: 'Mesas', icon: 'bx bx-home', to: '/pos' },
                      { label: 'Ordenes', icon: 'bx bx-restaurant', to: 'pos/orders' }
                  ]
              }
          ]
);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="border border-gray-100 mt-2 mb-6"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
