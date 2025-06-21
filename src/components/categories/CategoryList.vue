<template>
    <DataTable
        :value="categories"
        paginator
        :rows="rowsPerPage"
        :lazy="true"
        :totalRecords="totalRecords"
        :first="first"
        :loading
        @page="getCategories"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[10, 30, 50]"
        currentPageReportTemplate="Mostrando {last} de {totalRecords} categorías"
    >
        <template #empty> Sin registros. </template>
        <Column field="nombre" header="Categoría"> </Column>
        <Column class="w-32">
            <template #header> <p class="mx-auto font-semibold">Acciones</p> </template>
            <template #body="{ data }">
                <div class="flex justify-center gap-2">
                    <Button
                        icon="pi pi-pencil"
                        severity="secondary"
                        variant="outlined"
                        rounded
                        @click="$emit('editCategory', data)"
                        v-tooltip.top="'Editar Categoría'"
                        size="large"
                    />
                    <Button
                        icon="pi pi-trash"
                        severity="secondary"
                        variant="outlined"
                        rounded
                        @click="deleteCategory(data)"
                        v-tooltip.top="'Eliminar Categoría'"
                        size="large"
                    />
                </div>
            </template>
        </Column>
    </DataTable>
    <ConfirmDialog></ConfirmDialog>
</template>
<script setup>
import { api } from '@/service/api';
import { useConfirm } from 'primevue';
import { useToast } from 'primevue/usetoast';
import { defineEmits, defineExpose, onMounted, ref } from 'vue';
const categories = ref([]);
const confirm = useConfirm();
const first = ref(0);
const loading = ref(false);
const totalRecords = ref(0);
const rowsPerPage = ref(10);
const toast = useToast();
const emit = defineEmits(['editCategory']);
onMounted(() => getCategories({ first: first.value, rows: rowsPerPage.value }));

const getCategories = async (event) => {
    try {
        first.value = event.first;
        rowsPerPage.value = event.rows ?? rowsPerPage.value;
        loading.value = true;
        const result = await api.get('/categories', {
            params: { rows: rowsPerPage.value, first: first.value, search: event.search }
        });
        totalRecords.value = result.data.totalRecords;
        categories.value = result.data.data;
    } catch (error) {
        console.log(error);
        toast.add({
            severity: 'error',
            summary: 'Operación fallida',
            detail: 'No se pudo obtener las categorías',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};
const deleteCategory = (data) => {
    confirm.require({
        message: `Estas seguro de eliminar la categoría ${data.nombre}?`,
        header: 'Eliminar Categoría',
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
            await api.patch(`/categories/${data.id}`, { deleted_at: new Date() });
            getCategories({ first: first.value, rows: rowsPerPage.value });
            toast.add({
                severity: 'success',
                summary: 'Operación exitosa',
                detail: 'La categoría ha sido eliminada',
                life: 3000
            });
        }
    });
};
defineExpose({ getCategories });
</script>
