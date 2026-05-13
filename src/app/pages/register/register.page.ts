import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
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
import { AuthService } from 'src/app/core/services/auth.service';

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
    private router: Router, private authService: AuthService
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

  

async onRegister() {
  // 1. Osnovna validacija
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

  // 2. Kreiramo virtuelni email za Firebase Auth
  const virtualEmail = `${this.newUser.username}@gmail.com`;

  try {
    // 3. Provera da li korisnik već postoji u tvojoj bazi
    // const existingUser = await firstValueFrom(this.dataService.getUserByUsername(this.newUser.username));
    
    // if (existingUser) {
    //   alert('Korisničko ime je već zauzeto.');
    //   return;
    // }

    // 4. KORAK 1: Registracija u Firebase Authentication (REST API)
    // Ovo kreira nalog u Auth tabu konzole
    await firstValueFrom(this.authService.register(virtualEmail, this.newUser.password));

    // 5. KORAK 2: Upisivanje detaljnih podataka u Realtime bazu
    // Dodajemo podrazumevanu ulogu ako je nemaš
    this.newUser.role = 'customer'; 
    
    await firstValueFrom(this.dataService.addUser(this.newUser));

    // 6. Uspeh!
    alert('Uspešno ste se registrovali!');
    this.router.navigate(['/login']);

  } catch (err: any) {
    console.error('Greška pri registraciji:', err);
    
    // Provera specifične greške ako email već postoji u Auth tabu
    if (err.error && err.error.error && err.error.error.message === 'EMAIL_EXISTS') {
      alert('Ovaj korisnik je već registrovan u sistemu.');
    } else {
      alert('Došlo je do greške prilikom registracije. Pokušajte ponovo.');
    }
  }
}
}
