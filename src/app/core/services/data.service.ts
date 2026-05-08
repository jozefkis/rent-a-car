import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

// Importuj modele (napravi ove interfejse ako već nisi)
import { Vehicle } from '../models/vehicle.model';
import { User } from '../models/user.model';
import { Reservation } from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private baseUrl = environment.dbUrl;

  constructor(private http: HttpClient) { }

  // --- VOZILA (CRUD) ---
  
  addVehicle(vehicle: Vehicle): Observable<any> {
    return this.http.post(`${this.baseUrl}vehicles.json`, vehicle);
  }

  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<{ [key: string]: Vehicle }>(`${this.baseUrl}vehicles.json`).pipe(
      map(res => this.transformFirebaseData(res))
    );
  }

  getAvailableVehicles(): Observable<Vehicle[]> {
    return this.getVehicles().pipe(
      map(vehicles => vehicles.filter(v => v.isAvailable === true))
    );
  }

  updateVehicle(id: string, vehicle: Vehicle): Observable<any> {
    return this.http.put(`${this.baseUrl}vehicles/${id}.json`, vehicle);
  }

  deleteVehicle(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}vehicles/${id}.json`);
  }

  // --- KORISNICI (Auth & Management) ---

  addUser(user: User): Observable<any> {
    return this.http.post(`${this.baseUrl}users.json`, user);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<{ [key: string]: User }>(`${this.baseUrl}users.json`).pipe(
      map(res => this.transformFirebaseData(res))
    );
  }

  // Ključna metoda za tvoj "ručni" login sistem
  getUserByUsername(username: string): Observable<User | null> {
    // URL format: users.json?orderBy="username"&equalTo="uneseni_username"
    const url = `${this.baseUrl}users.json?orderBy="username"&equalTo="${username}"`;
    return this.http.get<{ [key: string]: User }>(url).pipe(
      map(res => {
        const keys = Object.keys(res || {});
        if (keys.length === 0) return null;
        // Vraćamo prvog pronađenog korisnika sa njegovim Firebase ID-em
        return { ...res[keys[0]], id: keys[0] };
      })
    );
  }

  updateUser(id: string, user: User): Observable<any> {
    return this.http.patch(`${this.baseUrl}users/${id}.json`, user);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}users/${id}.json`);
  }

  // --- REZERVACIJE ---

  addReservation(res: Reservation): Observable<any> {
    return this.http.post(`${this.baseUrl}reservations.json`, res);
  }

  getReservations(): Observable<Reservation[]> {
    return this.http.get<{ [key: string]: Reservation }>(`${this.baseUrl}reservations.json`).pipe(
      map(res => this.transformFirebaseData(res))
    );
  }

  updateReservation(id: string, res: Reservation): Observable<any> {
    return this.http.put(`${this.baseUrl}reservations/${id}.json`, res);
  }

  deleteReservation(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}reservations/${id}.json`);
  }

  // --- POMOĆNA METODA ---
  // Pretvara Firebase-ov čudni objekat { "ID1": {podaci}, "ID2": {podaci} } u niz [{...podaci, id: "ID1"}]
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