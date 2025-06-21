<template>
    <div class="card">
        <div class="flex justify-between items-center mb-10">
            <h1 class="text-4xl text-black font-bold !mb-0">Categorías</h1>
            <Button
                severity="primary"
                class="!h-[3.2rem]"
                label="Agregar Categoría"
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
                    placeholder="Buscar por nombre"
                    @input="searchCategories"
                    v-model="searchInput"
                    class="min-w-[350px]"
                />
            </IconField>
        </div>
        <CategoryList
            ref="categoryList"
            @editCategory="
                showModal = true;
                categoryData = $event;
            "
        />
        <ModalForm
            collection="categoria"
            endpoint="categories"
            :visible="showModal"
            :data="categoryData"
            @closeModal="closeModal"
            @newChanges="
                () => {
                    showModal = false;
                    categoryList.getCategories({ first: 0, rows: null });
                    searchInput = '';
                }
            "
        />
    </div>
</template>

<script setup>
import CategoryList from '@/components/categories/CategoryList.vue';
import ModalForm from '@/components/composables/ModalForm.vue';
import debounce from '@/utils/debounce';
import { ref } from 'vue';
const categoryList = ref(null);
const searchInput = ref('');
const showModal = ref(false);
const categoryData = ref({});

const closeModal = () => {
    showModal.value = false;
    categoryData.value = [];
};
const searchCategories = debounce(() => {
    categoryList.value.getCategories({
        first: 0,
        rows: null,
        search: searchInput.value
    });
}, 300);
</script>
