import { autoAnimatePlugin } from '@formkit/auto-animate/vue';
import Aura from '@primeuix/themes/aura';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import '@/assets/styles.scss';

const app = createApp(App);
const pinia = createPinia();
app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    }
});
app.use(autoAnimatePlugin);
app.use(ToastService);
app.use(pinia);
app.use(ConfirmationService);

app.mount('#app');
