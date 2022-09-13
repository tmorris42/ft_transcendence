import { createRouter, createWebHistory } from 'vue-router';
import axios from 'axios';

const routes = [
  {
    path: '/',
    component: () => import('../views/UILayout.vue'),
    children: [
      {
        path: '',
        component: () => import('../views/ProfileView.vue'),
      },
      {
        path: 'profile',
        component: () => import('../views/ProfileView.vue'),
      },
      {
        path: 'game',
        component: () => import('../views/GameView.vue'),
      },
      {
        path: 'chat',
        component: () => import('../views/ChatView.vue'),
      },
      {
        path: 'about',
        component: () => import('../views/AboutView.vue'),
      },
      {
        path: '/:pathMatch(.*)*',
        component: () => import('../views/NotFound.vue'),
      },
    ],
  },
  {
    name: 'Login',
    path: '/login',
    component: () => import('../views/LoginView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const disableAuthentification = import.meta.env.VITE_DISABLE_AUTHENTIFICATION;

router.beforeEach((to, _, next) => {
  if (
    to.name === 'Login' ||
    to.name === 'Login callback' ||
    to.name === 'Create account' ||
    disableAuthentification
  ) {
    next();
  } else {
    try {
      axios.get('/users/me');
      next();
    } catch {
      next({ name: 'Login' });
    }
  }
});

export default router;
