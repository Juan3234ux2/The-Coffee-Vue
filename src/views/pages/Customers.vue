<template>
    <div class="card">
        <div class="flex justify-between items-center mb-10">
            <h1 class="text-4xl text-black font-bold !mb-0">Clientes</h1>
            <Button
                severity="primary"
                class="!h-[3.2rem]"
                label="Agregar Cliente"
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
                    placeholder="Buscar por nombre, identificación o email"
                    @input="searchCustomers"
                    v-model="searchInput"
                    class="min-w-[250px] sm:min-w-[350px]"
                />
            </IconField>
            <Select
                v-model="selectedStatus"
                optionLabel="label"
                optionValue="value"
                show-clear
                @update:model-value="searchCustomers"
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
        <CustomersList
            ref="customerList"
            @editCustomer="
                showModal = true;
                customerData = $event;
            "
        />
        <CustomerForm
            :visible="showModal"
            :customerData
            @closeModal="
                showModal = false;
                customerData = [];
            "
            @newChanges="searchCustomers"
        />
    </div>
</template>

<script setup>
import CustomerForm from '@/components/customers/CustomerForm.vue';
import CustomersList from '@/components/customers/CustomersList.vue';
import debounce from '@/utils/debounce';
import { ref } from 'vue';
const customerList = ref(null);
const searchInput = ref('');
const showModal = ref(false);
const selectedStatus = ref(null);
const customerData = ref({});
const searchCustomers = debounce(() => {
    customerList.value.getCustomers({
        first: 0,
        rows: null,
        search: searchInput.value,
        status: selectedStatus.value
    });
}, 300);
</script>
