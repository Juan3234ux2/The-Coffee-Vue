<template>
    <div
        class="cell"
        :class="{
            'cell-admin': isAdminView,
            'drag-over': isDragOver && !props.table
        }"
        @dragover.prevent
        @drop="handleDrop"
        @dragenter="handleDragEnter"
        @dragleave="handleDragLeave"
        @click="$emit('click')"
    >
        <div
            v-if="table"
            class="group flex justify-center items-center text-xl font-semibold text-white relative transition-all duration-300 ease-in-out"
            :style="{
                borderRadius: table.forma === 'Redonda' ? '50%' : '6px'
            }"
            style="box-shadow: 0px -2px 6px 2px rgba(0, 0, 0, 0.64) inset"
            @dragstart="handleDragStart"
            @dragend="isDragging = false"
            :draggable="isAdminView"
            :class="{ 'dragging-origin': isDragging } + getSize() + getColor()"
        >
            <div
                class="transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100 flex justify-center items-center absolute bottom-[-10px] z-10"
            >
                <Button
                    v-if="isAdminView"
                    :icon="table.forma == 'Redonda' ? 'pi pi-stop' : 'pi pi-circle'"
                    @click.stop="$emit('toggleShape', table)"
                    size="small"
                    v-tooltip.top="'Cambiar Forma'"
                    class="!bg-surface-900 hover:!bg-surface-700 !border-0 !p-3 !px-5"
                />
            </div>

            {{ table.numero }}
            <div
                class="cellRing"
                :style="{
                    borderRadius: table.forma === 'Redonda' ? '50%' : '6px'
                }"
                v-if="isSelected"
            ></div>
        </div>
        <div class="flex justify-center items-center" v-else></div>
    </div>
</template>

<script setup>
import { defineProps, ref } from 'vue';
const isDragOver = ref(false);
const emit = defineEmits(['click', 'toggleShape', 'moveTable']);
const isDragging = ref(false);
const props = defineProps({
    table: {
        type: Object,
        default: null
    },
    isSelected: {
        type: Boolean,
        default: false
    },
    isAdminView: {
        type: Boolean,
        default: true
    },
    position: Object
});
const getSize = () => {
    if (props.table.capacidad <= 2) {
        return ' !h-[60%] !w-[60%] ';
    } else if (props.table.capacidad <= 4) {
        return ' !h-[75%] !w-[75%] ';
    } else {
        return ' !h-[95%] !w-[95%] ';
    }
};
const getColor = () => {
    if (props.isAdminView) {
        return 'bg-surface-500';
    } else if (props.table.estado === 'ocupado') {
        return 'bg-red-700';
    } else {
        return 'bg-green-700';
    }
};
const handleDragEnter = () => {
    isDragOver.value = true;
};

const handleDragLeave = () => {
    isDragOver.value = false;
};
const handleDragStart = (e) => {
    if (props.table) {
        e.dataTransfer.setData('text/plain', JSON.stringify(props.table));
        requestAnimationFrame(() => {
            isDragging.value = true;
        });
    }
};

const handleDrop = (e) => {
    isDragOver.value = false;
    const tableData = JSON.parse(e.dataTransfer.getData('text/plain'));
    emit('moveTable', {
        ...tableData,
        x: props.position.x,
        y: props.position.y
    });
};
</script>

<style scoped>
.cell {
    @apply flex justify-center items-center cursor-pointer;
}
.cell-admin {
    @apply border border-surface-200;
}
.drag-over {
    @apply bg-surface-200 transition-all duration-300 ease-in-out;
    box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.75) inset;
}
.dragging-origin {
    @apply opacity-30 transition-all duration-300 ease-in-out;
}
.cell-admin:hover > div:not(.bg-surface-500) {
    border: 2px dashed #d4d4d4;
    border-radius: 5px;
    width: 80%;
    height: 80%;
}
.cell-admin:hover > div:not(.bg-surface-500)::before {
    content: '+';
    font-size: 1.4rem;
    color: #999;
}

.cellRing {
    @apply absolute border-[5px] border-primary-600 opacity-80 rounded-[5px] w-[120%] h-[120%];
    transition: border-radius 0.3s ease-in-out;
    animation: scale 0.4s ease 0s 1 normal forwards;
}

@keyframes scale {
    0% {
        transform: scale(0);
    }

    100% {
        transform: scale(1);
    }
}
</style>
