import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonInput,
  IonInputPasswordToggle,
  IonButton,
  IonIcon,
  IonButtons,
  IonBackButton,
  IonCard
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personOutline,
  cardOutline,
  documentTextOutline,
  atOutline,
  lockClosedOutline,
  checkmarkCircleOutline,
} from 'ionicons/icons';

// Servisi i modeli
import { DataService } from '../../core/services/data.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonInput,
    IonInputPasswordToggle,
    IonButton,
    IonIcon,
    IonButtons,
    IonBackButton,
    IonCard
  ],
})
export class RegisterPage implements OnInit {
  // Objekat koji šaljemo u bazu
  newUser: User = {
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    idCardNumber: '', // Broj lične karte
    passportNumber: '', // Broj pasoša
    role: 'customer', // Automatski dodeljena uloga
  };

  confirmPassword = '';

  constructor(
    private dataService: DataService,
    private router: Router,
  ) {
    // Registracija ikonica koje koristimo u HTML-u
    addIcons({
      personOutline,
      cardOutline,
      documentTextOutline,
      atOutline,
      lockClosedOutline,
      checkmarkCircleOutline,
    });
  }

  ngOnInit() {}

  onRegister() {
    // 1. Provera da li su sva polja popunjena
    if (
      !this.newUser.firstName ||
      !this.newUser.lastName ||
      !this.newUser.username ||
      !this.newUser.password ||
      !this.newUser.idCardNumber ||
      !this.newUser.passportNumber
    ) {
      alert('Molimo vas da popunite sva polja.');
      return;
    }

    // 2. Provera da li se lozinke podudaraju
    if (this.newUser.password !== this.confirmPassword) {
      alert('Lozinke se ne podudaraju!');
      return;
    }

    // 3. Provera da li korisničko ime već postoji
    this.dataService.getUserByUsername(this.newUser.username).subscribe({
      next: (existingUser) => {
        if (existingUser) {
          alert('Korisničko ime je već zauzeto. Izaberite drugo.');
        } else {
          // 4. Ako je sve u redu, šaljemo podatke servisu
          this.dataService.addUser(this.newUser).subscribe({
            next: () => {
              alert('Uspešno ste se registrovali!');
              this.router.navigate(['/login']);
            },
            error: (err) => {
              console.error('Greška pri registraciji:', err);
              alert('Došlo je do greške prilikom registracije.');
            },
          });
        }
      },
      error: (err) => {
        console.error('Greška pri proveri korisnika:', err);
        alert('Problem sa konekcijom.');
      },
    });
  }
}
