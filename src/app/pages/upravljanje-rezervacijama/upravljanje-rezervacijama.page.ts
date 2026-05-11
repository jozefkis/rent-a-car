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
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendarOutline, carOutline, personOutline } from 'ionicons/icons';

// Servisi i Modeli
import { ReservationService } from '../../core/services/reservation.service';
import { DataService } from '../../core/services/data.service';
import { Vehicle } from '../../core/models/vehicle.model';

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
  ]
})
export class UpravljanjeRezervacijamaPage implements OnInit {
  rezervacije: any[] = [];
  isLoading = true;

  constructor(
    private reservationService: ReservationService,
    private dataService: DataService
  ) {
    addIcons({ calendarOutline, carOutline, personOutline });
  }

  ngOnInit() {
    this.ucitajSve();
  }

  ucitajSve() {
    this.isLoading = true;
    
    // 1. Prvo povlačimo sva vozila da bismo imali njihove nazive i slike
    this.dataService.getVehicles().subscribe(vozila => {
      
      // 2. Zatim povlačimo sve rezervacije
      this.reservationService.getAllReservations().subscribe(sveRezervacije => {
        
        // 3. Mapiramo (spajamo) podatke
        this.rezervacije = sveRezervacije.map(res => {
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

  // Ovu funkciju pozivaš na dugme u HTML-u
  zavrsiRezervaciju(id: string) {
    console.log('Završavam rezervaciju:', id);
    // Ovde bi išao poziv servisu za update statusa na "finished"
  }
} 