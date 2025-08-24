import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { unsavedChangesGuard } from './core/guards/unsaved-changes.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'search',
    loadComponent: () => import('./pages/search/search').then(m => m.SearchComponent)
  },
  {
    path: 'my-bookings',
    loadComponent: () => import('./pages/my-bookings/my-bookings').then(m => m.MyBookingsComponent)
  },
  {
    path: 'booking',
    loadComponent: () => import('./shared/booking/booking').then(m => m.BookingComponent),
    canDeactivate: [unsavedChangesGuard]
  },
  {
    path: '404',
    loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFoundComponent)
  },
  { path: '**', redirectTo: '/404' }
];
