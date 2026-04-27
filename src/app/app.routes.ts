import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard'; // Proveri putanju do guarda

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'folder/:id',
    loadComponent: () => import('./folder/folder.page').then(m => m.FolderPage),
    canActivate: [authGuard] // Mora biti ulogovan
  },
  {
    path: 'upravljanje-nalozima',
    loadComponent: () => import('./pages/upravljanje-nalozima/upravljanje-nalozima.page').then(m => m.UpravljanjeNalozimaPage),
    canActivate: [authGuard],
    data: { role: 'admin' } // Samo admin
  },
  {
    path: 'upravljanje-vozilima',
    loadComponent: () => import('./pages/upravljanje-vozilima/upravljanje-vozilima.page').then(m => m.UpravljanjeVozilimaPage),
    canActivate: [authGuard],
    data: { role: 'admin' } // Samo admin
  },
  {
    path: 'upravljanje-rezervacijama',
    loadComponent: () => import('./pages/upravljanje-rezervacijama/upravljanje-rezervacijama.page').then(m => m.UpravljanjeRezervacijamaPage),
    canActivate: [authGuard],
    data: { role: 'admin' } // Samo admin
  }
];