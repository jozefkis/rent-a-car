import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // 1. BehaviorSubject čuva trenutno stanje korisnika.
  // Inicijalno pokušava da pročita 'loggedUser' iz localStorage-a.
  private currentUserSubject = new BehaviorSubject<User | null>(
    JSON.parse(localStorage.getItem('loggedUser') || 'null')
  );

  // 2. Observable koji komponente mogu da "slušaju" (npr. za prikaz imena u meniju)
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private router: Router) { }

  /**
   * Postavlja korisnika u sesiju i obaveštava celu aplikaciju
   */
  setCurrentUser(user: User): void {
    localStorage.setItem('loggedUser', JSON.stringify(user));
    // Emitujemo novu vrednost svim pretplatnicima
    this.currentUserSubject.next(user);
  }

  /**
   * Vraća trenutnu vrednost korisnika (snapshot)
   */
  getLoggedUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Sinhrona provera da li je korisnik ulogovan
   */
  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
   * Provera uloge korisnika
   */
  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'admin';
  }

  /**
   * Kompletna odjava: čišćenje memorije, storage-a i preusmeravanje
   */
  logout(): void {
    localStorage.clear(); // Briše sve odjednom
    this.currentUserSubject.next(null);
    console.log('Podaci očišćeni.');
  }
}