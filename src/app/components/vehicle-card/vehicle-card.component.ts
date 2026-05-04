import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Vehicle } from '../../core/models/vehicle.model';

@Component({
  selector: 'app-vehicle-card',
  templateUrl: './vehicle-card.component.html',
  styleUrls: ['./vehicle-card.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class VehicleCardComponent {
  // Primamo auto iz roditeljske komponente
  @Input() auto!: Vehicle;

  // Šaljemo događaje nazad roditelju (HomePage)
  @Output() infoClick = new EventEmitter<Vehicle>();
  @Output() bookClick = new EventEmitter<Vehicle>();

  constructor() {}

  prikaziDetalje() {
    this.infoClick.emit(this.auto);
  }

  otvoriRezervaciju() {
    this.bookClick.emit(this.auto);
  }
}