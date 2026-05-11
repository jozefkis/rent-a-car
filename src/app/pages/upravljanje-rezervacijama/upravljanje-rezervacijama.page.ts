import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonButtons, 
  IonMenuButton, 
  IonSpinner, 
  IonIcon,
  IonButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendarOutline, carOutline, personOutline, checkmarkDoneOutline, documentTextOutline } from 'ionicons/icons';

// Servisi i Modeli
import { ReservationService } from '../../core/services/reservation.service';
import { DataService } from '../../core/services/data.service';
import { Vehicle } from '../../core/models/vehicle.model';
import { Reservation } from '../../core/models/reservation.model';

@Component({
  selector: 'app-upravljanje-rezervacijama',
  templateUrl: './upravljanje-rezervacijama.page.html',
  styleUrls: ['./upravljanje-rezervacijama.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonButtons, 
    IonMenuButton,
    IonSpinner,
    IonIcon,
    IonButton,
  ]
})
export class UpravljanjeRezervacijamaPage implements OnInit {
  rezervacije: any[] = [];
  isLoading = true;

  constructor(
    private reservationService: ReservationService,
    private dataService: DataService
  ) {
    // Dodate sve ikonice koje koristimo u HTML-u
    addIcons({ 
      calendarOutline, 
      carOutline, 
      personOutline, 
      checkmarkDoneOutline, 
      documentTextOutline 
    });
  }

  ngOnInit() {
    this.ucitajSve();
  }

  ucitajSve() {
    this.isLoading = true;
    
    // 1. Prvo povlačimo sva vozila da bismo imali njihove nazive i slike
    this.dataService.getVehicles().subscribe((vozila: Vehicle[]) => {
      
      // 2. Zatim povlačimo sve rezervacije
      this.reservationService.getAllReservations().subscribe((sveRezervacije: Reservation[]) => {
        
        // 3. Mapiramo (spajamo) podatke
        this.rezervacije = sveRezervacije.map((res: Reservation) => {
          const auto = vozila.find(v => v.id === res.vehicleId);
          return {
            ...res,
            vehicleName: auto ? `${auto.brand} ${auto.model}` : 'Nepoznato vozilo',
            vehicleImage: auto?.imageUrl
          };
        });

        this.isLoading = false;
      });
    });
  }

  zavrsiRezervaciju(id: string | undefined) {
    if (!id) return;

    console.log('Završavam rezervaciju:', id);
    
    // Pozivamo servis za ažuriranje statusa na "finished"
    this.reservationService.updateReservationStatus(id, 'finished').subscribe({
      next: () => {
        console.log('Status uspešno ažuriran');
        // Ponovo učitavamo sve kako bi se promena videla na ekranu (dugme nestalo, tačka posivela)
        this.ucitajSve();
      },
      error: (err) => {
        console.error('Greška pri ažuriranju statusa:', err);
      }
    });
  }
}