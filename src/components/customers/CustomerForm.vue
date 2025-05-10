<template>
    <Dialog
        v-model:visible="visible"
        modal
        @update:visible="closeModal"
        :draggable="false"
        class="!min-h-fit"
        :header="isEditMode ? 'Editar Cliente' : 'Agregar Cliente'"
        :style="{ width: '44rem' }"
    >
        <Form
            v-slot="$form"
            :initialValues
            :resolver
            @submit="onFormSubmit"
            class="flex justify-center flex-col gap-4"
        >
            <InputText v-if="isEditMode" id="id" name="id" class="hidden" />
            <div class="flex gap-4">
                <div class="flex flex-col gap-1 w-full" v-auto-animate>
                    <label for="name">Nombre</label>
                    <InputText
                        id="name"
                        name="nombre"
                        placeholder="Ej. Juan Pérez"
                        fluid
                        autocomplete="off"
                    />

                    <Message
                        v-if="$form.nombre?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                        >{{ $form.nombre.error.message }}
                    </Message>
                </div>
                <div class="flex flex-col gap-1 w-full" v-auto-animate>
                    <label for="identificacion">Identificación</label>
                    <InputMask
                        id="identificacion"
                        @update:model-value="errorIdentificacion = ''"
                        name="identificacion"
                        mask="99-99999999-9"
                        placeholder="Ej. 20-12345678-0"
                        fluid
                        autocomplete="off"
                    />

                    <Message
                        v-if="$form.identificacion?.invalid || errorIdentificacion"
                        severity="error"
                        size="small"
                        variant="simple"
                        >{{ errorIdentificacion || $form.identificacion.error.message }}
                    </Message>
                </div>
            </div>
            <div class="flex gap-4">
                <div class="flex flex-col gap-1 w-full" v-auto-animate>
                    <label for="email">Email</label>
                    <InputText
                        id="email"
                        name="email"
                        placeholder="Ej. cliente@email.com"
                        fluid
                        autocomplete="off"
                    />

                    <Message
                        v-if="$form.email?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                        >{{ $form.email.error.message }}
                    </Message>
                </div>
                <div class="flex flex-col gap-1 w-full" v-auto-animate>
                    <label for="telefono">Teléfono</label>
                    <InputText
                        type="number"
                        id="telefono"
                        name="telefono"
                        placeholder="Ingrese el teléfono del cliente"
                        fluid
                        autocomplete="off"
                    />

                    <Message
                        v-if="$form.telefono?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                        >{{ $form.telefono.error.message }}
                    </Message>
                </div>
            </div>
            <div class="flex gap-4">
                <div class="flex flex-col gap-1 w-full" v-auto-animate>
                    <label for="domicilio">Domicilio</label>
                    <InputText
                        id="domicilio"
                        name="domicilio"
                        placeholder="Ingrese el domicilio del cliente"
                        fluid
                        autocomplete="off"
                    />

                    <Message
                        v-if="$form.domicilio?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                        >{{ $form.domicilio.error.message }}
                    </Message>
                </div>
                <div class="flex flex-col gap-1 w-full" v-auto-animate>
                    <label for="ciudad">Ciudad</label>
                    <InputText
                        id="ciudad"
                        name="ciudad"
                        placeholder="Ingrese la ciudad del cliente"
                        fluid
                        autocomplete="off"
                    />

                    <Message
                        v-if="$form.ciudad?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                        >{{ $form.ciudad.error.message }}
                    </Message>
                </div>
            </div>

            <div class="flex flex-col gap-1" v-auto-animate>
                <label for="descuento">Descuento</label>
                <InputGroup>
                    <InputText
                        type="number"
                        min="0"
                        max="100"
                        name="descuento"
                        id="descuento"
                        placeholder="Ej. 5"
                        autocomplete="off"
                    />
                    <InputGroupAddon>
                        <i class="pi pi-percentage"></i>
                    </InputGroupAddon>
                </InputGroup>
                <Message
                    v-if="$form.descuento?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                    >{{ $form.descuento.error.message }}
                </Message>
            </div>
            <div class="mb-2" v-auto-animate :class="{ hidden: !isEditMode }">
                <label for="status" class="block text-base font-semibold mb-2">Activo</label>
                <ToggleSwitch input-id="status" class="mb-2" name="activo" />
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
import { useIndexStore } from '@/storage';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { useToast } from 'primevue/usetoast';
import { computed, defineEmits, defineProps, ref } from 'vue';
import { z } from 'zod';
const toast = useToast();
const store = useIndexStore();
const errorIdentificacion = ref('');
const emit = defineEmits(['closeModal', 'newChanges']);
const loading = ref(false);
const props = defineProps({
    visible: Boolean,
    customerData: {
        type: Object,
        default: {}
    }
});
const visible = computed({
    get: () => props.visible,
    set: (value) => emit('closeModal', value)
});
const cleanIdentificacion = (value) => value.replaceAll('_', '').replaceAll('-', '');

const resolver = zodResolver(
    z.object({
        id: z.string().optional(),
        email: z.string().email({ message: 'El email es inválido' }),
        nombre: z
            .string()
            .nonempty({ message: 'El nombre es requerido' })
            .min(5, { message: 'Debe tener al menos 5 caracteres' })
            .max(50, { message: 'No debe exceder 50 caracteres' }),
        domicilio: z
            .string()
            .nonempty({ message: 'El domicilio es requerido' })
            .min(5, { message: 'Debe tener al menos 5 caracteres' })
            .max(50, { message: 'No debe exceder 50 caracteres' }),
        ciudad: z
            .string()
            .nonempty({ message: 'La ciudad es requerida' })
            .min(5, { message: 'Debe tener al menos 5 caracteres' })
            .max(50, { message: 'No debe exceder 40 caracteres' }),
        identificacion: z
            .string()
            .min(1, { message: 'La identificación es requerida' })
            .refine(
                (identificacion) => {
                    return cleanIdentificacion(identificacion).length >= 11;
                },
                {
                    message: 'Debe tener 11 caracteres'
                }
            ),
        telefono: z.coerce
            .number()
            .min(1, { message: 'El teléfono es requerido' })
            .max(999999999999, { message: 'No debe exceder 12 caracteres' }),
        descuento: z.coerce
            .number()
            .min(0, { message: 'El descuento debe estar entre 0 y 100' })
            .max(100, { message: 'El descuento debe estar entre 0 y 100' })
            .optional(),
        activo: z.boolean()
    })
);

const isEditMode = computed(() => {
    return !!props.customerData?.id;
});

const initialValues = computed(() => {
    return {
        id: props.customerData?.id || '',
        nombre: props.customerData?.nombre || '',
        email: props.customerData?.email || '',
        domicilio: props.customerData?.domicilio || '',
        ciudad: props.customerData?.ciudad || '',
        descuento: props.customerData?.descuento || null,
        identificacion: props.customerData?.identificacion
            ? props.customerData?.identificacion.toString()
            : '',
        telefono: props.customerData?.telefono || null,
        activo: isEditMode.value ? props.customerData?.activo : true
    };
});

const closeModal = () => {
    errorIdentificacion.value = '';
    emit('closeModal');
};
const validateUniqueIdentificacion = async (identificacion) => {
    if (identificacion == props.customerData?.identificacion) return true;
    const result = await pb.collection('clientes').getList(1, 1, {
        filter: `identificacion='${identificacion}' && cafeteria_id='${store.getUserLogged?.cafeteria_id}'`
    });
    return result.totalItems === 0;
};
const onFormSubmit = async (e) => {
    if (!e.valid) return;
    e.values.identificacion = cleanIdentificacion(e.values.identificacion);
    if (!(await validateUniqueIdentificacion(e.values.identificacion))) {
        errorIdentificacion.value = 'Ya existe un cliente con esa identificación';
        return;
    }
    try {
        loading.value = true;
        const payload = {
            ...e.values,
            cafeteria_id: store?.getUserLogged?.cafeteria_id,
            identificacion: parseInt(e.values.identificacion)
        };
        const customer = isEditMode.value
            ? await pb.collection('clientes').update(payload.id, payload)
            : await pb.collection('clientes').create(payload);
        toast.add({
            severity: 'success',
            summary: 'Operación exitosa',
            detail: `El cliente se ha ${isEditMode.value ? 'editado' : 'creado'} correctamente`,
            life: 3000
        });
        closeModal();
        emit('newChanges', isEditMode.value, customer);
    } catch (error) {
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
