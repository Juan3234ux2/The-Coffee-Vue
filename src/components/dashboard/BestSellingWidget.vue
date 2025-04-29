<script setup>
import formatCurrency from '@/utils/formatCurrency';
import { ref } from 'vue';
const products = ref([
    {
        codigo: 13,
        nombre: 'Café Americano',
        precio: 3000,
        vendido: 150
    },
    {
        codigo: 21,
        nombre: 'Café Latte',
        precio: 5000,
        vendido: 120
    },
    {
        codigo: 32,
        nombre: 'Jugo de Naranja',
        precio: 3500,
        vendido: 100
    },
    {
        codigo: 10,
        nombre: 'Café con Leche',
        precio: 4000,
        vendido: 80
    },
    {
        codigo: 5,
        nombre: 'Café Espresso',
        precio: 3000,
        vendido: 60
    }
]);
</script>

<template>
    <div class="card !mb-2">
        <div class="flex justify-between items-center mb-6">
            <p class="font-semibold text-xl text-black !mb-0">Productos Populares</p>
            <SelectButton default-value="Semanal" :options="['Semanal', 'Mensual']" />
        </div>

        <DataTable :value="products" size="large">
            <Column field="codigo" header="Cód"></Column>
            <Column field="nombre" header="Nombre"></Column>
            <Column header="Precio">
                <template #body="slotProps">
                    <span>{{ formatCurrency(slotProps.data.precio) }}</span>
                </template>
            </Column>
            <Column field="vendido" class="text-primary font-bold" header="Vendidos"></Column>
        </DataTable>
    </div>
</template>
