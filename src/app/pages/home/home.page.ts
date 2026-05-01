import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, 
  IonContent, IonSearchbar, IonGrid, IonRow, IonCol, IonCard, 
  IonCardTitle, IonCardSubtitle, IonCardContent, 
  IonButton, IonIcon, IonBadge, IonModal, IonItem, IonLabel, 
  IonDatetime, IonInput, IonList, IonRange, IonSelect, IonSelectOption,
  IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  optionsOutline, leafOutline, calendarOutline, 
  personOutline, informationCircleOutline, searchOutline,
  cashOutline, speedometerOutline, carOutline, peopleOutline,
  chevronDownOutline
} from 'ionicons/icons';
import { Subscription } from 'rxjs';
import { Vehicle } from '../../core/models/vehicle.model';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonHeader, IonToolbar, IonButtons, 
    IonMenuButton, IonTitle, IonContent, IonSearchbar, IonGrid, 
    IonRow, IonCol, IonCard, IonCardTitle, 
    IonCardSubtitle, IonCardContent, IonButton, IonIcon, IonBadge, 
    IonModal, IonItem, IonLabel, IonDatetime, IonInput, IonList, 
    IonRange, IonSelect, IonSelectOption, IonSpinner
  ]
})
export class HomePage implements OnInit, OnDestroy {

  // Podaci
  allVehicles: Vehicle[] = []; // Svi podaci sa Firebase-a
  vozila: Vehicle[] = [];      // Ono što korisnik vidi (filtrirano)
  
  // Stanja
  isLoading = false;
  private vehicleSub?: Subscription;

  // Modali
  isModalOpen = false;
  isInfoModalOpen = false;
  isFilterModalOpen = false;

  // Objekti za selekciju i filtere
  selectedAuto: Vehicle | null = null;
  brojDana: number = 1;
  datumPreuzimanja: string = new Date().toISOString();

  filters = {
    maxPrice: 150,
    minPower: 60,
    fuel: 'Sva',
    category: 'Sve',
    transmission: 'Svi',
    seats: 0
  };

  constructor(private dataService: DataService) {
    addIcons({ 
      optionsOutline, leafOutline, calendarOutline, 
      personOutline, informationCircleOutline, searchOutline,
      cashOutline, speedometerOutline, carOutline, peopleOutline,
      chevronDownOutline
    });
  }

  ngOnInit() {
    this.ucitajVozila();
  }

  ngOnDestroy() {
    if (this.vehicleSub) {
      this.vehicleSub.unsubscribe();
    }
  }

  ucitajVozila() {
    this.isLoading = true;
    this.vehicleSub = this.dataService.getVehicles().subscribe({
      next: (data) => {
        this.allVehicles = data;
        this.vozila = [...this.allVehicles];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Greška pri dohvatanju podataka:', err);
        this.isLoading = false;
      }
    });
  }

  // --- FILTERI I PRETRAGA ---

  applyFilters() {
    this.vozila = this.allVehicles.filter(auto => {
      const matchPrice = auto.pricePerDay <= this.filters.maxPrice;
      const matchPower = auto.enginePower >= this.filters.minPower;
      const matchFuel = this.filters.fuel === 'Sva' || auto.fuel === this.filters.fuel;
      const matchCategory = this.filters.category === 'Sve' || auto.category === this.filters.category;
      const matchTrans = this.filters.transmission === 'Svi' || auto.transmission === this.filters.transmission;
      const matchSeats = this.filters.seats === 0 || auto.seats === this.filters.seats;
      
      return matchPrice && matchPower && matchFuel && matchCategory && matchTrans && matchSeats;
    });
    this.isFilterModalOpen = false;
  }

  resetFilters() {
    this.filters = {
      maxPrice: 150,
      minPower: 60,
      fuel: 'Sva',
      category: 'Sve',
      transmission: 'Svi',
      seats: 0
    };
    this.vozila = [...this.allVehicles];
    // Napomena: Modal ostaje otvoren po tvom zahtevu
  }

  onSearch(event: any) {
    const query = event.target.value?.toLowerCase();
    if (!query) {
      this.applyFilters();
      return;
    }
    
    this.vozila = this.allVehicles.filter(auto => 
      auto.brand.toLowerCase().includes(query) || 
      auto.model.toLowerCase().includes(query) ||
      auto.category.toLowerCase().includes(query)
    );
  }

  // --- RAD SA MODALIMA ---

  prikaziDetalje(auto: Vehicle) {
    this.selectedAuto = { ...auto };
    this.isInfoModalOpen = true;
  }

  zatvoriInfo() {
    this.isInfoModalOpen = false;
  }

  otvoriRezervaciju(auto: Vehicle) {
    this.selectedAuto = { ...auto };
    this.isModalOpen = true;
  }

  zatvoriModal() {
    this.isModalOpen = false;
    this.brojDana = 1;
  }

  potvrdiRezervaciju() {
    if (this.selectedAuto) {
      console.log('Rezervacija potvrđena za:', this.selectedAuto.brand);
      // Ovde bi kasnije išao poziv servisu za čuvanje rezervacije
      this.isModalOpen = false;
    }
  }
}