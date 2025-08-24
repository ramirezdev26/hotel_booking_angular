import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { unsavedChangesGuard } from './core/guards/unsaved-changes.guard';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
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
