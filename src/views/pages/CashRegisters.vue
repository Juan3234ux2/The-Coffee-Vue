<template>
    <div class="card">
        <div class="flex justify-between items-center mb-10">
            <h1 class="text-4xl text-black font-bold !mb-0">Cajas</h1>
            <Button
                severity="primary"
                class="!h-[3.2rem]"
                label="Agregar Caja"
                icon="pi pi-plus"
                @click="
                    () => {
                        showModal = true;
                    }
                "
            />
        </div>
        <div class="flex justify-between gap-4 mt-5 mb-3">
            <IconField>
                <InputIcon>
                    <i class="pi pi-search" />
                </InputIcon>
                <InputText
                    placeholder="Buscar por nombre"
                    @input="searchCategories"
                    v-model="searchInput"
                    class="min-w-[350px]"
                />
            </IconField>
        </div>
        <DataTable :value="cashRegisters" :loading>
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
                            @click="editCashRegister(data)"
                            v-tooltip.top="'Editar Caja'"
                            size="large"
                        />
                        <Button
                            icon="pi pi-trash"
                            severity="secondary"
                            variant="outlined"
                            rounded
                            @click="deleteCategory(data)"
                            v-tooltip.top="'Eliminar Caja'"
                            size="large"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>
        <ModalForm
            collection="caja"
            :visible="showModal"
            :data="cashData"
            @closeModal="closeModal"
            @newChanges="
                () => {
                    showModal = false;
                    fetchData();
                    searchInput = '';
                }
            "
        />
    </div>
</template>

<script setup>
import ModalForm from '@/components/composables/ModalForm.vue';
import pb from '@/service/pocketbase';
import debounce from '@/utils/debounce';
import { useToast } from 'primevue';
import { onMounted, ref } from 'vue';
const searchInput = ref('');
const showModal = ref(false);
const cashData = ref({});
const cashRegisters = ref([]);
const toast = useToast();
const loading = ref(false);
const editCashRegister = (data) => {
    showModal.value = true;
    cashData.value = data;
};
const closeModal = () => {
    showModal.value = false;
    cashData.value = [];
};
const searchCategories = debounce(() => {
    fetchData(searchInput.value);
}, 300);
const fetchData = async (search = '') => {
    try {
        loading.value = true;
        const result = await pb.collection('cajas').getFullList({
            filter: `deleted=null && nombre~'${search}'`
        });
        cashRegisters.value = result;
    } catch (error) {
        console.log(error);
        toast.add({
            severity: 'error',
            summary: 'Operación fallida',
            detail: 'No se pudieron cargar las cajas',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};
onMounted(() => fetchData());
</script>
