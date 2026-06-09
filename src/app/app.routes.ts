import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./auth/forgot-password/forgot-password.component')
        .then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./auth/reset-password/reset-password.component')
        .then(m => m.ResetPasswordComponent)
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./users/user-list/user-list.component')
        .then(m => m.UserListComponent)
  },
  {
    path: 'users/new',
    loadComponent: () =>
      import('./users/user-form/user-form.component')
        .then(m => m.UserFormComponent)
  },
  {
    path: 'users/edit/:id',
    loadComponent: () =>
      import('./users/user-form/user-form.component')
        .then(m => m.UserFormComponent)
  },
  {
  path: 'users/:id',
  loadComponent: () =>
    import('./users/user-detail/user-detail.component')
      .then(m => m.UserDetailComponent)
},
];