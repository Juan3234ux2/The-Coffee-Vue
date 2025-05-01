<template>
    <div class="card">
        <div class="flex justify-between items-center mb-10">
            <h1 class="text-4xl text-black font-bold !mb-0">Categorías</h1>
            <Button
                severity="primary"
                class="!h-[3.2rem]"
                label="Agregar Categoría"
                icon="pi pi-plus"
                @click="
                    () => {
                        showModal = true;
                    }
                "
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
        <CategoryList ref="categoryList" @editCategory="editCategory" />
        <CategoryForm
            :visible="showModal"
            :categoryData
            @editCategory="editCategory"
            @closeModal="closeModal"
            @newChanges="
                () => {
                    categoryList.getCategories({ first: 0, rows: null });
                    searchInput = '';
                }
            "
        />
    </div>
</template>

<script setup>
import CategoryForm from '@/components/categories/CategoryForm.vue';
import CategoryList from '@/components/categories/CategoryList.vue';
import debounce from '@/utils/debounce';
import { ref } from 'vue';
const categoryList = ref(null);
const searchInput = ref('');
const showModal = ref(false);
const categoryData = ref({});

const editCategory = (category) => {
    showModal.value = true;
    categoryData.value = category;
};
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
