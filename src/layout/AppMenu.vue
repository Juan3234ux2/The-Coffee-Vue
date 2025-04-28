<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Acciones',
        items: [
            { label: 'Dashboard', icon: 'bx bx-home', to: '/admin/dashboard' },
            { label: 'Punto de Venta', icon: 'bx bx-restaurant', to: '/pos' },
            { label: 'Clientes', icon: 'bx bx-user', to: '/admin/customers' },
            { label: 'Productos', icon: 'bx bx-coffee', to: '/admin/products' },
            { label: 'Categorias', icon: 'bx bx-category', to: '/admin/categories' },
            { label: 'Ventas', icon: 'bx bx-dollar', to: '/admin/orders' },
            { label: 'Reportes', icon: 'bx bx-bar-chart-alt', to: '/admin/reports' },
            {
                label: 'Configuraciones',
                icon: 'bx bx-cog',
                items: [
                    { label: 'Cajas', to: '/admin/cash-register' },
                    { label: 'Roles', to: '/admin/roles' },
                    { label: 'Salas y Mesas', to: '/admin/rooms' },
                    { label: 'Usuarios', to: '/admin/users' }
                ]
            }
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
