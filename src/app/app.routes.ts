import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login';
import { RegisterComponent } from './features/auth/register';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/home/home.routes').then(m => m.routes)
  },
  {
    path: 'prayer-requests',
    loadChildren: () => import('./features/prayer-request/prayer-request.routes').then(m => m.routes)
  },
  {
    path: 'therapy',
    loadChildren: () => import('./features/therapy/therapy.routes').then(m => m.routes)
  },
  {
    path: 'bible-study',
    loadChildren: () => import('./features/bible-study/bible-study.routes').then(m => m.routes)
  },
  {
    path: 'blog',
    loadChildren: () => import('./features/blog/blog.routes').then(m => m.routes)
  },
  {
    path: 'about',
    loadChildren: () => import('./features/about/about.routes').then(m => m.routes)
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
