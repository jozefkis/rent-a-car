import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Reservation } from '../models/reservation.model';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service'; // Obavezno uvezi AuthService

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private readonly baseUrl = environment.dbUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService, // Ubaci ga u konstruktor
  ) {}

  /**
   * Pomoćna metoda za kreiranje auth query stringa
   */
  private getTokenQuery(): string {
    const token = this.authService.getLoggedUser()?.token;
    return token ? `?auth=${token}` : '';
  }

  /**
   * Čuvanje nove rezervacije u bazi
   */
  createReservation(reservation: Reservation): Observable<any> {
    const url = `${this.baseUrl}reservations.json${this.getTokenQuery()}`;
    return this.http.post(url, reservation);
  }

  /**
   * Dobavljanje SVIH rezervacija iz baze (za admin stranicu)
   */
  getAllReservations(): Observable<Reservation[]> {
    const url = `${this.baseUrl}reservations.json${this.getTokenQuery()}`;
    return this.http.get<{ [key: string]: Reservation }>(url).pipe(
      map((res) => {
        if (!res) return [];
        return Object.keys(res).map((key) => ({
          ...res[key],
          id: key,
        }));
      }),
    );
  }

  getReservationsForVehicle(vehicleId: string): Observable<Reservation[]> {
    // 1. Definišemo query parametre
    // PAŽNJA: Firebase zahteva da vrednosti u navodnicima budu unutar stringa
    const queryParams = `&orderBy="vehicleId"&equalTo="${vehicleId}"`;

    // 2. Sklapamo URL (pazi da getTokenQuery() vraća ?auth=TOKEN ili prazan string)
    const url = `${this.baseUrl}reservations.json${this.getTokenQuery()}${queryParams}`;

    return this.http.get<{ [key: string]: Reservation }>(url).pipe(
      map((res) => {
        if (!res) return [];

        // Pošto Firebase vraća objekat gde su ključevi ID-jevi,
        // i dalje moramo da ga mapiramo u niz, ali bez ručnog .filter() za vehicleId
        return Object.keys(res)
          .map((key) => ({
            ...res[key],
            id: key,
          }))
          .filter((rev) => rev.status === 'active'); // Status možeš ostaviti u filteru ako nemaš indeks i za njega
      }),
    );
  }

  /**
   * Promena statusa rezervacije (npr. iz 'active' u 'finished')
   */
  updateReservationStatus(
    reservationId: string,
    newStatus: 'active' | 'finished',
  ): Observable<any> {
    const url = `${this.baseUrl}reservations/${reservationId}.json${this.getTokenQuery()}`;
    return this.http.patch(url, {
      status: newStatus,
    });
  }
}
