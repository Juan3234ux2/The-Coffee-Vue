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
        class="text-nowrap"
    >
        <template #empty> Sin registros. </template>
        <Column header="Cód.">
            <template #body="{ data }">
                {{ data.codigo ?? '-' }}
            </template>
        </Column>
        <Column field="nombre" header="Producto"> </Column>
        <Column header="Categoría">
            <template #body="{ data }">
                {{ data.categoria.nombre }}
            </template>
        </Column>
        <Column header="Costo">
            <template #body="{ data }">
                {{ data?.costo ? formatCurrency(data.costo) : '-' }}
            </template>
        </Column>
        <Column header="Margen $">
            <template #body="{ data }">
                {{ data?.costo ? formatCurrency(data.precio - data.costo) : '-' }}
            </template>
        </Column>
        <Column header="Margen %">
            <template #body="{ data }">
                {{
                    data?.costo
                        ? (((data.precio - data.costo) * 100) / data.precio).toFixed(2) + '%'
                        : '-'
                }}
            </template>
        </Column>
        <Column header="Precio">
            <template #body="{ data }">
                {{ formatCurrency(data.precio) }}
            </template>
        </Column>
        <Column header="Estado">
            <template #body="{ data }">
                <Tag
                    :value="data.activo ? 'Activo' : 'Inactivo'"
                    :severity="data.activo ? 'success' : 'danger'"
                ></Tag>
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
                        as="router-link"
                        :to="`/admin/products/edit/${data.id}`"
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
import { api } from '@/service/api.js';
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
        loading.value = true;
        first.value = event.first;
        rowsPerPage.value = event.rows ?? rowsPerPage.value;
        const search = event.search;
        const categories = event.categories;
        const status = event.status;
        console.log(categories);
        const result = await api.get('/products', {
            params: {
                rows: rowsPerPage.value,
                first: first.value,
                categories: categories,
                search,
                status
            }
        });
        totalRecords.value = result.data.totalRecords;
        products.value = result.data.data;
    } catch (error) {
        console.log(error);
        toast.add({
            severity: 'error',
            summary: 'Operación fallida',
            detail: 'No se pudo obtener los productos',
            life: 3000
        });
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
            await api.patch(`/products/${data.id}`, { deleted_at: new Date() });
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
