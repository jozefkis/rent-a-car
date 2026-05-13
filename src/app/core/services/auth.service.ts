import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { getAuth, updateEmail, updatePassword } from 'firebase/auth';

interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean;
}

interface UserData {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // 1. BehaviorSubject čuva trenutno stanje korisnika.
  // Inicijalno pokušava da pročita 'loggedUser' iz localStorage-a.
  private currentUserSubject = new BehaviorSubject<User | null>(
    JSON.parse(localStorage.getItem('loggedUser') || 'null'),
  );

  // 2. Observable koji komponente mogu da "slušaju" (npr. za prikaz imena u meniju)
  public currentUser$ = this.currentUserSubject.asObservable();
  private tempToken: string | null = null;

  setTokenOnly(token: string) {
    this.tempToken = token;
    // Opciono: ako tvoj getLoggedUser() vuče podatke iz LocalStorage-a,
    // privremeno snimi token tamo da bi DataService mogao da ga dohvati.
    localStorage.setItem('temp_token', token);
  }

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {}

  /**
   * Postavlja korisnika u sesiju i obaveštava celu aplikaciju
   */
  // setCurrentUser(user: User): void {
  //   localStorage.setItem('loggedUser', JSON.stringify(user));
  //   // Emitujemo novu vrednost svim pretplatnicima
  //   this.currentUserSubject.next(user);
  // }
  // U auth.service.ts
  setCurrentUser(user: any, token: string): void {
    const userData = { ...user, token: token }; // Spajamo podatke iz baze i token
    localStorage.setItem('loggedUser', JSON.stringify(userData));
    this.currentUserSubject.next(userData);
  }

  /**
   * Vraća trenutnu vrednost korisnika (snapshot)
   */
  getLoggedUser(): User | null {
    // 1. Prvo gledamo da li imamo korisnika u memoriji (Subject)
    if (this.currentUserSubject.value) {
      return this.currentUserSubject.value;
    }

    // 2. Ako je memorija prazna (npr. nakon osvežavanja stranice),
    // proveravamo localStorage da aplikacija ne bi "izgubila" login
    const savedUser = localStorage.getItem('loggedUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      this.currentUserSubject.next(user); // Vraćamo ga u Subject za ubuduće
      return user;
    }

    return null;
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

  register(username: string, password: string) {
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebase.apiKey}`,
      { email: username, password: password, returnSecureToken: true },
    );
  }

  logout(): void {
    localStorage.clear(); // Briše sve odjednom
    this.currentUserSubject.next(null);
    console.log('Podaci očišćeni.');
  }

  logIn(username: string, password: string) {
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebase.apiKey}`,
      { email: username, password: password, returnSecureToken: true },
    );
  }

  /**
   * Kompletna odjava: čišćenje memorije, storage-a i preusmeravanje
   */

  updateCredentials(newUsername: string, newPw: string): Observable<any> {
    const currentUser = this.getLoggedUser();
    // DODAJ CONSOLE LOG DA VIDIŠ ŠTA STVARNO ŠALJEŠ
    console.log('Trenutni korisnik iz memorije:', currentUser);

    const idToken = currentUser?.token; // Proveri da li se tvoj ključ u User modelu zove 'token' ili 'idToken'

    if (!idToken) {
      throw new Error('Nema validnog tokena! Korisnik mora biti ulogovan.');
    }

    const url = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${environment.firebase.apiKey}`;

    // Formatiramo email bez razmaka
    const formattedEmail = `${newUsername.trim().replace(/\s+/g, '')}@gmail.com`;

    const body = {
      idToken: idToken,
      email: formattedEmail,
      password: newPw,
      returnSecureToken: true,
    };

    console.log(body.email, body.password);

    return this.http.post(url, body);
  }
}
