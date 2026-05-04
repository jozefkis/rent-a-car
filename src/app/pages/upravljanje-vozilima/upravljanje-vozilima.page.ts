import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton,
  IonList, IonItem, IonLabel, IonBadge, IonButton, IonIcon, IonModal, 
  IonInput, IonSelect, IonSelectOption, IonItemSliding, IonItemOptions, 
  IonItemOption, IonCheckbox, IonThumbnail
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, trash, create } from 'ionicons/icons';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-upravljanje-vozilima',
  templateUrl: './upravljanje-vozilima.page.html',
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonContent, IonHeader, IonTitle, IonToolbar, 
    IonButtons, IonMenuButton, IonList, IonItem, IonLabel, IonBadge, 
    IonButton, IonIcon, IonModal, IonInput, IonSelect, IonSelectOption, 
    IonItemSliding, IonItemOptions, IonItemOption, IonCheckbox, IonThumbnail
  ]
})
export class UpravljanjeVozilimaPage implements OnInit {
  vehicles: any[] = [];
  isModalOpen = false;
  isEditMode = false;
  currentVehicleId: string | null = null;

  newVehicle: any = {
    brand: '',
    model: '',
    year: 2026,
    enginePower: 0,
    transmission: 'manual',
    seats: 5,
    doors: 5,
    fuel: '',
    category: 'Economy',
    pricePerDay: 0,
    imageUrl: '',
    isAvailable: true
  };

  constructor(private dbService: DataService) {
    addIcons({ add, trash, create });
  }

  ngOnInit() {
    this.loadVehicles();
  }

  loadVehicles() {
    // Ovde koristiš metodu iz servisa koja povlači /vehicle čvor
    this.dbService.getVehicles().subscribe((data: any) => {
      this.vehicles = data;
    });
  }

  openEdit(vehicle: any) {
    this.isEditMode = true;
    this.currentVehicleId = vehicle.id;
    this.newVehicle = { ...vehicle };
    this.isModalOpen = true;
  }

  deleteVehicle(id: string) {
    this.dbService.deleteVehicle(id).subscribe(() => this.loadVehicles());
  }

  saveVehicle() {
    if (this.isEditMode && this.currentVehicleId) {
      this.dbService.updateVehicle(this.currentVehicleId, this.newVehicle).subscribe(() => {
        this.closeModal();
        this.loadVehicles();
      });
    } else {
      this.dbService.addVehicle(this.newVehicle).subscribe(() => {
        this.closeModal();
        this.loadVehicles();
      });
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.isEditMode = false;
    this.currentVehicleId = null;
    this.newVehicle = { brand: '', model: '', year: 2024, transmission: 'manual', category: 'Economy', imageUrl: '',isAvailable: true };
  }
}