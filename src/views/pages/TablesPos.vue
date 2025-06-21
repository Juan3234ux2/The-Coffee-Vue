<template>
    <div class="card">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-4xl text-black font-bold !mb-0">Selecciona una mesa</h1>
            <SelectButton
                v-model="value"
                :options="options"
                :allowEmpty="false"
                optionLabel="label"
                optionValue="value"
            />
        </div>
        <div class="flex items-center gap-5 mb-0 text-surface-color">
            <div class="flex items-center gap-2">
                <span class="bg-green-500 w-5 h-5 rounded-full inline-block"></span>
                <p class="font-semibold" style="font-size: 10px">Disponible</p>
            </div>
            <div class="flex items-center gap-2">
                <span class="bg-red-500 w-5 h-5 rounded-full inline-block"></span>
                <p class="font-semibold" style="font-size: 10px">Ocupada</p>
            </div>
        </div>
        <div class="overflow-auto pt-6 max-h-[60vh]">
            <div class="grid-celda">
                <TableCell
                    v-for="(_, index) in 100"
                    :key="index"
                    @click="handleCellClick(index)"
                    :table="tableInCell(index % 15, Math.floor(index / 15))"
                    :position="{ x: index % 15, y: Math.floor(index / 15) }"
                    :is-admin-view="false"
                />
            </div>
        </div>
    </div>
</template>
<script setup>
import TableCell from '@/components/rooms/TableCell.vue';
import pb from '@/service/pocketbase';
import { useToast } from 'primevue';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
const tables = ref([]);
const loading = ref(false);
const toast = useToast();
const options = ref([]);
const value = ref(null);
const router = useRouter();
const getCoords = (index) => ({ x: index % 15, y: Math.floor(index / 15) });
const getTablesCurrentRoom = computed(() => tables.value.filter((t) => t.sala_id == value.value));
const tableInCell = (x, y) => {
    return getTablesCurrentRoom.value.find((m) => m.pos_x === x && m.pos_y === y);
};
const getTables = async () => {
    try {
        const result = await pb.collection('mesas').getFullList({});
        tables.value = result;
    } catch (error) {
        console.log(error);
        toast.add({
            severity: 'error',
            summary: 'Operación fallida',
            detail: 'No se pudieron cargar las salas',
            life: 3000
        });
    }
};
const getRooms = async () => {
    try {
        loading.value = true;
        const result = await pb.collection('salas').getFullList({
            filter: 'deleted=null && cafeteria_id="' + pb.authStore.record.cafeteria_id + '"',
            fields: 'id,nombre'
        });
        if (result.length > 0) {
            options.value = result.map((item) => ({ label: item.nombre, value: item.id }));
            value.value = value.value ?? options.value[0].value;
            await getTables();
        }
    } catch (error) {
        console.log(error);
        toast.add({
            severity: 'error',
            summary: 'Operación fallida',
            detail: 'No se pudieron cargar las salas',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};

const handleCellClick = (index) => {
    const { x, y } = getCoords(index);
    const selectedTable = tableInCell(x, y);
    router.push({ name: 'order-details', params: { id: selectedTable.id } });
};
onMounted(getRooms);
</script>
<style scoped>
.grid-celda {
    display: grid;
    grid-template-columns: repeat(10, 90px);
    grid-template-rows: repeat(10, 90px);
    width: max-content;
}
</style>
