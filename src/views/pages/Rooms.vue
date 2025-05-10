<script setup>
import ModalForm from '@/components/composables/ModalForm.vue';
import TableForm from '@/components/rooms/TableForm.vue';
import pb from '@/service/pocketbase';
import { useConfirm, useToast } from 'primevue';
import { computed, onMounted, ref } from 'vue';
const value = ref(null);
const loading = ref(false);
const toast = useToast();
const confirm = useConfirm();
const roomData = ref([]);
const showModalRoom = ref(false);
const showModalTable = ref(false);
const selectedTable = ref(null);
const options = ref([]);
const currentDropPosition = ref({ x: 0, y: 0 });
const tables = ref([]);
const getCoords = (index) => ({ x: index % 15, y: Math.floor(index / 15) });

const getRooms = async () => {
    try {
        loading.value = true;
        const result = await pb
            .collection('salas')
            .getFullList({ filter: 'deleted=null', fields: 'id,nombre' });
        options.value = result.map((item) => ({ label: item.nombre, value: item.id }));
        value.value = value.value ?? options.value[0].value;
        await getTables();
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
const getTablesCurrentRoom = computed(() => tables.value.filter((t) => t.sala_id == value.value));
const editRoom = () => {
    const actualRoom = options.value.find((r) => r.value == value.value);
    showModalRoom.value = true;
    roomData.value = { id: actualRoom.value, nombre: actualRoom.label };
};
const updateTable = async (table) => {
    const result = await pb.collection('mesas').update(table.id, {
        forma: table.forma === 'Cuadrada' ? 'Redonda' : 'Cuadrada'
    });
    tables.value = tables.value.map((t) => (t.id === table.id ? result : t));
    if (selectedTable.value?.id === table.id) selectedTable.value = result;
};
const handleRoomSave = async (isEditMode, data) => {
    showModalRoom.value = false;
    if (isEditMode) {
        const index = options.value.findIndex((r) => r.value == data.id);
        options.value[index] = { label: data.nombre, value: data.id };
    } else {
        options.value.push({ label: data.nombre, value: data.id });
        selectedTable.value = null;
        value.value = data.id;
    }
};
const handleTableSave = async (tableData) => {
    showModalTable.value = false;
    tables.value = tables.value.map((t) => (t.id === tableData.id ? tableData : t));
    if (selectedTable.value?.id === tableData.id) selectedTable.value = tableData;
};
const confirmRoomDeletion = () => {
    const data = options.value.find((r) => r.value == value.value);
    if (getTablesCurrentRoom.value.length > 0)
        return toast.add({
            severity: 'error',
            summary: 'Operación fallida',
            detail: 'No se puede eliminar la sala porque tiene mesas',
            life: 3000
        });
    confirm.require({
        message: `Estas seguro de eliminar la sala ${data.label}?`,
        header: 'Eliminar Sala',
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
            await pb.collection('salas').update(data.value, { deleted: new Date() });
            options.value = options.value.filter((r) => r.value != data.value);
            value.value = options.value[0].value;
            toast.add({
                severity: 'success',
                summary: 'Operación exitosa',
                detail: 'La sala ha sido eliminado',
                life: 3000
            });
        }
    });
};
const confirmTableDeletion = () => {
    if (selectedTable.value) {
        confirm.require({
            message: `Estas seguro de eliminar la mesa ${selectedTable.value.numero}?`,
            header: 'Eliminar Mesa',
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
                await pb.collection('mesas').delete(selectedTable.value.id);
                tables.value = tables.value.filter((t) => t.id != selectedTable.value.id);
                selectedTable.value = null;
                toast.add({
                    severity: 'success',
                    summary: 'Operación exitosa',
                    detail: 'La mesa ha sido eliminada',
                    life: 3000
                });
            }
        });
    }
};
const getTables = async () => {
    selectedTable.value = null;
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

const tableInCell = (x, y) => {
    return getTablesCurrentRoom.value.find((m) => m.pos_x === x && m.pos_y === y);
};

const handleCellClick = async (index) => {
    const { x, y } = getCoords(index);
    currentDropPosition.value = { x, y };
    if (tableInCell(x, y)) {
        selectedTable.value = tableInCell(x, y);
        return;
    }

    try {
        const result = await pb.collection('mesas').getList(1, 1, {
            sort: '-numero'
        });
        const biggestNumber = result.items.length > 0 ? result.items[0].numero : 0;
        const newTable = await pb.collection('mesas').create({
            sala_id: value.value,
            numero: biggestNumber + 1,
            forma: 'Cuadrada',
            pos_x: x,
            pos_y: y,
            capacidad: 4,
            estado: 'disponible'
        });
        tables.value.push(newTable);
        selectedTable.value = tableInCell(x, y);
    } catch (error) {
        console.log(error);
        toast.add({
            severity: 'error',
            summary: 'Operación fallida',
            detail: 'No se pudo agregar la mesa',
            life: 3000
        });
    }
};
const handleMove = async (table) => {
    const { x, y } = table;
    const targetExists = getTablesCurrentRoom.value.find((m) => m.pos_x === x && m.pos_y === y);
    if (targetExists) return;
    table.pos_x = x;
    table.pos_y = y;
    const result = await pb.collection('mesas').update(table.id, table);
    tables.value = tables.value.map((t) => (t.id === table.id ? result : t));
};

onMounted(getRooms);
</script>

<template>
    <div class="card flex flex-col md:flex-row gap-4 !mb-0">
        <div class="w-full md:w-3/5 xl:w-2/3">
            <div class="flex justify-between items-center !mb-4">
                <h1 class="text-4xl text-black font-bold !mb-0">Salas y Mesas</h1>
                <Button
                    severity="primary"
                    class="!h-[3.2rem]"
                    label="Agregar Sala"
                    icon="pi pi-plus"
                    @click="showModalRoom = true"
                />
            </div>

            <SelectButton
                v-model="value"
                :options="options"
                @update:model-value="selectedTable = null"
                :allowEmpty="false"
                optionLabel="label"
                optionValue="value"
                class="mt-2 mb-4"
            />
            <div class="overflow-auto pt-6 max-h-[60vh] pl-2">
                <div class="grid-celda border">
                    <TableCell
                        v-for="(_, index) in 100"
                        :key="index"
                        :table="tableInCell(index % 15, Math.floor(index / 15))"
                        :isSelected="
                            selectedTable?.id ===
                            tableInCell(index % 15, Math.floor(index / 15))?.id
                        "
                        @click="handleCellClick(index)"
                        :position="{ x: index % 15, y: Math.floor(index / 15) }"
                        @toggleShape="updateTable($event)"
                        @moveTable="handleMove($event)"
                    />
                </div>
            </div>
        </div>
        <div class="w-full md:w-2/5 xl:w-1/3" v-auto-animate>
            <div
                class="bg-surface-500 w-full flex justify-between items-center !h-[3.2rem] px-2 rounded-md mb-4"
            >
                <p class="text-white font-bold !mb-0 px-2">
                    {{ options.find((o) => o.value === value)?.label }}
                </p>
                <div class="flex gap-2">
                    <Button
                        variant="text"
                        icon="pi pi-pencil"
                        class="!text-white hover:!bg-surface-700"
                        rounded
                        @click="editRoom()"
                        v-tooltip.top="'Editar Sala'"
                    />
                    <Button
                        variant="text"
                        icon="pi pi-trash"
                        class="!text-white hover:!bg-surface-700"
                        rounded
                        @click="confirmRoomDeletion()"
                        v-tooltip.top="'Eliminar Sala'"
                    />
                </div>
            </div>
            <div class="flex flex-col gap-4" v-if="selectedTable" v-auto-animate>
                <div
                    class="bg-surface-500 w-full flex justify-between items-center !h-[3.2rem] px-2 rounded-md"
                >
                    <p class="text-white font-bold !mb-0 px-2">Mesa {{ selectedTable?.numero }}</p>
                    <div class="flex gap-2">
                        <Button
                            variant="text"
                            icon="pi pi-pencil"
                            class="!text-white hover:!bg-surface-700"
                            rounded
                            v-tooltip.top="'Editar Mesa'"
                            @click="showModalTable = true"
                        />
                        <Button
                            variant="text"
                            icon="pi pi-trash"
                            class="!text-white hover:!bg-surface-700"
                            rounded
                            @click="confirmTableDeletion()"
                            v-tooltip.top="'Eliminar Mesa'"
                        />
                    </div>
                </div>
                <div class="flex gap-4">
                    <div class="flex flex-col gap-3 px-4 text-surface-500 font-semibold">
                        <p class="!mb-0">Número:</p>
                        <p class="!mb-0">Capacidad:</p>
                        <p class="!mb-0">Sala:</p>
                        <p class="!mb-0">Forma:</p>
                    </div>
                    <div class="flex flex-col gap-3 font-bold text-black">
                        <p class="!mb-0">
                            {{ selectedTable?.numero }}
                        </p>
                        <p class="!mb-0">{{ selectedTable?.capacidad }} personas</p>
                        <p class="!mb-0">
                            {{ options.find((o) => o.value === value)?.label }}
                        </p>
                        <p class="!mb-0">
                            {{ selectedTable?.forma }}
                        </p>
                    </div>
                </div>
            </div>
            <p v-else class="text-center mt-4 font-bold text-black">
                Seleccione una mesa para ver sus detalles
            </p>
        </div>
    </div>
    <ModalForm
        collection="sala"
        :visible="showModalRoom"
        :data="roomData"
        @newChanges="handleRoomSave"
        @closeModal="
            roomData = [];
            showModalRoom = false;
        "
    />
    <TableForm
        :visible="showModalTable"
        :tableData="selectedTable"
        :existingTableNumbers="tables.map((t) => t.numero)"
        @closeModal="showModalTable = false"
        @tableUpdated="handleTableSave"
    />
    <ConfirmDialog></ConfirmDialog>
</template>
<style scoped>
.grid-celda {
    display: grid;
    grid-template-columns: repeat(10, 90px);
    grid-template-rows: repeat(10, 90px);
    width: max-content;
    margin: 0 auto;
}
</style>
