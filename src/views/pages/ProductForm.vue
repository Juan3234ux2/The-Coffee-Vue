<template>
    <Form
        v-slot="$form"
        :initialValues
        class="flex xl:gap-8 mb-4 flex-col xl:flex-row relative"
        :resolver
        ref="form"
        @submit="onFormSubmit"
    >
        <div class="card grow !mb-0">
            <h1 class="text-4xl text-black font-bold mb-8">
                {{ isEditMode ? 'Editar Producto' : 'Agregar Producto' }}
            </h1>
            <div class="mb-2" v-auto-animate>
                <label for="codigo" class="block text-base font-semibold mb-2">Código</label>
                <InputText
                    id="codigo"
                    type="number"
                    min="0"
                    placeholder="Ingrese el codigo del producto"
                    fluid
                    autocomplete="off"
                    class="mb-2"
                    name="codigo"
                    @update:model-value="errorCodigo = ''"
                />
                <Message
                    v-if="$form.codigo?.invalid || errorCodigo"
                    severity="error"
                    size="small"
                    variant="simple"
                    >{{ errorCodigo || $form.codigo.error?.message }}</Message
                >
            </div>
            <div class="mb-2" v-auto-animate>
                <label for="nombre" class="block text-base font-semibold mb-2">Nombre</label>
                <InputText
                    id="nombre"
                    type="text"
                    placeholder="Ingrese el nombre del producto"
                    fluid
                    class="mb-2"
                    name="nombre"
                    autocomplete="off"
                />
                <Message
                    v-if="$form.nombre?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                    >{{ $form.nombre.error?.message }}</Message
                >
            </div>
            <div class="mb-2" v-auto-animate>
                <label for="categoria" class="block text-base font-semibold mb-2">Categoría</label>
                <Select
                    optionLabel="nombre"
                    optionValue="id"
                    label-id="categoria"
                    :options="categories"
                    :loading="loadingCategories"
                    :emptyMessage="'No se encontraron categorias'"
                    class="mb-4"
                    fluid
                    :class="{ '!mb-2': $form.categoria_id?.invalid }"
                    name="categoria_id"
                    placeholder="Seleccione una categoría"
                >
                    <template #footer>
                        <div>
                            <Button
                                label="Agregar categoría"
                                variant="text"
                                class="!h-[3.2rem] w-full"
                                @click="showCategoryModal = true"
                            /></div
                    ></template>
                </Select>
                <Message
                    v-if="$form.categoria_id?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                    >{{ $form.categoria_id.error?.message }}</Message
                >
            </div>
            <div class="mb-2" v-auto-animate>
                <label for="descripcion" class="block text-base font-semibold mb-2"
                    >Descripcion</label
                >
                <Textarea
                    rows="5"
                    id="descripcion"
                    placeholder="Ingrese la descripcion del producto"
                    fluid
                    class="mb-2 resize-none"
                    name="descripcion"
                    autocomplete="off"
                />
            </div>
            <div class="mb-2" v-auto-animate>
                <label for="costo" class="block text-base font-semibold mb-2">Costo</label>
                <InputNumber
                    input-id="costo"
                    placeholder="Ingrese el costo del producto"
                    fluid
                    class="mb-2"
                    name="costo"
                />
                <Message
                    v-if="$form.costo?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                    >{{ $form.costo.error?.message }}</Message
                >
            </div>
            <div class="mb-2" v-auto-animate>
                <label for="precio" class="block text-base font-semibold mb-2">Precio</label>
                <InputNumber
                    input-id="precio"
                    placeholder="Ingrese el precio del producto"
                    fluid
                    class="mb-2"
                    name="precio"
                />
                <Message
                    v-if="$form.precio?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                    >{{ $form.precio.error?.message }}</Message
                >
            </div>

            <div class="mb-2" v-auto-animate :class="{ hidden: !isEditMode }">
                <label for="status" class="block text-base font-semibold mb-2">Activo</label>
                <ToggleSwitch input-id="status" class="mb-2" name="activo" />
            </div>
        </div>

        <div class="card h-fit xl:sticky w-[310px] top-24">
            <div class="flex flex-col flex-1 max-w-md mb-8">
                <label class="block text-base font-semibold mb-2">Imagen del producto</label>
                <div class="w-full bg-surface-50 dark:bg-surface-950 aspect-square">
                    <div class="flex items-center justify-center h-full bg-surface-400" v-if="!src">
                        <i class="pi pi-images text-white" style="font-size: 4.5rem"></i>
                    </div>
                    <img :src="src" class="object-cover w-full h-full" alt="logo" v-else />
                </div>
                <FileUpload
                    mode="basic"
                    @select="onFileSelect"
                    customUpload
                    auto
                    accept="image/*"
                    chooseLabel="Cargar"
                    class="!h-[3.2rem]"
                    chooseIcon="pi pi-cloud-upload"
                    :chooseButtonProps="{
                        class: 'p-button-secondary w-full mt-4'
                    }"
                    v-if="!src"
                />
                <Button
                    icon="pi pi-trash"
                    variant="outlined"
                    severity="danger"
                    label="Quitar Imagen"
                    @click="src = null"
                    class="!h-[3.2rem] w-full mt-4"
                    v-else
                />
            </div>
            <div class="flex justify-end gap-4">
                <Button
                    severity="secondary"
                    class="!h-[3.2rem]"
                    label="Cancelar"
                    variant="outlined"
                    as="router-link"
                    to="/admin/products"
                />
                <Button
                    severity="primary"
                    type="submit"
                    :loading
                    class="!h-[3.2rem]"
                    label="Guardar Producto"
                />
            </div>
        </div>
    </Form>
    <ModalForm
        collection="categoria"
        :visible="showCategoryModal"
        @closeModal="showCategoryModal = false"
        @newChanges="handleCategorySave"
    />
</template>
<script setup>
import ModalForm from '@/components/composables/ModalForm.vue';
import pb from '@/service/pocketbase';
import { useIndexStore } from '@/storage';
import getFileUrl from '@/utils/getFileUrl';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import z from 'zod';
const toast = useToast();
const router = useRouter();
const route = useRoute();
const categories = ref([]);
const productData = ref(null);
const src = ref(null);
const imagen = ref(null);
const loading = ref(false);
const form = ref(null);
const errorCodigo = ref('');
const showCategoryModal = ref(false);
const store = useIndexStore();
const loadingCategories = ref(false);
const isEditMode = computed(() => (route.params?.id ? true : false));
const initialValues = computed(() => {
    return {
        nombre: productData.value?.nombre ?? '',
        codigo: productData.value?.codigo !== 0 ? productData.value?.codigo : null,
        categoria_id: productData.value?.categoria_id ?? '',
        descripcion: productData.value?.descripcion ?? '',
        costo: productData.value?.costo !== 0 ? productData.value?.costo : null,
        precio: productData.value?.precio ?? null,
        activo: isEditMode.value ? productData.value?.activo : true
    };
});
const resolver = zodResolver(
    z.object({
        nombre: z
            .string()
            .nonempty('El nombre es requerido')
            .min(4, { message: 'Mínimo 4 caracteres.' }),
        categoria_id: z.string().nonempty({ message: 'La categoria es requerida' }),
        descripcion: z.string().optional(),
        codigo: z.coerce.number().optional(),
        costo: z.coerce.number().optional(),
        precio: z.coerce.number().min(1, { message: 'El precio es requerido' }),
        activo: z.boolean()
    })
);
function onFileSelect(event) {
    const file = event.files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
        src.value = e.target.result;
    };
    reader.readAsDataURL(file);
    imagen.value = file;
}
const onFormSubmit = async (event) => {
    if (!event.valid) return;
    if (!(await validateUniqueCodigo(event.values.codigo))) {
        errorCodigo.value = 'Ya existe un producto con ese código';
        return;
    }
    try {
        loading.value = true;
        const payload = {
            ...event.values,
            imagen: imagen.value,
            cafeteria_id: store?.getUserLogged?.cafeteria_id
        };
        if (src.value && !imagen.value) {
            delete payload.imagen;
        }
        isEditMode.value
            ? await pb.collection('productos').update(route?.params?.id, payload)
            : await pb.collection('productos').create(payload);
        toast.add({
            severity: 'success',
            summary: 'Operación exitosa',
            detail: `El producto se ha ${isEditMode.value ? 'editado' : 'creado'} correctamente`,
            life: 3000
        });
        router.push('/admin/products');
    } catch (error) {
        console.log(error);
        toast.add({
            severity: 'error',
            summary: 'Operación fallida',
            detail: 'No se pudo crear el producto',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};
const handleCategorySave = (_, category) => {
    categories.value.push(category);
    form.value.setFieldValue('categoria_id', category.id);
    showCategoryModal.value = false;
};
const fetchData = async () => {
    if (!isEditMode.value) {
        productData.value = null;
        src.value = null;
        return;
    }
    try {
        loading.value = true;
        const result = await pb.collection('productos').getOne(route?.params?.id);
        productData.value = result;
        form.value.setValues({
            ...initialValues.value
        });
        src.value = result.imagen
            ? getFileUrl(result.collectionId, result.id, result.imagen)
            : null;
    } catch (error) {
        console.log(error);
        toast.add({
            severity: 'error',
            summary: 'Operación fallida',
            detail: 'No se pudo obtener el producto',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};
watch(() => route.params?.id, fetchData, { immediate: true });
const validateUniqueCodigo = async (codigo) => {
    if (codigo == productData.value?.codigo || codigo == 0) return true;
    const result = await pb.collection('productos').getList(1, 1, {
        filter: `codigo='${codigo}' && cafeteria_id='${store.getUserLogged?.cafeteria_id} && deleted=null'`
    });
    return result.totalItems === 0;
};
onMounted(async () => {
    try {
        loadingCategories.value = true;
        const result = await pb.collection('categorias').getFullList({
            filter: 'deleted=null'
        });
        categories.value = result;
    } catch (error) {
        console.log(error);
        toast.add({
            severity: 'error',
            summary: 'Operación fallida',
            detail: 'No se pudo obtener las categorias',
            life: 3000
        });
    } finally {
        loadingCategories.value = false;
    }
});
</script>
