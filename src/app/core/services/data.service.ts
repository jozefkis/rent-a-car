import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Vehicle } from '../models/vehicle.model';
import { User } from '../models/user.model';
import { Reservation } from '../models/reservation.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private baseUrl = environment.dbUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  /**
   * Pomoćna metoda za dobavljanje tokena iz AuthService-a
   */
  private getTokenQuery(): string {
    const token = this.authService.getLoggedUser()?.token;
    return token ? `?auth=${token}` : '';
  }

  // --- VOZILA ---

  addVehicle(vehicle: Vehicle): Observable<any> {
    return this.http.post(
      `${this.baseUrl}vehicles.json${this.getTokenQuery()}`,
      vehicle,
    );
  }

  getVehicles(): Observable<Vehicle[]> {
    // Čitanje obično zahteva auth ako su pravila podešena na ".read": "auth != null"
    return this.http
      .get<{
        [key: string]: Vehicle;
      }>(`${this.baseUrl}vehicles.json${this.getTokenQuery()}`)
      .pipe(map((res) => this.transformFirebaseData(res)));
  }

  getAvailableVehicles(): Observable<Vehicle[]> {
    return this.getVehicles().pipe(
      map((vehicles) => vehicles.filter((v) => v.isAvailable === true)),
    );
  }

  updateVehicle(id: string, vehicle: Vehicle): Observable<any> {
    return this.http.put(
      `${this.baseUrl}vehicles/${id}.json${this.getTokenQuery()}`,
      vehicle,
    );
  }

  deleteVehicle(id: string): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}vehicles/${id}.json${this.getTokenQuery()}`,
    );
  }

  getVehicleById(id: string): Observable<any> {
    return this.http.get(
      `${this.baseUrl}vehicles/${id}.json${this.getTokenQuery()}`,
    );
  }

  // --- KORISNICI ---

  addUser(user: User): Observable<any> {
    return this.http.post(
      `${this.baseUrl}users.json${this.getTokenQuery()}`,
      user,
    );
  }

  getUsers(): Observable<User[]> {
    return this.http
      .get<{
        [key: string]: User;
      }>(`${this.baseUrl}users.json${this.getTokenQuery()}`)
      .pipe(map((res) => this.transformFirebaseData(res)));
  }

  getUserByUsername(username: string): Observable<User | null> {
    const token =
      this.authService.getLoggedUser()?.token ||
      localStorage.getItem('temp_token');

    // 1. Počinjemo sa osnovnim URL-om i prvim obaveznim parametrom (koristimo ?)
    let url = `${this.baseUrl}users.json?orderBy="username"&equalTo="${username}"`;

    // 2. Ako imamo token, dodajemo ga na kraj (koristimo & jer ? već postoji)
    if (token) {
      url += `&auth=${token}`;
    }

    return this.http.get<{ [key: string]: User }>(url).pipe(
      map((res) => {
        const keys = Object.keys(res || {});
        if (keys.length === 0) return null;
        // Vraćamo prvog pronađenog korisnika sa njegovim Firebase ID-em
        return { ...res[keys[0]], id: keys[0] };
      }),
    );
  }

  updateUser(id: string, user: User): Observable<any> {
    return this.http.patch(
      `${this.baseUrl}users/${id}.json${this.getTokenQuery()}`,
      user,
    );
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}users/${id}.json${this.getTokenQuery()}`,
    );
  }

  // --- REZERVACIJE ---

  addReservation(res: Reservation): Observable<any> {
    return this.http.post(
      `${this.baseUrl}reservations.json${this.getTokenQuery()}`,
      res,
    );
  }

  getReservations(): Observable<Reservation[]> {
    return this.http
      .get<{
        [key: string]: Reservation;
      }>(`${this.baseUrl}reservations.json${this.getTokenQuery()}`)
      .pipe(map((res) => this.transformFirebaseData(res)));
  }

  updateReservation(id: string, res: Reservation): Observable<any> {
    return this.http.put(
      `${this.baseUrl}reservations/${id}.json${this.getTokenQuery()}`,
      res,
    );
  }

  deleteReservation(id: string): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}reservations/${id}.json${this.getTokenQuery()}`,
    );
  }

  getReservationsByUserId(id: string): Observable<any> {
    const url = `${this.baseUrl}reservations.json${this.getTokenQuery()}&orderBy="userId"&equalTo="${id}"`;
    return this.http.get(url);
  }

  private transformFirebaseData(res: any): any[] {
    const output = [];
    for (const key in res) {
      if (res.hasOwnProperty(key)) {
        output.push({ ...res[key], id: key });
      }
    }
    return output;
  }
}
