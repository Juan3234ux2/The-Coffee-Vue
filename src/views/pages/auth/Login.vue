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
    password: ''
};
const resolver = zodResolver(
    z.object({
        email: z
            .string()
            .email({ message: 'Correo electrónico inválido' })
            .nonempty({ message: 'El correo es requerido.' }),
        password: z.string().nonempty({ message: 'La contraseña es requerida.' })
    })
);
const onFormSubmit = async (e) => {
    if (e.valid) {
        try {
            loading.value = true;
            const authData = await pb
                .collection('users')
                .authWithPassword(e.values.email, e.values.password, {
                    expand: 'role, role.permisos, sucursal_id'
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
            console.error(error);
        } finally {
            loading.value = false;
        }
    }
};

const googleLogin = async () => {
    try {
        loading.value = true;
        const authData = await pb.collection('users').authWithOAuth2({ provider: 'google' });

        // guardando informacion de usuario
        store.setUserLogged(authData.record);

        // redireccion
        router.push({ name: 'dashboard' });
    } catch (error) {
        console.error(error);
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

<template>
    <div class="flex min-h-screen min-w-[100vw] overflow-hidden bg-white">
        <div class="w-[50vw] relative hidden lg:block">
            <div class="absolute top-0 left-0 w-full h-full bg-black/50"></div>
            <img
                src="@/assets/img/login_image.jpg"
                class="h-screen w-full object-cover"
                alt="Login"
            />
        </div>
        <div class="flex flex-col justify-center grow xl:max-w-[40%] px-10 mx-auto">
            <div class="mb-8">
                <div class="text-4xl font-bold mb-4 text-black">Bienvenido de nuevo</div>
                <span class="text-muted-color font-medium">Inicia sesión para continuar</span>
            </div>

            <Form v-slot="$form" :initial-values :resolver @submit="onFormSubmit">
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
                    <Message
                        v-if="$form.email?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                        >{{ $form.email.error?.message }}</Message
                    >
                </div>
                <div class="mb-2" v-auto-animate>
                    <label for="password" class="block font-semibold text-lg mb-2"
                        >Contraseña</label
                    >
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
                <router-link
                    to="/auth/forgot-password"
                    class="font-bold mb-4 text-end block cursor-pointer text-primary"
                    >¿Olvidaste tu contraseña?</router-link
                >
                <Button
                    label="Inicia sesión"
                    size="large "
                    class="w-full !min-h-[3.2rem]"
                    type="submit"
                    :loading
                ></Button>
            </Form>
            <Divider class="font-semibold text-black text-xl">o</Divider>
            <Button
                class="w-full mt-3 !min-h-[3.2rem]"
                severity="secondary"
                variant="outlined"
                @click="googleLogin"
            >
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
                    alt=""
                    width="24px"
                />
                <span class="ml-1"> Continuar con Google </span>
            </Button>
            <div class="py-2 mt-4 text-center font-medium text-muted-color">
                ¿No tienes una cuenta?

                <router-link to="/auth/register">
                    <span class="ml-1 font-bold text-primary"> Regístrate </span>
                </router-link>
            </div>
        </div>
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
