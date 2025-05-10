<template>
    <div class="card">
        <div class="flex justify-between items-center mb-10">
            <h1 class="text-4xl text-black font-bold !mb-0">Turnos</h1>
            <Button
                severity="primary"
                class="!h-[3.2rem]"
                label="Agregar Turno"
                icon="pi pi-plus"
                @click="showModal = true"
            />
        </div>
        <div class="flex justify-between gap-4 mt-5 mb-3">
            <IconField>
                <InputIcon>
                    <i class="pi pi-search" />
                </InputIcon>
                <InputText
                    placeholder="Buscar por nombre"
                    @input="searchShift"
                    v-model="searchInput"
                    class="min-w-[350px]"
                />
            </IconField>
        </div>
        <DataTable :value="shifts" :loading>
            <template #empty> Sin registros. </template>
            <Column field="nombre" header="Nombre"> </Column>
            <Column class="w-32">
                <template #header> <p class="mx-auto font-semibold">Acciones</p> </template>
                <template #body="{ data }">
                    <div class="flex justify-center gap-2">
                        <Button
                            icon="pi pi-pencil"
                            severity="secondary"
                            variant="outlined"
                            rounded
                            @click="editShift(data)"
                            v-tooltip.top="'Editar Turno'"
                            size="large"
                        />
                        <Button
                            icon="pi pi-trash"
                            severity="secondary"
                            variant="outlined"
                            rounded
                            @click="deleteCategory(data)"
                            v-tooltip.top="'Eliminar Turno'"
                            size="large"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>
        <ShiftForm
            :visible="showModal"
            @closeModal="
                showModal = false;
                shiftData = {};
            "
            :shiftData
            @newChanges="fetchData()"
        />
    </div>
</template>

<script setup>
import ShiftForm from '@/components/shifts/ShiftForm.vue';
import pb from '@/service/pocketbase';
import debounce from '@/utils/debounce';
import { useToast } from 'primevue';
import { onMounted, ref } from 'vue';
const searchInput = ref('');
const showModal = ref(false);
const shiftData = ref({});
const shifts = ref([]);
const toast = useToast();
const loading = ref(false);
const editShift = (data) => {
    showModal.value = true;
    shiftData.value = data;
};
const searchShift = debounce(() => {
    fetchData();
}, 300);
const fetchData = async () => {
    try {
        loading.value = true;
        const result = await pb.collection('turnos').getFullList({
            sort: '-created',
            filter: `nombre~'${searchInput.value}'`
        });
        shifts.value = result;
    } catch (error) {
        console.log(error);
        toast.add({
            severity: 'error',
            summary: 'Operación fallida',
            detail: 'No se pudieron cargar los turnos',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};
onMounted(() => fetchData());
</script>
