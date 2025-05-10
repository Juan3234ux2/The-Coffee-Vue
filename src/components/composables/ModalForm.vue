<template>
    <Dialog
        v-model:visible="visible"
        modal
        :draggable="false"
        @update:visible="closeModal"
        :header="
            isEditMode
                ? 'Editar ' + collection.charAt(0).toUpperCase() + collection.slice(1)
                : 'Agregar ' + collection.charAt(0).toUpperCase() + collection.slice(1)
        "
        :style="{ width: '30rem' }"
    >
        <Form
            v-slot="$form"
            :initialValues
            :resolver
            @submit="onFormSubmit"
            class="flex justify-center flex-col gap-4"
        >
            <InputText v-if="isEditMode" id="id" name="id" class="hidden" />
            <div class="flex flex-col gap-1" v-auto-animate>
                <label for="name">Nombre</label>
                <InputText
                    id="name"
                    name="nombre"
                    :placeholder="'Ingrese el nombre de la ' + collection"
                    fluid
                    autocomplete="off"
                />

                <Message v-if="$form.nombre?.invalid" severity="error" size="small" variant="simple"
                    >{{ $form.nombre.error.message }}
                </Message>
            </div>

            <div class="flex justify-end gap-2 mt-1">
                <Button
                    type="button"
                    label="Cancelar"
                    class="h-[3.2rem]"
                    severity="secondary"
                    :disabled="loading"
                    @click="closeModal"
                ></Button>
                <Button
                    :label="isEditMode ? 'Editar' : 'Agregar'"
                    :loading="loading"
                    class="h-[3.2rem]"
                    type="submit"
                ></Button>
            </div>
        </Form>
    </Dialog>
</template>

<script setup>
import pb from '@/service/pocketbase.js';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { useToast } from 'primevue/usetoast';
import { computed, defineEmits, defineProps, ref } from 'vue';
import { z } from 'zod';
const toast = useToast();
const emit = defineEmits(['closeModal', 'newChanges']);
const loading = ref(false);
const props = defineProps({
    visible: Boolean,
    collection: String,
    data: {
        type: Object,
        default: []
    }
});
const visible = computed({
    get: () => props.visible,
    set: (value) => emit('closeModal', value)
});
const resolver = zodResolver(
    z.object({
        id: z.string().optional(),
        nombre: z
            .string()
            .nonempty({ message: 'El nombre es requerido' })
            .min(3, { message: 'Debe tener al menos 3 caracteres' })
            .max(50, { message: 'No debe exceder 50 caracteres' })
    })
);

const isEditMode = computed(() => {
    return !!props.data?.id;
});

const initialValues = computed(() => {
    return {
        id: props.data?.id || '',
        nombre: props.data?.nombre || ''
    };
});

const closeModal = () => {
    emit('closeModal');
};
const onFormSubmit = async (e) => {
    if (!e.valid) return;
    try {
        const payload = e.values;
        loading.value = true;
        const item = isEditMode.value
            ? await pb.collection(`${props.collection}s`).update(payload.id, payload)
            : await pb.collection(`${props.collection}s`).create(payload);
        toast.add({
            severity: 'success',
            summary: 'Operación exitosa',
            detail: `La ${props.collection} se ha ${isEditMode.value ? 'editado' : 'creado'} correctamente`,
            life: 3000
        });
        emit('newChanges', isEditMode.value, item);
    } catch (error) {
        console.log(error);
        toast.add({
            severity: 'error',
            summary: 'Operación fallida',
            detail: 'Intentelo nuevamente',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};
</script>
