import { createRouter, createWebHistory } from 'vue-router';
import { isComponent } from '../apiCalls/apiCalls.js'

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
    component: () => import('../views/public/PublicationsView.vue'),
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
    path: '/publications/:id',
    name: 'PublicationDetail',
    component: () => import( '../views/public/PublicationsDetailsView.vue'),
  },
  {
    path: '/projects/:id',
    name: 'ProjectDetail',
    component: () => import( '../views/public/ProjectDetailsView.vue'),
  },
  {
    path: '/admin/projects',
    name: 'AdminProjects',
    component: () => import( '../views/private/ProjectAdministrationView.vue'),
    meta: {
      authenticationRequired: true,
      componentRequired: true,
    }
  },
  {
    path: '/admin/components',
    name: 'AdminComponents',
    component: () => import('../views/private/ComponentAdministrationView.vue'),
    meta: {
      authenticationRequired: true,
      isComponentRequired: true,
    }
  },
  {
    path: '/admin/publications',
    name: 'AdminPublications',
    component: () => import('../views/private/PublicationAdministrationView.vue'),
    meta: {
      authenticationRequired: true,
      isComponentRequired: true,
    }
  },
  {
    path: '/admin/courses',
    name: 'AdminCourses',
    component: () => import('../views/private/CourseAdministrationView.vue'),
    meta: {
      authenticationRequired: true,
      isComponentRequired: true,
    }
  },
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: () => import('../views/public/UnauthorizedView.vue'),
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('authToken');
  if (to.meta.authenticationRequired && !isAuthenticated) {
    next('/login');
  } else {
    if(to.meta.isComponentRequired) {
      if (!(await isComponent()).is_component) {
        next('/unauthorized');
        return;
      }
    }
    next();
  }
});

export default router;
