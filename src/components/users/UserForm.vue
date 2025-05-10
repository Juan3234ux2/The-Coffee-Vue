<template>
    <Dialog
        v-model:visible="visible"
        modal
        @update:visible="closeModal"
        :draggable="false"
        class="!min-h-fit"
        :header="isEditMode ? 'Editar Usuario' : 'Agregar Usuario'"
        :style="{ width: '45rem' }"
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
                        name="name"
                        placeholder="Ej. Juan Pérez"
                        fluid
                        autocomplete="off"
                    />

                    <Message
                        v-if="$form.name?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                        >{{ $form.name.error.message }}
                    </Message>
                </div>
                <div class="flex flex-col gap-1 w-full" v-auto-animate>
                    <label for="phone">Teléfono</label>
                    <InputNumber
                        input-id="phone"
                        :useGrouping="false"
                        name="phone"
                        placeholder="Ingrese el teléfono del usuario"
                        fluid
                    />
                    <Message
                        v-if="$form.phone?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                        >{{ $form.phone.error.message }}
                    </Message>
                </div>
            </div>
            <div class="flex gap-4">
                <div class="flex flex-col gap-1 w-full" v-auto-animate>
                    <label for="email">Email</label>
                    <InputText
                        id="email"
                        name="email"
                        placeholder="Ej. usuario@email.com"
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
                <div
                    class="flex flex-col gap-1 w-full"
                    v-auto-animate
                    :class="{ hidden: isEditMode }"
                >
                    <label for="password">Contraseña</label>
                    <Password
                        input-id="password"
                        name="password"
                        placeholder="* * * * * * * * *"
                        :toggleMask="true"
                        fluid
                        :feedback="false"
                    ></Password>
                    <Message
                        v-if="$form.password?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                        >{{ $form.password.error?.message }}</Message
                    >
                </div>
            </div>
            <div class="flex flex-col gap-1 w-full" v-auto-animate>
                <label for="role_id">Rol</label>
                <Select
                    :loading="loadingSelectData"
                    :options="roles"
                    option-label="nombre"
                    option-value="id"
                    label-id="role_id"
                    name="role_id"
                    placeholder="Seleccione un rol"
                    fluid
                />

                <Message
                    v-if="$form.role_id?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                    >{{ $form.role_id.error.message }}
                </Message>
            </div>
            <div class="flex flex-col gap-1 w-full" v-auto-animate>
                <label for="cash_register_id">Caja</label>
                <Select
                    :loading="loadingSelectData"
                    :options="cashRegisters"
                    empty-message="No se encontraron cajas"
                    option-label="nombre"
                    option-value="id"
                    show-clear
                    label-id="cash_register_id"
                    name="cash_register_id"
                    placeholder="Seleccione una caja"
                    fluid
                />

                <Message
                    v-if="$form.cash_register_id?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                    >{{ $form.cash_register_id.error.message }}
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
import { computed, defineEmits, defineProps, onMounted, ref } from 'vue';
import { z } from 'zod';
const toast = useToast();
const emit = defineEmits(['closeModal', 'newChanges']);
const loading = ref(false);
const roles = ref([]);
const store = useIndexStore();
const cashRegisters = ref([]);
const loadingSelectData = ref(false);
const props = defineProps({
    visible: Boolean,
    userData: {
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
        email: z
            .string()
            .email({ message: 'El email es inválido' })
            .nonempty({ message: 'El email es requerido' }),
        name: z
            .string()
            .nonempty({ message: 'El nombre es requerido' })
            .min(5, { message: 'Debe tener al menos 5 caracteres' })
            .max(50, { message: 'No debe exceder 50 caracteres' }),
        password: z.string().nonempty({ message: 'La contraseña es requerida' }).min(6, {
            message: 'La contraseña debe tener al menos 6 caracteres.'
        }),
        role_id: z.string().nonempty({ message: 'El rol es requerido' }),
        cash_register_id: z.string().nullable(),
        phone: z.coerce.number().min(1, { message: 'El teléfono es requerido' }),
        activo: z.boolean()
    })
);

const isEditMode = computed(() => {
    return !!props.userData?.id;
});

const initialValues = computed(() => {
    return {
        id: props.userData?.id || '',
        name: props.userData?.name || '',
        email: props.userData?.email || '',
        role_id: props.userData?.expand?.role_id?.id || '',
        cash_register_id: props.userData?.cash_register_id || '',
        password: isEditMode.value ? 'password' : '',
        phone: props.userData?.phone || null,
        activo: isEditMode.value ? props.userData?.activo : true
    };
});

const closeModal = () => {
    emit('closeModal');
};

const onFormSubmit = async (e) => {
    console.log(e);
    if (!e.valid) return;
    try {
        loading.value = true;
        const payload = {
            ...e.values,
            cafeteria_id: store?.getUserLogged?.cafeteria_id,
            passwordConfirm: e.values.password
        };
        if (isEditMode.value) {
            delete payload.password;
            delete payload.passwordConfirm;
        } else {
            payload.emailVisibility = true;
        }
        isEditMode.value
            ? await pb.collection('users').update(payload.id, payload)
            : await pb.collection('users').create(payload);
        toast.add({
            severity: 'success',
            summary: 'Operación exitosa',
            detail: `El usuario se ha ${isEditMode.value ? 'editado' : 'creado'} correctamente`,
            life: 3000
        });
        closeModal();
        emit('newChanges');
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
onMounted(async () => {
    try {
        loadingSelectData.value = true;
        roles.value = await pb.collection('roles').getFullList({
            fields: 'id,nombre'
        });
        cashRegisters.value = await pb.collection('cajas').getFullList({
            fields: 'id,nombre'
        });
    } catch (error) {
        console.log(error);
        toast.add({
            severity: 'error',
            summary: 'Operación fallida',
            detail: 'No se pudieron cargar los datos iniciales',
            life: 3000
        });
    } finally {
        loadingSelectData.value = false;
    }
});
</script>
