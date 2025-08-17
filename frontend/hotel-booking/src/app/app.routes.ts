import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import {BookingComponent} from './shared/booking/booking';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'booking', component: BookingComponent },
  { path: '**', redirectTo: '' }
];
