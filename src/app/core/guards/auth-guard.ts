import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Provera da li je korisnik ulogovan
  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  // 2. Provera uloge za specifične rute
  // Proveravamo da li ruta zahteva admin rolu preko 'data' objekta u ruteru
  const expectedRole = route.data['role'];
  const user = authService.getLoggedUser();

  if (expectedRole === 'admin' && user?.role !== 'admin') {
    // Ako je korisnik "customer", a strana je za admina, šaljemo ga na početnu
    alert('Nemate dozvolu za pristup ovoj stranici.');
    router.navigate(['/folder/inbox']); 
    return false;
  }

  return true;
};