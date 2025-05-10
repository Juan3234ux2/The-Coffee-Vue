<template>
    <DataTable
        :value="users"
        paginator
        :rows="rowsPerPage"
        :lazy="true"
        :totalRecords="totalRecords"
        :first="first"
        :loading
        @page="getUsers"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[10, 30, 50]"
        currentPageReportTemplate="Mostrando {last} de {totalRecords} usuarios"
    >
        <template #empty> Sin registros. </template>
        <Column field="name" header="Nombre"> </Column>
        <Column field="email" header="Email"> </Column>
        <Column header="Rol">
            <template #body="{ data }">
                {{ data?.expand?.role_id?.nombre }}
            </template>
        </Column>
        <Column header="Último Acceso">
            <template #body="{ data }">
                {{ data?.last_login ? dayjs(data.last_login).format('DD/MM/YYYY HH:mm:ss') : '-' }}
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
                        v-tooltip.top="'Editar Usuario'"
                        size="large"
                        @click="$emit('editUser', data)"
                    />
                    <Button
                        icon="pi pi-trash"
                        severity="secondary"
                        variant="outlined"
                        rounded
                        @click="deleteUser(data)"
                        v-tooltip.top="'Eliminar Usuario'"
                        size="large"
                        :class="{
                            invisible: store.getUserLogged?.id === data.id
                        }"
                    />
                </div>
            </template>
        </Column>
    </DataTable>
    <ConfirmDialog></ConfirmDialog>
</template>
<script setup>
import pb from '@/service/pocketbase.js';
import { useIndexStore } from '@/storage';
import dayjs from 'dayjs/esm';
import { useConfirm } from 'primevue';
import { useToast } from 'primevue/usetoast';
import { defineEmits, defineExpose, onMounted, ref } from 'vue';
const users = ref([]);
const confirm = useConfirm();
const first = ref(0);
const loading = ref(false);
const totalRecords = ref(0);
const rowsPerPage = ref(10);
const toast = useToast();
const store = useIndexStore();
const emit = defineEmits(['editUser']);
onMounted(() => getUsers({ first: first.value, rows: rowsPerPage.value }));

const getUsers = async (event) => {
    try {
        first.value = event.first;
        rowsPerPage.value = event.rows ?? rowsPerPage.value;
        loading.value = true;
        const search = event.search;
        const currentPage = Math.floor(first.value / rowsPerPage.value) + 1;
        const result = await pb.collection('users').getList(currentPage, rowsPerPage.value, {
            sort: '-created',
            filter: `(name~'${search ?? ''}' || email~'${search ?? ''}') && activo~'${event.status ?? ''}' && deleted=null && cafeteria_id='${pb.authStore.record.cafeteria_id}'`,
            expand: 'role_id',
            fields: 'id, name, email, phone,activo, last_login, expand.role_id.id, expand.role_id.nombre,cash_register_id,'
        });
        totalRecords.value = result.totalItems;
        users.value = result.items;
    } catch (error) {
        console.log(error);
        if (!error.message.includes('The request was autocancelled')) {
            toast.add({
                severity: 'error',
                summary: 'Operación fallida',
                detail: 'No se pudo obtener los usuarios',
                life: 3000
            });
        }
    } finally {
        loading.value = false;
    }
};
const deleteUser = (data) => {
    if (store.getUserLogged?.id !== data.id) return;
    confirm.require({
        message: `Estas seguro de eliminar al usuario ${data.name}?`,
        header: 'Eliminar Usuario',
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
            await pb.collection('usuario').update(data.id, { deleted: new Date() });
            getUsers({ first: first.value, rows: rowsPerPage.value });
            toast.add({
                severity: 'success',
                summary: 'Operación exitosa',
                detail: 'El usuario ha sido eliminado',
                life: 3000
            });
        }
    });
};
defineExpose({ getUsers });
</script>
