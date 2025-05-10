<template>
    <Dialog
        v-model:visible="visible"
        modal
        :draggable="false"
        @update:visible="closeModal"
        header="Editar Mesa"
        :style="{ width: '30rem' }"
    >
        <Form
            v-slot="$form"
            :initialValues
            :resolver
            @submit="onFormSubmit"
            class="flex justify-center flex-col gap-4"
        >
            <InputText id="id" name="id" class="hidden" />
            <div class="flex flex-col gap-1" v-auto-animate>
                <label for="numero">Número</label>
                <InputText
                    type="number"
                    id="numero"
                    name="numero"
                    placeholder="Ingrese el nombre de la mesa"
                    fluid
                    autocomplete="off"
                />
                <Message v-if="$form.numero?.invalid" severity="error" size="small" variant="simple"
                    >{{ $form.numero.error.message }}
                </Message>
            </div>
            <div class="flex flex-col gap-1" v-auto-animate>
                <label for="capacidad">Capacidad</label>
                <InputNumber
                    id="capacidad"
                    name="capacidad"
                    placeholder="Ingrese el nombre de sillas"
                    fluid
                    max="8"
                    autocomplete="off"
                />
                <Message
                    v-if="$form.capacidad?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                    >{{ $form.capacidad.error.message }}
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
                <Button label="Editar" :loading="loading" class="h-[3.2rem]" type="submit"></Button>
            </div>
        </Form>
    </Dialog>
</template>

<script setup>
import pb from '@/service/pocketbase.js';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { InputText } from 'primevue';
import { useToast } from 'primevue/usetoast';
import { computed, defineEmits, defineProps, ref } from 'vue';
import { z } from 'zod';
const toast = useToast();
const emit = defineEmits(['closeModal', 'newChanges']);
const loading = ref(false);
const visible = computed({
    get: () => props.visible,
    set: (value) => emit('closeModal', value)
});
const props = defineProps({
    visible: Boolean,
    existingTableNumbers: Array,
    tableData: {
        type: Object,
        default: []
    }
});

const resolver = zodResolver(
    z
        .object({
            id: z.string().optional(),
            numero: z.coerce.number().min(1, { message: 'El número es requerido' }),
            capacidad: z.coerce.number().min(1, { message: 'La capacidad es requerida' })
        })
        .superRefine(({ numero }, ctx) => {
            if (props.existingTableNumbers.includes(numero) && props.tableData?.numero !== numero) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Ya existe una mesa con ese número',
                    path: ['numero']
                });
            }
        })
);

const initialValues = computed(() => {
    return {
        id: props.tableData?.id,
        numero: props.tableData?.numero,
        capacidad: props.tableData?.capacidad
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
        const table = await pb.collection('mesas').update(payload.id, payload);
        toast.add({
            severity: 'success',
            summary: 'Operación exitosa',
            detail: 'La mesa se ha editado correctamente',
            life: 3000
        });
        emit('tableUpdated', table);
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
