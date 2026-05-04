import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { 
  IonContent, IonItem, IonLabel, IonInput, 
  IonButton, IonIcon, MenuController 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logInOutline, carSport, arrowForwardOutline } from 'ionicons/icons';

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
    IonContent, 
    IonItem, 
    IonLabel, 
    IonInput, 
    IonButton, 
    IonIcon
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
    addIcons({ logInOutline, carSport, arrowForwardOutline });
  }

  ngOnInit() {
    // Ako je neko već ulogovan, odmah ga baci na početnu
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/folder/inbox']);
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
            console.log('Login uspešan!', user);
            
            // 3. Sačuvaj sesiju u AuthService
            this.authService.setCurrentUser(user);
            
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