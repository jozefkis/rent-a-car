import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // BehaviorSubject ili obična varijabla za čuvanje stanja u memoriji
  private currentUser: User | null = null;

  constructor() {
    // Čim se aplikacija pokrene, proveravamo da li u memoriji imamo sačuvanog usera
    const savedUser = localStorage.getItem('loggedUser');
    if (savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser);
      } catch (e) {
        console.error('Greška pri čitanju korisnika iz memorije', e);
        this.logout();
      }
    }
  }

  /**
   * Postavlja korisnika kao ulogovanog i čuva ga u memoriji
   */
  setCurrentUser(user: User) {
    this.currentUser = user;
    // Čuvamo ceo objekat (bez lozinke ako želiš da budeš sigurniji, ali za seminarski može sve)
    localStorage.setItem('loggedUser', JSON.stringify(user));
  }

  /**
   * Vraća podatke o trenutno ulogovanom korisniku
   */
  getLoggedUser(): User | null {
    return this.currentUser;
  }

  /**
   * Proverava da li je iko ulogovan
   */
  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  /**
   * Proverava da li je ulogovani korisnik administrator
   */
  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  /**
   * Odjavljuje korisnika i čisti memoriju
   */
  logout() {
    this.currentUser = null;
    localStorage.removeItem('loggedUser');
  }
}