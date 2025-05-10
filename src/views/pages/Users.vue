<template>
    <div class="card">
        <div class="flex justify-between items-center mb-10">
            <h1 class="text-4xl text-black font-bold !mb-0">Usuarios</h1>

            <Button
                severity="primary"
                class="!h-[3.2rem]"
                label="Agregar Usuario"
                icon="pi pi-plus"
                @click="showModal = true"
            />
        </div>
        <div class="flex justify-between gap-4 mt-5 mb-3">
            <IconField>
                <InputIcon>
                    <i class="pi pi-search" />
                </InputIcon>
                <InputText
                    placeholder="Buscar por nombre, email"
                    @input="searchUsers"
                    v-model="searchInput"
                    class="min-w-[350px]"
                />
            </IconField>

            <Select
                v-model="selectedStatus"
                optionLabel="label"
                optionValue="value"
                show-clear
                @update:model-value="searchUsers"
                :options="[
                    {
                        label: 'Activos',
                        value: 1
                    },
                    {
                        label: 'Inactivos',
                        value: 0
                    }
                ]"
                class="w-40 items-center"
                placeholder="Estado"
            />
        </div>
        <UserList
            ref="userList"
            @edit-user="
                showModal = true;
                userData = $event;
            "
        />
        <UserForm
            :visible="showModal"
            @closeModal="
                showModal = false;
                userData = [];
            "
            :userData
            @newChanges="searchUsers"
        />
    </div>
</template>

<script setup>
import UserList from '@/components/users/UserList.vue';
import debounce from '@/utils/debounce';
import { ref } from 'vue';
const userList = ref(null);
const searchInput = ref('');
const selectedStatus = ref(null);
const showModal = ref(false);
const userData = ref({});
const searchUsers = debounce(() => {
    userList.value.getUsers({
        first: 0,
        rows: null,
        search: searchInput.value,
        status: selectedStatus.value
    });
}, 300);
</script>
