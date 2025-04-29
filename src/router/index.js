import AppLayout from '@/layout/AppLayout.vue';
import pb from '@/service/pocketbase';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/admin',
            component: AppLayout,
            children: [
                {
                    path: 'dashboard',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: 'products',

                    children: [
                        {
                            path: '',
                            name: 'products',
                            component: () => import('@/views/pages/Products.vue')
                        },
                        {
                            path: 'new',
                            name: 'new-product',
                            component: () => import('@/views/pages/ProductForm.vue')
                        },
                        {
                            path: 'edit/:id',
                            name: 'edit-product',
                            component: () => import('@/views/pages/ProductForm.vue')
                        }
                    ]
                }
            ]
        },
        {
            path: '/',
            name: 'landing',
            component: () => import('@/views/pages/Landing.vue')
        },
        {
            path: '/auth',
            component: () => import('@/layout/AuthLayout.vue'),
            children: [
                {
                    path: 'register',
                    name: 'register',
                    component: () => import('@/views/pages/auth/Register.vue')
                },
                {
                    path: 'login',
                    name: 'login',
                    component: () => import('@/views/pages/auth/Login.vue')
                },
                {
                    path: 'complete-registration',
                    name: 'complete-registration',
                    component: () => import('@/views/pages/auth/CompleteRegistration.vue')
                }
            ]
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        }
    ]
});
router.beforeEach(async (to, from, next) => {
    const loggedIn = pb.authStore.isValid;
    if (loggedIn && to.name === 'login') {
        return next({ name: 'dashboard' });
    }
    if (to.name === 'accessDenied' && loggedIn) {
        return next({ name: 'dashboard' });
    }
    next();
});
export default router;
