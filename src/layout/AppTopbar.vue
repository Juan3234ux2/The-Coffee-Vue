<script setup>
import { useLayout } from '@/layout/composables/layout';
import pb from '@/service/pocketbase';
import { useIndexStore } from '@/storage';
import getFileUrl from '@/utils/getFileUrl';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
const { toggleMenu, layoutState } = useLayout();
const store = useIndexStore();
const avatar = ref(null);
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

onMounted(async () => {
    const router = useRouter();
    try {
        loading.value = true;
        if (!store.userLogged && pb.authStore.isValid) {
            const store = useIndexStore();
            const user = await pb.collection('users').getOne(pb.authStore.record.id);
            store.setUserLogged(user);
        }
        if (store.userLogged?.avatar) {
            avatar.value = getFileUrl(
                store.userLogged.collectionId,
                store.userLogged.id,
                store.userLogged.avatar
            );
        }
    } catch (error) {
        pb.authStore.clear();
        store.setUserLogged(null);
        router.push({ name: 'login' });
    } finally {
        loading.value = false;
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
                <span class="font-bold text-black italic">The Coffee</span>
            </router-link>
        </div>

        <IconField class="hidden lg:block">
            <InputIcon>
                <i class="pi pi-search" />
            </InputIcon>
            <InputText placeholder="Qué estás buscando?" class="min-w-[350px]" />
        </IconField>
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
                            <Button
                                type="button"
                                @click="toggle"
                                size="small"
                                variant="text"
                                severity="contrast"
                                class="!min-w-[13rem]"
                            >
                                <Avatar
                                    v-if="avatar"
                                    :image="avatar"
                                    shape="circle"
                                    class="mr-2 !w-[35px] !h-[35px]"
                                />
                                <Avatar
                                    v-else
                                    :label="store.getUserLogged?.name[0]"
                                    class="mr-2 !w-[35px] !h-[35px]"
                                />

                                <div class="flex flex-col">
                                    <span class="text-base font-bold">
                                        {{ store.getUserLogged?.name }}
                                    </span>
                                    <span class="text-base text-muted-color"> Admin </span>
                                </div>
                                <i class="ml-1 pi pi-fw pi-chevron-down"></i>
                            </Button>

                            <Popover ref="op">
                                <div class="flex flex-col gap-2 w-[11rem]">
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

                        <ProgressSpinner
                            style="width: 27px; height: 27px"
                            class="!mr-8"
                            v-else
                            strokeWidth="4"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
