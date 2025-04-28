<template>
    <Form
        v-slot="$form"
        :initialValues
        class="flex xl:gap-8 relative flex-col xl:flex-row"
        :resolver
        :initial-values
        @submit="onFormSubmit"
    >
        <div class="card grow">
            <h1 class="text-4xl text-black font-bold mb-8">Agregar Producto</h1>
            <div class="mb-2" v-auto-animate>
                <label for="codigo" class="block text-lg font-semibold mb-2">Código</label>
                <InputNumber
                    input-id="codigo"
                    :use-grouping="false"
                    placeholder="Ingrese el codigo del producto"
                    fluid
                    class="mb-2"
                    name="codigo"
                />
                <Message
                    v-if="$form.codigo?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                    >{{ $form.codigo.error?.message }}</Message
                >
            </div>
            <div class="mb-2" v-auto-animate>
                <label for="nombre" class="block text-lg font-semibold mb-2">Nombre</label>
                <InputText
                    id="nombre"
                    type="text"
                    placeholder="Ingrese el nombre del producto"
                    fluid
                    class="mb-2"
                    name="nombre"
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
                <label for="categoria" class="block text-lg font-semibold mb-2">Categoría</label>
                <Select
                    optionLabel="nombre"
                    optionValue="id"
                    :options="categories"
                    :loading="loadingCategories"
                    class="items-center mb-4"
                    fluid
                    :class="{ '!mb-2': $form.categoria_id?.invalid }"
                    name="categoria_id"
                    placeholder="Seleccione una categoría"
                />
                <Message
                    v-if="$form.categoria_id?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                    >{{ $form.categoria_id.error?.message }}</Message
                >
            </div>
            <div class="mb-2" v-auto-animate>
                <label for="descripcion" class="block text-lg font-semibold mb-2"
                    >Descripcion</label
                >
                <Textarea
                    rows="5"
                    id="descripcion"
                    placeholder="Ingrese la descripcion del producto"
                    fluid
                    class="mb-2 resize-none"
                    name="descripcion"
                />
            </div>
            <div class="mb-2" v-auto-animate>
                <label for="costo" class="block text-lg font-semibold mb-2">Costo</label>
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
                <label for="precio" class="block text-lg font-semibold mb-2">Precio</label>
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
            <div class="mb-2" v-auto-animate>
                <label for="status" class="block text-lg font-semibold mb-2">Activo</label>
                <ToggleSwitch input-id="status" class="mb-2" name="activo" />
            </div>
        </div>
        <div class="w-full xl:w-[350px]">
            <div class="card h-fit xl:fixed w-[350px]">
                <div class="flex flex-col flex-1 max-w-md mb-8">
                    <span for="codigo" class="block text-lg font-semibold mb-2"
                        >Imagen del producto</span
                    >
                    <div class="w-full bg-surface-50 dark:bg-surface-950 aspect-square">
                        <div
                            class="flex items-center justify-center h-full bg-surface-400"
                            v-if="!src"
                        >
                            <i class="pi pi-images text-white" style="font-size: 4.5rem"></i>
                        </div>
                        <img :src="src" class="object-cover w-full h-full" alt="logo" v-else />
                    </div>
                    <FileUpload
                        mode="basic"
                        @select="onFileSelect"
                        customUpload
                        auto
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
        </div>
    </Form>
</template>
<script setup>
import pb from '@/service/pocketbase';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import z from 'zod';
const toast = useToast();
const router = useRouter();
const categories = ref([]);
const loading = ref(false);
const loadingCategories = ref(false);
const imagen = ref(null);
const initialValues = {
    nombre: '',
    codigo: null,
    categoria: null,
    descripcion: '',
    costo: null,
    precio: null,
    activo: true
};
const resolver = zodResolver(
    z.object({
        nombre: z
            .string()
            .nonempty('El nombre es requerido')
            .min(4, { message: 'Mínimo 4 caracteres.' }),
        categoria_id: z.string({
            required_error: 'La categoria es requerida',
            invalid_type_error: 'La categoria es requerida'
        }),
        descripcion: z.string().optional(),
        codigo: z.coerce.number().min(1, { message: 'El codigo es requerido' }),
        costo: z.coerce.number().min(1, { message: 'El costo es requerido' }),
        precio: z.coerce.number().min(1, { message: 'El precio es requerido' }),
        activo: z.boolean()
    })
);
const src = ref(null);
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
    try {
        loading.value = true;
        const payload = { ...event.values, imagen: imagen.value };
        await pb.collection('productos').create(payload);
        toast.add({
            severity: 'success',
            summary: 'Operación exitosa',
            detail: 'El producto se ha creado correctamente',
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
onMounted(async () => {
    try {
        loadingCategories.value = true;
        const result = await pb.collection('categorias').getFullList();
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
