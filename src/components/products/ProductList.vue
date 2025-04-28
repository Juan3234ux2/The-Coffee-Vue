<template>
    <DataTable
        :value="products"
        paginator
        :rows="rowsPerPage"
        :lazy="true"
        :totalRecords="totalRecords"
        :first="first"
        :loading
        @page="getProducts"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[10, 30, 50]"
        currentPageReportTemplate="Mostrando {last} de {totalRecords} productos"
    >
        <template #empty> Sin registros. </template>
        <Column field="codigo" class="w-28" header="Cód."> </Column>
        <Column field="nombre" header="Producto"> </Column>
        <Column header="Categoría">
            <template #body="{ data }">
                {{ data.expand?.categoria_id?.nombre }}
            </template>
        </Column>
        <Column header="Costo">
            <template #body="{ data }">
                {{ formatCurrency(data.costo) }}
            </template>
        </Column>
        <Column header="Margen $">
            <template #body="{ data }">
                {{ formatCurrency(data.precio - data.costo) }}
            </template>
        </Column>
        <Column header="Margen %">
            <template #body="{ data }">
                {{ (((data.precio - data.costo) * 100) / data.precio).toFixed(2) }}%
            </template>
        </Column>
        <Column header="Precio">
            <template #body="{ data }">
                {{ formatCurrency(data.precio) }}
            </template>
        </Column>
        <Column class="w-32">
            <template #header> <p class="mx-auto font-semibold">Acciones</p> </template>
            <template #body="{ data }">
                <div class="flex justify-center gap-2">
                    <Button
                        icon="pi pi-pencil"
                        severity="secondary"
                        variant="outlined"
                        rounded
                        v-tooltip.top="'Editar Producto'"
                        size="large"
                    />
                    <Button
                        icon="pi pi-trash"
                        severity="secondary"
                        variant="outlined"
                        rounded
                        @click="deleteProduct(data)"
                        v-tooltip.top="'Eliminar Producto'"
                        size="large"
                    />
                </div>
            </template>
        </Column>
    </DataTable>
    <ConfirmDialog></ConfirmDialog>
</template>
<script setup>
import pb from '@/service/pocketbase.js';
import formatCurrency from '@/utils/formatCurrency';
import { useConfirm } from 'primevue';
import { useToast } from 'primevue/usetoast';
import { defineExpose, onMounted, ref } from 'vue';
const products = ref([]);
const confirm = useConfirm();
const first = ref(0);
const loading = ref(false);
const totalRecords = ref(0);
const rowsPerPage = ref(10);
const toast = useToast();
onMounted(() => getProducts({ first: first.value, rows: rowsPerPage.value }));

const getProducts = async (event) => {
    try {
        first.value = event.first;
        rowsPerPage.value = event.rows ?? rowsPerPage.value;
        loading.value = true;
        const search = event.search;
        const categoryFilter = event?.categories?.length
            ? ` && (${event.categories.map((id) => `categoria_id='${id}'`).join(' || ')})`
            : '';
        const currentPage = Math.floor(first.value / rowsPerPage.value) + 1;
        const result = await pb.collection('productos').getList(currentPage, rowsPerPage.value, {
            sort: '-created',
            filter: `(nombre~'${search ?? ''}' || codigo~'${search ?? ''}') && activo='${event.status ?? 1}' && deleted=null ${categoryFilter}`,
            fields: 'id,codigo, nombre, precio, costo, expand.categoria_id, activo, categoria_id',
            expand: 'categoria_id'
        });

        totalRecords.value = result.totalItems;
        products.value = result.items;
    } catch (error) {
        console.log(error);
        if (!error.message.includes('The request was autocancelled')) {
            toast.add({
                severity: 'error',
                summary: 'Operación fallida',
                detail: 'No se pudo obtener los productos',
                life: 3000
            });
        }
    } finally {
        loading.value = false;
    }
};
const deleteProduct = (data) => {
    confirm.require({
        message: `Estas seguro de eliminar el producto ${data.nombre}?`,
        header: 'Eliminar Producto',
        icon: 'pi pi-info-circle',
        rejectProps: {
            label: 'Cancelar',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Eliminar',
            severity: 'danger'
        },
        accept: async () => {
            await pb.collection('productos').update(data.id, { deleted: new Date() });
            getProducts({ first: first.value, rows: rowsPerPage.value });
            toast.add({
                severity: 'success',
                summary: 'Operación exitosa',
                detail: 'El producto ha sido eliminado',
                life: 3000
            });
        }
    });
};
defineExpose({ getProducts });
</script>
