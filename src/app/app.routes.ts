import { Routes } from '@angular/router';

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
  },
  {
    path: 'upravljanje-nalozima',
    loadComponent: () => import('./pages/upravljanje-nalozima/upravljanje-nalozima.page').then( m => m.UpravljanjeNalozimaPage)
  },
  {
    path: 'upravljanje-vozilima',
    loadComponent: () => import('./pages/upravljanje-vozilima/upravljanje-vozilima.page').then( m => m.UpravljanjeVozilimaPage)
  },
  {
    path: 'upravljanje-rezervacijama',
    loadComponent: () => import('./pages/upravljanje-rezervacijama/upravljanje-rezervacijama.page').then( m => m.UpravljanjeRezervacijamaPage)
  },


];
