import { defineStore } from 'pinia';

const defaultForm = {
    1: {
        name: '',
        email: '',
        phone: null,
        password: '',
        role: '1zrdxpzbsx25ndb',
        passwordConfirm: '',
        emailVisibility: true
    },
    // gym form
    2: {
        nombre: '',
        correo: '',
        telefono: null,
        logo: null,
        src: null
    },
    3: [{ nombre: '', direccion: '' }]
};

export const useRegisterStore = defineStore('register', {
    state: () => ({
        formData: {
            ...defaultForm
        }
    }),
    actions: {
        updateField(step, field, value) {
            this.formData[step][field] = value;
        },
        reset() {
            this.formData = {
                ...defaultForm
            };
        },
        fillRegisterForm(formKey, data, indexArray) {
            if (Array.isArray(this.formData[formKey])) {
                const sucursalesUpdated = this.formData[formKey].map((sucursal, i) => {
                    if (i === indexArray) return data;

                    return sucursal;
                });

                this.formData[formKey] = sucursalesUpdated;
            } else {
                for (const field in data) {
                    this.updateField(formKey, field, data[field]);
                }
            }
        }
    }
});
