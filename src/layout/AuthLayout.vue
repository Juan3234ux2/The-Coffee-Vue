<template>
    <div class="flex w-screen h-screen overflow-hidden bg-white relative">
        <div
            class="w-[50vw] relative hidden lg:block transition-transform duration-500 z-10"
            :class="{
                '!hidden': $route.name == 'complete-registration',
                'translate-x-0': isMobile || $route.name === 'login',
                'translate-x-[50vw]': !isMobile && $route.name === 'register'
            }"
        >
            <div class="absolute top-0 left-0 w-full h-full bg-black/70"></div>
            <img
                src="@/assets/img/login_image.jpg"
                class="h-screen w-full object-cover"
                alt="Imagen"
            />

            <div
                class="absolute inset-0 z-20 flex flex-col items-center justify-center text-white text-center px-10"
            >
                <h2 class="text-4xl font-bold mb-4 text-white">
                    {{ $route.name === 'login' ? '¿Nuevo por aquí?' : '¿Ya tenés cuenta?' }}
                </h2>
                <p class="mb-6">
                    {{
                        $route.name === 'login'
                            ? 'Registrate y empezá a gestionar tu cafetería.'
                            : 'Iniciá sesión para continuar con tu negocio.'
                    }}
                </p>
                <RouterLink :to="$route.name === 'login' ? '/auth/register' : '/auth/login'">
                    <Button
                        label="Crear cuenta"
                        class="!h-[3.2rem] !font-bold !text-black"
                        severity="secondary"
                    >
                        {{ $route.name === 'login' ? 'Crear cuenta' : 'Iniciar sesión' }}
                    </Button>
                </RouterLink>
            </div>
        </div>

        <div
            class="flex flex-col justify-center grow sm:max-w-[80%] md:max-w-[60%] xl:max-w-[40%] px-10 mx-auto transition-transform duration-500"
            :class="{
                '!min-w-screen !mx-0 !px-0': $route.name == 'complete-registration',
                'translate-x-0': isMobile || $route.name === 'login',
                '-translate-x-[50vw]': !isMobile && $route.name === 'register'
            }"
        >
            <router-view />
        </div>
    </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

const isMobile = ref(false);

const checkMobile = () => {
    isMobile.value = window.innerWidth < 1024;
};

onMounted(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', checkMobile);
});
</script>
