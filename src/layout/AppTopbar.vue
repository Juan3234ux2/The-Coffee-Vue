<script setup>
import { useLayout } from '@/layout/composables/layout';
import pb from '@/service/pocketbase';
import { useIndexStore } from '@/storage';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
const { toggleMenu } = useLayout();
const store = useIndexStore();
const loading = ref(false);
const op = ref();
const router = useRouter();
const toggle = (event) => {
    op.value.toggle(event);
};
const logout = () => {
    router.push({ name: 'login' });
    pb.authStore.clear();
    store.setUserLogged(null);
};
const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return 'Buenos días';
    if (currentHour < 18) return 'Buenas tardes';
    return 'Buenas noches';
};
onMounted(async () => {
    const router = useRouter();
    try {
        if (!store.userLogged && pb.authStore.isValid) {
            const store = useIndexStore();
            const user = await pb.collection('users').getOne(pb.authStore.record.id);
            store.setUserLogged(user);
        }
    } catch (error) {
        pb.authStore.clear();
        store.setUserLogged(null);
        router.push({ name: 'login' });
    }
});
</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="toggleMenu">
                <i class="pi pi-bars"></i>
            </button>
            <router-link to="/" class="layout-topbar-logo">
                <span class="font-bold">The Coffee</span>
            </router-link>
        </div>
        <div class="flex flex-col">
            <p class="text-primary font-bold !m-0" style="font-size: 1.2rem">
                {{ store.currentGym?.nombre }}
                {{ getGreeting() }}, {{ store.getUserLogged?.name }}
            </p>
            <p class="text-sm text-muted-color">Bienvenido, me alegro de verte de nuevo</p>
        </div>
        <div class="layout-topbar-actions">
            <button
                class="layout-topbar-menu-button layout-topbar-action"
                v-styleclass="{
                    selector: '@next',
                    enterFromClass: 'hidden',
                    enterActiveClass: 'animate-scalein',
                    leaveToClass: 'hidden',
                    leaveActiveClass: 'animate-fadeout',
                    hideOnOutsideClick: true
                }"
            >
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <div class="layout-topbar-actions">
                        <div class="flex items-center" v-if="!loading">
                            <Avatar
                                shape="circle"
                                :label="store.getUserLogged?.name?.substring(0, 1)"
                                class="mr-2 !w-[35px] !h-[35px]"
                            />
                            <Button
                                type="button"
                                @click="toggle"
                                size="small"
                                variant="text"
                                severity="contrast"
                            >
                                <div class="flex flex-col">
                                    <span class="text-base font-bold">
                                        {{ store.getUserLogged?.name }}
                                    </span>
                                    <span class="text-base text-muted-color"> Admin </span>
                                </div>
                                <i class="ml-1 pi pi-fw pi-chevron-down"></i>
                            </Button>

                            <Popover ref="op">
                                <div class="flex flex-col gap-2 w-[12rem]">
                                    <span class="block mb-2 font-medium" @click="toggle">
                                        Acciones
                                    </span>
                                    <Button
                                        fluid
                                        severity="secondary"
                                        class="h-[3.2rem] !justify-start"
                                    >
                                        <i class="mr-2 pi pi-user"></i>
                                        Mi perfil
                                    </Button>
                                    <Button
                                        fluid
                                        severity="secondary"
                                        class="h-[3.2rem] !justify-start"
                                        @click="logout()"
                                    >
                                        <i class="mr-2 pi pi-sign-out"></i>
                                        Cerrar sesión
                                    </Button>
                                </div>
                            </Popover>
                        </div>

                        <ProgressSpinner style="width: 27px; height: 27px" v-else strokeWidth="4" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
