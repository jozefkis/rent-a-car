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
    // Registracija ikonica
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

  // 1. Dobijamo trenutnog korisnika da bismo znali čije rezervacije tražimo
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

  // 2. Povlačimo rezervacije iz baze filtrirane po User ID-u
  fetchReservations(userId: string) {
    this.isLoading = true;
    this.dataService.getReservationsByUserId(userId).subscribe({
      next: (data) => {
        // Firebase vraća objekat, pa ga pretvaramo u niz za *ngFor
        if (data) {
          this.reservations = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
        } else {
          this.reservations = [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Greška pri učitavanju rezervacija:', err);
        this.isLoading = false;
      }
    });
  }

  // Pomoćna funkcija za boju statusa
  getStatusColor(status: string): string {
    const s = status?.toLowerCase();
    if (s === 'aktivna' || s === 'active') return 'success';
    if (s === 'završena' || s === 'finished') return 'medium';
    if (s === 'otkazana' || s === 'cancelled') return 'danger';
    return 'primary';
  }
}