import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonBadge,
  IonModal,
  IonItem,
  IonLabel,
  IonInput,
  IonList,
  IonRange,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  optionsOutline,
  leafOutline,
  calendarOutline,
  personOutline,
  informationCircleOutline,
  searchOutline,
  cashOutline,
  speedometerOutline,
  carOutline,
  peopleOutline,
  chevronDownOutline,
  checkmarkCircleOutline,
} from 'ionicons/icons';
import { Subscription } from 'rxjs';

// NOVI IMPORTI ZA KALENDAR I DATUME
import {
  CalendarComponentOptions,
  IonRangeCalendarComponent,
} from '@googlproxer/ion-range-calendar';
import { differenceInDays, parseISO, startOfDay, subDays } from 'date-fns';

// Modeli i Servisi
import { Vehicle } from '../../core/models/vehicle.model';
import { Reservation } from '../../core/models/reservation.model';
import { DataService } from '../../core/services/data.service';
import { ReservationService } from '../../core/services/reservation.service';
import { DateUtils } from '../../utils/date.utils';
import { AuthService } from 'src/app/core/services/auth.service';
import { VehicleCardComponent } from '../../components/vehicle-card/vehicle-card.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonBadge,
    IonModal,
    IonItem,
    IonLabel,
    IonInput,
    IonList,
    IonRange,
    IonSelect,
    IonSelectOption,
    IonSpinner,
    IonRangeCalendarComponent,
    VehicleCardComponent
  ],
})
export class HomePage implements OnInit, OnDestroy {
  // Podaci o vozilima
  allVehicles: Vehicle[] = [];
  vozila: Vehicle[] = [];

  // Rezervacije i datumi
  occupiedDates: string[] = []; // Promenjeno u niz jer kalendar voli niz stringova
  today: Date = new Date();
  bookedIntervals: { start: Date; end: Date }[] = [];
  initialDisabledDates: any[] = [];

  // NOVO: Range selection podaci usklađeni sa tvojim novim kalendarom
  dateRange: { from: string; to: string } = { from: '', to: '' };
  type: 'string' = 'string';
  brojDana: number = 0;

  // Opcije za novi kalendar
  optionsRange: CalendarComponentOptions = {
    pickMode: 'range',
    from: subDays(new Date(), 1),
    weekStart: 1,
    color: 'primary',
    daysConfig: [], // Ovde ćemo puniti zauzete termine
  };

  // Stanja
  isLoading = false;
  private vehicleSub?: Subscription;

  // Modali
  isModalOpen = false;
  isInfoModalOpen = false;
  isFilterModalOpen = false;

  selectedAuto: Vehicle | null = null;

  filters = {
    maxPrice: 150,
    minPower: 60,
    fuel: 'Sva',
    category: 'Sve',
    transmission: 'Svi',
    seats: 0,
  };

  constructor(
    private dataService: DataService,
    private reservationService: ReservationService,
    private toastController: ToastController,
    private authService: AuthService,
  ) {
    addIcons({
      optionsOutline,
      leafOutline,
      calendarOutline,
      personOutline,
      informationCircleOutline,
      searchOutline,
      cashOutline,
      speedometerOutline,
      carOutline,
      peopleOutline,
      chevronDownOutline,
      checkmarkCircleOutline,
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
        console.error('Greška pri dohvatanju vozila:', err);
        this.isLoading = false;
      },
    });
  }

  // --- LOGIKA ZA KALENDAR ---

  onRangeChange() {
    if (!this.dateRange?.from || !this.dateRange?.to) return;

    const start = parseISO(this.dateRange.from);
    const end = parseISO(this.dateRange.to);

    const isValid = this.isRangeValid(start, end);

    if (!isValid) {
      // reset izbora
      this.dateRange = { from: '', to: '' };
      this.brojDana = 0;

      console.log('Nevalidan range');
      return;
    }

    this.brojDana = differenceInDays(end, start) + 1;
  }

  ucitajZauzeteTermine(vehicleId: string) {
    this.reservationService.getReservationsForVehicle(vehicleId).subscribe({
      next: (reservations) => {
        const disabledDates: any[] = [];

        this.bookedIntervals = reservations.map((res) => ({
          start: parseISO(res.startDate),
          end: parseISO(res.endDate),
        }));

        reservations.forEach((res) => {
          const range = DateUtils.getDatesInRange(res.startDate, res.endDate);
          range.forEach((dateString) => {
            disabledDates.push({
              date: parseISO(dateString),
              disable: true,
            });
          });
        });
        this.initialDisabledDates = disabledDates;

        this.optionsRange = {
          ...this.optionsRange,
          daysConfig: disabledDates,
        };
      },
    });
  }

  isRangeValid(start: Date, end: Date): boolean {
    return !this.bookedIntervals.some((interval) =>
      DateUtils.isOverlapping(start, end, interval.start, interval.end),
    );
  }

  // --- FILTERI I PRETRAGA (Ostalo isto kao tvoje) ---

  applyFilters() {
    this.vozila = this.allVehicles.filter((auto) => {
      const matchPrice = auto.pricePerDay <= this.filters.maxPrice;
      const matchPower = auto.enginePower >= this.filters.minPower;
      const matchFuel =
        this.filters.fuel === 'Sva' || auto.fuel === this.filters.fuel;
      const matchCategory =
        this.filters.category === 'Sve' ||
        auto.category === this.filters.category;
      const matchTrans =
        this.filters.transmission === 'Svi' ||
        auto.transmission === this.filters.transmission;
      const matchSeats =
        this.filters.seats === 0 || auto.seats === this.filters.seats;

      return (
        matchPrice &&
        matchPower &&
        matchFuel &&
        matchCategory &&
        matchTrans &&
        matchSeats
      );
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
      seats: 0,
    };
    this.vozila = [...this.allVehicles];
  }

  onSearch(event: any) {
    const query = event.target.value?.toLowerCase();
    if (!query) {
      this.applyFilters();
      return;
    }
    this.vozila = this.allVehicles.filter(
      (auto) =>
        auto.brand.toLowerCase().includes(query) ||
        auto.model.toLowerCase().includes(query) ||
        auto.category.toLocaleLowerCase().includes(query)
    );
  }

  // --- RAD SA MODALIMA ---

  prikaziDetalje(auto: Vehicle) {
    this.selectedAuto = { ...auto };
    this.isInfoModalOpen = true;
  }

  otvoriRezervaciju(auto: Vehicle) {
    this.selectedAuto = { ...auto };

    // 1. reset UI state
    this.dateRange = { from: '', to: '' };
    this.brojDana = 0;

    // 2. privremeno očisti kalendar da ne pokazuje stare podatke
    this.optionsRange = {
      ...this.optionsRange,
      daysConfig: [],
    };

    // 3. otvori modal ODMAH (UX da se vidi odmah)
    this.isModalOpen = true;

    // 4. učitaj zauzete termine za novo vozilo
    if (auto.id) {
      this.ucitajZauzeteTermine(auto.id);
    }
  }

  async potvrdiRezervaciju() {
    const loggedUser = this.authService.getLoggedUser();

    // 2. Provera da li je korisnik uopšte ulogovan
    if (!loggedUser || !loggedUser.id) {
      const toast = await this.toastController.create({
        message: 'Morate biti ulogovani da biste rezervisali vozilo!',
        duration: 3000,
        color: 'danger',
        position: 'top'
      });
      await toast.present();
      return;
    }

    // Provera pomoću novog dateRange objekta
    if (!this.selectedAuto || !this.selectedAuto.id || !this.dateRange.to)
      return;

    const novaRezervacija: Reservation = {
      userId: loggedUser.id,
      vehicleId: this.selectedAuto.id,
      startDate: this.dateRange.from,
      endDate: this.dateRange.to,
      pricePerDay: this.selectedAuto.pricePerDay,
      totalPrice: this.selectedAuto.pricePerDay * this.brojDana,
      status: 'active',
    };

    this.reservationService.createReservation(novaRezervacija).subscribe({
      next: async () => {
        const toast = await this.toastController.create({
          message: 'Uspešno ste rezervisali vozilo!',
          duration: 2000,
          color: 'success',
          position: 'top',
          icon: checkmarkCircleOutline,
        });
        await toast.present();
        this.isModalOpen = false;
      },
      error: (err) => console.error('Greška pri rezervaciji:', err),
    });
  }

  zatvoriModal() {
    this.isModalOpen = false;
    this.dateRange = { from: '', to: '' };
    this.brojDana = 0;
  }

  zatvoriInfo() {
    this.isInfoModalOpen = false;
  }
}
