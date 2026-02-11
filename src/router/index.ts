import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      meta: { title: 'Cálculo de Dígito Verificador' },
    },
    {
      path: '/sobre',
      name: 'sobre',
      component: () => import('@/views/Sobre.vue'),
      meta: { title: 'Sobre' },
    },
    {
      path: '/privacidade',
      name: 'privacidade',
      component: () => import('@/views/Privacidade.vue'),
      meta: { title: 'Privacidade' },
    },
    {
      path: '/como-usar',
      name: 'como-usar',
      component: () => import('@/views/ComoUsar.vue'),
      meta: { title: 'Como Usar' },
    },
  ],
});

router.beforeEach((to, _from, next) => {
  const title = to.meta?.title as string | undefined;
  if (title) {
    document.title = `${title} | Cálculo de Dígito Verificador`;
  }
  next();
});

export default router;
