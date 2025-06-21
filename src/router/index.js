import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/admin',
            component: AppLayout,
            meta: {
                requiresAuth: true
            },
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
                },
                {
                    path: 'categories',
                    name: 'categories',
                    component: () => import('@/views/pages/Categories.vue')
                },
                {
                    path: 'customers',
                    name: 'customers',
                    component: () => import('@/views/pages/Customers.vue')
                },
                {
                    path: 'shifts',
                    name: 'shifts',
                    component: () => import('@/views/pages/Shifts.vue')
                },
                {
                    path: 'rooms',
                    name: 'rooms',
                    component: () => import('@/views/pages/Rooms.vue')
                },
                {
                    path: 'users',
                    name: 'users',
                    component: () => import('@/views/pages/Users.vue')
                },
                {
                    path: 'cash-registers',
                    name: 'cash-registers',
                    component: () => import('@/views/pages/CashRegisters.vue')
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
            path: '/pos',
            component: AppLayout,
            children: [
                {
                    path: '',
                    name: 'pos',
                    component: () => import('@/views/pages/TablesPos.vue')
                },
                {
                    path: 'order-details/:id',
                    name: 'order-details',
                    component: () => import('@/views/pages/CashRegisters.vue')
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
    const token = localStorage.getItem('token');

    next();
});
export default router;
