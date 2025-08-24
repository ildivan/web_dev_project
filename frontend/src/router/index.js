import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/public/HomeView.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
  },
  {
    path: '/register',
    name: 'Registration',
    component: () => import('../views/RegisterView.vue'),
  },
  {
    path: '/projects',
    name: 'Projects',
    component: () => import('../views/public/ProjectsView.vue'),
  },
  {
    path: '/pubblications',
    name: 'Pubblications',
    component: () => import('../views/public/PubblicationsView.vue'),
  },
  {
    path: '/contacts',
    name: 'Contacts',
    component: () => import('../views/public/ContactsView.vue'),
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/private/ProfileView.vue'),
    meta: {
      authenticationRequired: true,
    }
  },
  {
    path: '/members',
    name: 'Members',
    component: () => import('../views/public/MembersView.vue'),
  },
  {
    path: '/members/:id',
    name: 'MemberDetail',
    component: () => import( '../views/public/ComponentDetailsView.vue'),
  },
  {
    path: '/admin/projects',
    name: 'AdminProjects',
    component: () => import( '../views/private/ProjectAdministrationView.vue'),
    meta: {
      authenticationRequired: true,
    }
  },
  {
    path: '/admin/components',
    name: 'AdminComponents',
    component: () => import('../views/private/ComponentAdministrationView.vue'),
    meta: {
      authenticationRequired: true,
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('authToken');
  if (to.meta.authenticationRequired && !isAuthenticated) {
    next('/login');
  } else {
    if(to.meta.permissionRequired) {
      const userPermissions = JSON.parse(localStorage.getItem('userPermissions') || '[]');
      for (const permission of to.meta.permissionsRequired || []) {
        if (!userPermissions.includes(permission)) {
          next({ name: from.name || 'Home' });
        }
      }
    }
    next();
  }
});

export default router;
