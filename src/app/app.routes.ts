import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'campings',
    loadComponent: () =>
      import('./camping/camping-list/camping-list.component').then(m => m.CampingListComponent)
  },
  {
    path: 'campings/new',
    loadComponent: () =>
      import('./camping/camping-add/camping-add.component').then(m => m.CampingAddComponent)
  },
  {
    path: 'campings/:id',
    loadComponent: () =>
      import('./camping/camping-detail/camping-detail.component').then(m => m.CampingDetailComponent)
  },
  {
    path: 'my-bookings',
    loadComponent: () =>
      import('./bookings/my-bookings/my-bookings.component').then(m => m.MyBookingsComponent)
  },
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