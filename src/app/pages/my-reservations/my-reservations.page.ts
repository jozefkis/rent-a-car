import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonMenuButton, IonCard, IonItem, IonIcon, IonLabel,
  IonBadge, IonButton, IonCardContent, IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  carOutline, calendarOutline, cashOutline,
  calendarClearOutline, alertCircleOutline
} from 'ionicons/icons';

import { AuthService } from 'src/app/core/services/auth.service';
import { DataService } from 'src/app/core/services/data.service';
import { forkJoin, map, switchMap, of } from 'rxjs';

@Component({
  selector: 'app-my-reservations',
  templateUrl: './my-reservations.page.html',
  styleUrls: ['./my-reservations.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
    IonMenuButton, IonCard, IonItem, IonIcon, IonLabel,
    IonBadge, IonButton, IonCardContent
  ]
})
export class MyReservationsPage implements OnInit {

  reservations: any[] = [];
  isLoading: boolean = true;
  user: any = null;

  constructor(
    private dataService: DataService,
    private authService: AuthService
  ) {
    addIcons({
      carOutline,
      calendarOutline,
      cashOutline,
      calendarClearOutline,
      alertCircleOutline
    });
  }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    this.authService.currentUser$.subscribe({
      next: (userData) => {
        if (userData) {
          this.user = userData;
          this.fetchReservations(this.user.id);
        }
      },
      error: (err) => {
        console.error('Greška pri učitavanju korisnika:', err);
        this.isLoading = false;
      }
    });
  }

  fetchReservations(userId: string) {
    this.isLoading = true;

    this.dataService.getReservationsByUserId(userId).pipe(
      switchMap((reservationsObj: any) => {
        if (!reservationsObj) return of([]);

        const reservationsArray = Object.keys(reservationsObj).map(key => ({
          id: key,
          ...reservationsObj[key]
        }));

        const detailedReservationsObs = reservationsArray.map(res =>
          this.dataService.getVehicleById(res.vehicleId).pipe(
            map(vehicle => {
              return {
                ...res,
                carModel: vehicle?.model || 'Nepoznat model',
                carBrand: vehicle?.brand || 'Nepoznata marka'
              };
            })
          )
        );

        return forkJoin(detailedReservationsObs);
      })
    ).subscribe({
      next: (fullData) => {
        this.reservations = fullData;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Greška pri spajanju podataka:', err);
        this.isLoading = false;
      }
    });
  }

  getStatusColor(status: string): string {
    const s = status?.toLowerCase();
    if (s === 'aktivna' || s === 'active') return 'success';
    if (s === 'završena' || s === 'finished') return 'medium';
    if (s === 'otkazana' || s === 'cancelled') return 'danger';
    return 'primary';
  }
}