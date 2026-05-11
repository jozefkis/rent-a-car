import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonItem, IonLabel, IonInput,
  IonButton, IonIcon, MenuController,
  IonInputPasswordToggle, IonHeader, IonToolbar,
  IonButtons, IonBackButton, IonTitle
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logInOutline, carSport, arrowForwardOutline, atOutline, lockClosedOutline } from 'ionicons/icons';

// Servisi i modeli
import { DataService } from '../../core/services/data.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonItem,
    IonInput,
    IonButton,
    IonIcon,
    IonInputPasswordToggle,
  ]
})
export class LoginPage implements OnInit {
  // Varijable za ngModel u HTML-u
  username = '';
  password = '';

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router,
    private menuCtrl: MenuController // Za uključivanje menija nakon logina
  ) {
    addIcons({ logInOutline, carSport, arrowForwardOutline, atOutline, lockClosedOutline });
  }

  ngOnInit() {
    // Ako je neko već ulogovan, odmah ga baci na početnu
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  onLogin() {
    if (!this.username || !this.password) {
      alert('Unesite korisničko ime i lozinku.');
      return;
    }

    // 1. Provera korisnika u bazi
    this.dataService.getUserByUsername(this.username).subscribe({
      next: (user) => {
        if (user) {
          // 2. Provera lozinke (u bazi je user.password)
          if (user.password === this.password) {
            console.log('Login uspešan!', user.id, user.firstName, user.lastName);

            // 3. Sačuvaj sesiju u AuthService
            this.authService.setCurrentUser(user);
            this.username = '';
            this.password = '';

            // 4. Omogući side menu i prebaci na glavnu stranu
            this.menuCtrl.enable(true);
            this.router.navigate(['/home']);
          } else {
            alert('Pogrešna lozinka!');
          }
        } else {
          alert('Korisnik sa tim imenom ne postoji.');
        }
      },
      error: (err) => {
        console.error('Greška pri loginu:', err);
        alert('Problem sa konekcijom.');
      }
    });
  }
}