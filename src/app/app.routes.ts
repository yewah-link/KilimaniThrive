import { Routes } from '@angular/router';

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
    path: 'bible-study',
    loadChildren: () => import('./features/bible-study/bible-study.routes').then(m => m.routes)
  },
  {
    path: 'blog',
    loadChildren: () => import('./features/blog/blog.routes').then(m => m.routes)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
