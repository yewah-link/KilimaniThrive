import { Routes } from '@angular/router';
import { BlogComponent } from './blog';
import { CreateBlogComponent } from './create-blog';
import { EditBlogComponent } from './edit-blog';
import { BlogDetailComponent } from './blog-detail';
import { authGuard } from '../../core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: BlogComponent
  },
  {
    path: 'create',
    component: CreateBlogComponent,
    canActivate: [authGuard]
  },
  {
    path: 'edit/:id',
    component: EditBlogComponent,
    canActivate: [authGuard]
  },
  {
    path: ':id',
    component: BlogDetailComponent
  }
];
