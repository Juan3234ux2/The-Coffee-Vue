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
                    path: 'rooms',
                    name: 'rooms',
                    component: () => import('@/views/pages/Rooms.vue')
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
    const isComplete = pb.authStore?.record?.register_completed;
    if (loggedIn && to.name === 'login' && isComplete) {
        return next({ name: 'dashboard' });
    }
    if (
        loggedIn &&
        !isComplete &&
        to.name !== 'complete-registration' &&
        to.fullPath.includes('/admin')
    ) {
        return next({ name: 'complete-registration' });
    }
    if (to.fullPath.includes('/admin') && !loggedIn) {
        return next({ name: 'login' });
    }

    next();
});
export default router;
