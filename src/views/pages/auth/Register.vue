<script setup>
import pb from '@/service/pocketbase';
import { useIndexStore } from '@/storage';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { z } from 'zod';
const toast = useToast();
const router = useRouter();
const loading = ref(false);
const store = useIndexStore();

const initialValues = {
    email: '',
    password: '',
    name: '',
    phone: null,
    coffeeName: ''
};
const resolver = zodResolver(
    z.object({
        email: z
            .string()
            .email({ message: 'Correo electrónico inválido' })
            .nonempty({ message: 'El correo es requerido.' }),
        name: z.string().nonempty({ message: 'El nombre es requerido.' }),
        password: z.string().nonempty({ message: 'La contraseña es requerida.' }).min(6, {
            message: 'La contraseña debe tener al menos 6 caracteres.'
        }),
        phone: z.coerce.number().min(1, { message: 'El teléfono es requerido' }),
        coffeeName: z.string().nonempty({ message: 'El nombre de tu negocio es requerido.' })
    })
);
const getAdminRole = async () => {
    return await pb.collection('roles').getFirstListItem('nombre = "Admin"');
};
const onFormSubmit = async (e) => {
    if (!e.valid) return;
    let coffeeStore = null;
    try {
        loading.value = true;
        const { email, name, password, coffeeName, phone } = e.values;
        coffeeStore = await pb.collection('cafeterias').create({
            nombre: e.values.coffeeName
        });
        const roleAdmin = await getAdminRole();
        await createUser(roleAdmin.id, coffeeStore.id, name, email, password), phone;
        const authData = await pb.collection('users').authWithPassword(email, password, {
            expand: 'role_id'
        });
        store.setUserLogged(authData.record);

        router.push({ name: 'dashboard' });
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Operación fallida',
            detail: 'Intentelo nuevamente',
            life: 3000
        });
        if (coffeeStore?.id) {
            await pb.collection('cafeterias').delete(coffeeStore?.id);
        }
        console.log(error);
    } finally {
        loading.value = false;
    }
};

const createUser = async (roleId, coffeeStoreId, name, email, password, phone) => {
    return await pb.collection('users').create({
        email,
        name,
        password,
        phone,
        passwordConfirm: password,
        role_id: roleId,
        cafeteria_id: coffeeStoreId,
        emailVisibility: true,
        last_login: new Date()
    });
};
</script>

<template>
    <div class="mb-4">
        <div class="text-4xl font-bold mb-4 text-black">¡Empezá ahora!</div>
        <span class="text-muted-color font-medium">Creá tu cuenta en segundos.</span>
    </div>

    <Form v-slot="$form" :initial-values :resolver @submit="onFormSubmit">
        <div class="mb-2" v-auto-animate>
            <label for="name" class="block text-lg font-semibold mb-2">Tu nombre</label>
            <InputText
                id="name"
                type="text"
                placeholder="Ingrese su nombre"
                fluid
                class="mb-2"
                name="name"
            />
            <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">{{
                $form.name.error?.message
            }}</Message>
        </div>

        <div class="mb-2" v-auto-animate>
            <label for="email" class="block text-lg font-semibold mb-2">Email</label>
            <InputText
                id="email"
                type="text"
                placeholder="Ingrese su correo electrónico"
                fluid
                class="mb-2"
                name="email"
            />
            <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">{{
                $form.email.error?.message
            }}</Message>
        </div>
        <div class="mb-2" v-auto-animate>
            <label for="password" class="block font-semibold text-lg mb-2">Contraseña</label>
            <Password
                input-id="password"
                name="password"
                placeholder="Ingrese su contraseña"
                class="mb-2"
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
        <div class="my-2" v-auto-animate>
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
            <Message v-if="$form.phone?.invalid" severity="error" size="small" variant="simple">{{
                $form.phone.error?.message
            }}</Message>
        </div>
        <Button
            label="Regístrate"
            size="large "
            class="w-full !min-h-[3.2rem] mt-4"
            type="submit"
            :loading
        ></Button>
    </Form>
    <div class="py-2 mt-4 text-center font-medium text-muted-color lg:hidden">
        ¿Ya tienes una cuenta?

        <router-link to="/auth/login">
            <span class="ml-1 font-bold text-primary"> Iniciar Sesión </span>
        </router-link>
    </div>
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
