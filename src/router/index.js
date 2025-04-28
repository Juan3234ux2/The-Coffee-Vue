import AppLayout from '@/layout/AppLayout.vue';
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
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
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

export default router;
