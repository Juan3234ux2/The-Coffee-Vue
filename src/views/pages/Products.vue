<template>
    <div class="card">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-4xl text-black font-bold">Productos</h1>
            <div class="flex gap-4">
                <Button
                    severity="secondary"
                    class="!h-[3.2rem]"
                    label="Importar Productos"
                    icon="pi pi-upload"
                />
                <Button
                    severity="primary"
                    class="!h-[3.2rem]"
                    label="Agregar Producto"
                    icon="pi pi-plus"
                    as="router-link"
                    to="products/new"
                />
            </div>
        </div>
        <div class="flex justify-between gap-4 mt-5 mb-3">
            <IconField>
                <InputIcon>
                    <i class="pi pi-search" />
                </InputIcon>
                <InputText
                    placeholder="Buscar por nombre o código"
                    @input="searchProducts"
                    v-model="searchInput"
                    class="min-w-[350px]"
                />
            </IconField>
            <div class="flex gap-4">
                <MultiSelect
                    filter
                    empty-filter-message="No se encontraron categorías"
                    v-model="selectedCategories"
                    optionLabel="nombre"
                    optionValue="id"
                    :options="categories"
                    :loading="loadingCategories"
                    class="w-52 items-center"
                    @update:model-value="searchProducts"
                    empty-message="No hay categorías"
                    placeholder="Categoría"
                />
                <Select
                    v-model="selectedStatus"
                    optionLabel="label"
                    optionValue="value"
                    @update:model-value="searchProducts"
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
        </div>
        <ProductList ref="productList" />
    </div>
</template>

<script setup>
import ProductList from '@/components/products/ProductList.vue';
import pb from '@/service/pocketbase';
import debounce from '@/utils/debounce';
import { useToast } from 'primevue';
import { onMounted, ref } from 'vue';
const productList = ref(null);
const searchInput = ref('');
const categories = ref([]);
const loadingCategories = ref(false);
const selectedCategories = ref(null);
const selectedStatus = ref(1);
const toast = useToast();
const searchProducts = debounce(() => {
    productList.value.getProducts({
        first: 0,
        rows: null,
        search: searchInput.value,
        status: selectedStatus.value,
        categories: selectedCategories.value
    });
}, 300);
onMounted(async () => {
    try {
        loadingCategories.value = true;
        const result = await pb.collection('categorias').getFullList({ sort: '-created' });
        categories.value = result;
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Operación fallida',
            detail: 'No se pudo obtener las categorías',
            life: 3000
        });
        console.log(error);
    } finally {
        loadingCategories.value = false;
    }
});
</script>
