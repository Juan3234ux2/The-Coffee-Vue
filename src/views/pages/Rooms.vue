<script setup>
import RoomForm from '@/components/rooms/RoomForm.vue';
import pb from '@/service/pocketbase';
import { useConfirm, useToast } from 'primevue';
import { onMounted, ref } from 'vue';
const value = ref(null);
const loading = ref(false);
const toast = useToast();
const confirm = useConfirm();
const roomData = ref([]);
const showModalRoom = ref(false);
const selectedTable = ref(null);
const options = ref([]);
const tables = ref([]);

const getRooms = async () => {
    try {
        loading.value = true;
        const result = await pb.collection('salas').getFullList({ filter: 'deleted=null' });
        options.value = result.map((item) => ({ label: item.nombre, value: item.id }));
        value.value = value.value ?? options.value[0].value;
        await getTables(value.value);
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

const editRoom = () => {
    showModalRoom.value = true;
    roomData.value = options.value.find((r) => r.value == value.value);
};
const newRoom = async (data) => {
    showModalRoom.value = false;
    options.value.push({ label: data.nombre, value: data.id });
    value.value = data.id;
    tables.value = [];
};
const confirmRoomDeletion = () => {
    const data = options.value.find((r) => r.value == value.value);
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
            await getTables(value.value);
            toast.add({
                severity: 'success',
                summary: 'Operación exitosa',
                detail: 'La sala ha sido eliminado',
                life: 3000
            });
        }
    });
};
const getTables = async (salaId) => {
    try {
        const result = await pb.collection('mesas').getFullList({
            filter: `sala_id = "${salaId}"`
        });
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
    return tables.value.find((m) => m.pos_x === x && m.pos_y === y);
};

const handleCellClick = async (index) => {
    const x = index % 15;
    const y = Math.floor(index / 15);
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
            pos_x: x,
            pos_y: y,
            cantidad_sillas: 4,
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

onMounted(getRooms);
</script>

<template>
    <div></div>
    <div class="card">
        <div class="flex justify-between items-center !mb-4">
            <h1 class="text-4xl text-black font-bold !mb-0">Salas y Mesas</h1>
            <div class="flex gap-2">
                <Button
                    severity="danger"
                    class="!h-[3.2rem]"
                    label="Eliminar Sala"
                    icon="pi pi-trash"
                    @click="confirmRoomDeletion()"
                />
                <Button
                    severity="contrast"
                    class="!h-[3.2rem]"
                    label="Editar Sala"
                    icon="pi pi-pencil"
                    @click="editRoom()"
                />
                <Button
                    severity="primary"
                    class="!h-[3.2rem]"
                    label="Agregar Sala"
                    icon="pi pi-plus"
                    @click="showModalRoom = true"
                />
            </div>
        </div>

        <SelectButton
            v-model="value"
            :options="options"
            @update:modelValue="getTables(value)"
            optionLabel="label"
            optionValue="value"
            class="mt-2 mb-10"
        />

        <div class="overflow-auto max-h-[50vh]">
            <div class="grid-celda border">
                <div
                    v-for="(_, index) in 100"
                    :key="index"
                    class="celda"
                    @click="handleCellClick(index)"
                >
                    <div
                        v-if="tableInCell(index % 15, Math.floor(index / 15))"
                        style="box-shadow: 0px -2px 6px 2px rgba(0, 0, 0, 0.64) inset"
                        class="flex justify-center items-center text-xl font-semibold text-white bg-surface-500 rounded w-[80%] h-[80%] relative"
                    >
                        {{ tableInCell(index % 15, Math.floor(index / 15)).numero }}
                        <div
                            class="cellRing"
                            v-if="selectedTable == tableInCell(index % 15, Math.floor(index / 15))"
                        ></div>
                    </div>
                    <div class="flex justify-center items-center" v-else></div>
                </div>
            </div>
        </div>

        <RoomForm
            :visible="showModalRoom"
            :roomData
            @newChanges="newRoom"
            @closeModal="showModalRoom = false"
        />
    </div>
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
.celda {
    border: 1px solid #d4d4d4;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}
.celda:hover > div:not(.bg-surface-500) {
    border: 2px dashed #d4d4d4;
    border-radius: 5px;
    width: 80%;
    height: 80%;
}
.celda:hover > div:not(.bg-surface-500)::before {
    content: '+';
    font-size: 1.4rem;
    color: #999;
}
.cellRing {
    position: absolute;
    border: 5px solid #6366f1;
    opacity: 0.8;
    border-radius: 5px;
    width: 120%;
    height: 120%;
    animation: myAnim 0.4s ease 0s 1 normal forwards;
}
@keyframes myAnim {
    0% {
        transform: scale(0);
    }

    100% {
        transform: scale(1);
    }
}
</style>
