import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Reservation } from '../models/reservation.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private readonly baseUrl = environment.dbUrl;

  constructor(private http: HttpClient) {}

  /**
   * Čuvanje nove rezervacije u bazi
   */
  createReservation(reservation: Reservation): Observable<any> {
    return this.http.post(`${this.baseUrl}reservations.json`, reservation);
  }

  /**
   * Dobavljanje SVIH rezervacija iz baze (za admin stranicu)
   */
  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<{ [key: string]: Reservation }>(`${this.baseUrl}reservations.json`).pipe(
      map(res => {
        if (!res) return [];
        // Pretvaramo Firebase objekat u niz i dodajemo ID svakom elementu
        return Object.keys(res).map(key => ({
          ...res[key],
          id: key
        }));
      })
    );
  }

  /**
   * Dobavljanje aktivnih rezervacija za određeno vozilo (za kalendar)
   */
  getReservationsForVehicle(vehicleId: string): Observable<Reservation[]> {
    return this.http.get<{ [key: string]: Reservation }>(`${this.baseUrl}reservations.json`).pipe(
      map(res => {
        if (!res) return [];
        return Object.keys(res)
          .map(key => ({ ...res[key], id: key }))
          .filter(rev => rev.vehicleId === vehicleId && rev.status === 'active');
      })
    );
  }

  /**
   * Promena statusa rezervacije (npr. iz 'active' u 'finished')
   */
  updateReservationStatus(reservationId: string, newStatus: 'active' | 'finished'): Observable<any> {
    return this.http.patch(`${this.baseUrl}reservations/${reservationId}.json`, {
      status: newStatus
    });
  }
}