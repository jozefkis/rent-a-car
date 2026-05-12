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
  newUser: User = {
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    idCardNumber: '', 
    passportNumber: '', 
    role: 'customer', 
  };

  confirmPassword = '';

  constructor(
    private dataService: DataService,
    private router: Router,
  ) {
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

    if (this.newUser.password !== this.confirmPassword) {
      alert('Lozinke se ne podudaraju!');
      return;
    }

    this.dataService.getUserByUsername(this.newUser.username).subscribe({
      next: (existingUser) => {
        if (existingUser) {
          alert('Korisničko ime je već zauzeto. Izaberite drugo.');
        } else {
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
