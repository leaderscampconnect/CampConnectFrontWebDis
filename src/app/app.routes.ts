import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { AuthService } from './core/auth.service';

export const routes: Routes = [
  {
    path: '', 
    pathMatch: 'full', 
    redirectTo: () => {
      const auth = inject(AuthService);
      if (auth.hasAnyRole('ADMIN')) return '/admin/campings';
      if (auth.hasAnyRole('SITE_OWNER')) return '/owner/dashboard';
      if (auth.hasAnyRole('CAMPER')) return '/camper/campings';
      return '/home';
    }
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
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
    path: 'events',
    loadComponent: () =>
      import('./events/events-page.component')
        .then(m => m.EventsPageComponent)
  },
  {
    path: 'notifications',
    loadComponent: () =>
      import('./notifications/notifications-page.component')
        .then(m => m.NotificationsPageComponent)
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
  // Admin routes
  {
    path: 'admin/campings',
    loadComponent: () => import('./camping/admin/camping-sites/camping-site-list/camping-site-list.component').then(m => m.CampingSiteListComponent)
  },
  {
    path: 'admin/campings/new',
    loadComponent: () => import('./camping/admin/camping-sites/camping-site-create/camping-site-create.component').then(m => m.CampingSiteCreateComponent)
  },
  {
    path: 'admin/campings/:id/edit',
    loadComponent: () => import('./camping/admin/camping-sites/camping-site-edit/camping-site-edit.component').then(m => m.CampingSiteEditComponent)
  },
  {
    path: 'admin/campings/:id',
    loadComponent: () => import('./camping/admin/camping-sites/admin-camping-site-details/admin-camping-site-details.component').then(m => m.AdminCampingSiteDetailsComponent)
  },
  {
    path: 'admin/bookings',
    loadComponent: () => import('./camping/admin/site-bookings/site-bookings.component').then(m => m.SiteBookingsComponent)
  },
  // Camper routes
  {
    path: 'camper/campings',
    loadComponent: () => import('./camping/camper/camping-sites/camping-sites.component').then(m => m.CampingSitesComponent)
  },
  {
    path: 'camper/campings/:id',
    loadComponent: () => import('./camping/camper/site-booking/site-booking.component').then(m => m.SiteBookingComponent)
  },
  {
    path: 'camper/bookings',
    loadComponent: () => import('./camping/camper/bookings/my-bookings/my-bookings.component').then(m => m.MyBookingsComponent)
  },
  {
    path: 'camper/booking-summary',
    loadComponent: () => import('./camping/camper/booking-summary/booking-summary.component').then(m => m.BookingSummaryComponent)
  },
  {
    path: 'booking-payment-success',
    loadComponent: () => import('./camping/camper/booking-payment/booking-payment-success/booking-payment-success.component').then(m => m.BookingPaymentSuccessComponent)
  },
  {
    path: 'booking-payment-cancel',
    loadComponent: () => import('./camping/camper/booking-payment/booking-payment-cancel/booking-payment-cancel.component').then(m => m.BookingPaymentCancelComponent)
  },
    {
    path: 'add-product',
    loadComponent: () => import('./produit/add-product/add-product.component').then(m => m.AddProductComponent)
  },
  {
    path: 'edit-product/:id',
    loadComponent: () => import('./produit/add-product/add-product.component').then(m => m.AddProductComponent)
  },
  {
    path: 'stock-product/:id',
    loadComponent: () => import('./produit/stock-product/stock-product.component').then(m => m.StockProductComponent)
  },
  
  // Site Owner routes
  {
    path: 'owner/dashboard',
    loadComponent: () => import('./camping/site_owner/camping-owner-dashboard/camping-owner-dashboard.component').then(m => m.CampingOwnerDashboardComponent)
  },

   
];
