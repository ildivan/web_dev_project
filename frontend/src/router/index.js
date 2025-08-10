import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import ProjectsView from '../views/ProjectsView.vue';
import PubblicationsView from '../views/PubblicationsView.vue';
import ContactsView from '../views/ContactsView.vue';
import ProfileView from '../views/ProfileView.vue';
import MembersView from '../views/MembersView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/register',
    name: 'Registration',
    component: RegisterView,
  },
  {
    path: '/projects',
    name: 'Projects',
    component: ProjectsView,
  },
  {
    path: '/pubblications',
    name: 'Pubblications',
    component: PubblicationsView,
  },
  {
    path: '/contacts',
    name: 'Contacts',
    component: ContactsView,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileView,
    meta: {
      authenticationRequired: true,
    }
  },
  {
    path: '/members',
    name: 'Members',
    component: MembersView,
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
