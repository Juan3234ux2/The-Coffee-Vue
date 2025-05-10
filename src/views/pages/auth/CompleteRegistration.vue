<template>
    <div class="flex items-center justify-center w-screen h-screen">
        <div
            class="absolute top-0 z-10 flex items-center justify-center w-screen h-screen"
            v-if="animation"
        >
            <l-bouncy size="60" speed="1.3" color="#6366f1"></l-bouncy>
        </div>
        <div v-else>
            <h1 class="text-5xl font-extrabold mb-4 text-primary">¡Ya casi finalizamos!</h1>
            <p class="mt-4 text-center font-medium text-muted-color">
                Completa los siguientes campos para activar tu cuenta
            </p>
            <Form v-slot="$form" :initial-values :resolver @submit="onFormSubmit">
                <div class="mb-2 mt-4" v-auto-animate>
                    <label for="coffeeName" class="block text-lg font-semibold mb-2"
                        >Nombre de tu negocio</label
                    >
                    <InputText
                        id="coffeeName"
                        type="text"
                        placeholder="Ingrese el nombre de su negocio"
                        fluid
                        class="mb-2"
                        name="coffeeName"
                    />
                    <Message
                        v-if="$form.coffeeName?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                        >{{ $form.coffeeName.error?.message }}</Message
                    >
                </div>
                <div class="mb-2" v-auto-animate>
                    <label for="phone" class="block text-lg font-semibold mb-2">Teléfono</label>
                    <InputNumber
                        :use-grouping="false"
                        id="phone"
                        placeholder="Ingrese su número de telefono"
                        fluid
                        class="mb-2"
                        name="phone"
                    />
                    <Message
                        v-if="$form.phone?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                        >{{ $form.phone.error?.message }}</Message
                    >
                </div>
                <Button
                    label="Ingresar"
                    size="large "
                    class="w-full !min-h-[3.2rem] mt-4"
                    type="submit"
                    :loading
                ></Button>
            </Form>
        </div>
    </div>
</template>
<script setup>
import pb from '@/service/pocketbase';
import { useIndexStore } from '@/storage';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { z } from 'zod';
const toast = useToast();
const router = useRouter();
const loading = ref(false);
const animation = ref(true);
const store = useIndexStore();
const initialValues = {
    phone: null,
    coffeeName: ''
};
const resolver = zodResolver(
    z.object({
        phone: z.coerce.number().min(1, { message: 'El teléfono es requerido' }),
        coffeeName: z.string().nonempty({ message: 'El nombre de tu negocio es requerido.' })
    })
);
const getAdminRole = async () => {
    return await pb.collection('roles').getFirstListItem('nombre = "Admin"');
};
const onFormSubmit = async (e) => {
    if (!e.valid) return;
    try {
        loading.value = true;
        const { coffeeName, phone } = e.values;
        const coffeeStore = await pb.collection('cafeterias').create({
            nombre: coffeeName
        });
        const roleAdmin = await getAdminRole();
        const user = await pb.collection('users').update(pb.authStore?.record?.id, {
            cafeteria_id: coffeeStore.id,
            phone,
            activo: true,
            last_login: new Date(),
            emailVisibility: true,
            register_completed: true,
            role_id: roleAdmin.id
        });
        store.setUserLogged(user);
        toast.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Registro completado con éxito.',
            life: 3000
        });
        router.push({ name: 'dashboard' });
    } catch (error) {
        console.log(error);
        toast.add({
            severity: 'error',
            summary: 'Operación fallida',
            detail: 'No se pudo completar el registro.',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};

onMounted(async () => {
    if (!pb.authStore.isValid) {
        router.push({ name: 'login' });
    }
    if (pb.authStore?.record?.register_completed) {
        router.push({ name: 'dashboard' });
    }
    setTimeout(() => {
        animation.value = false;
    }, 2000);
});
</script>
