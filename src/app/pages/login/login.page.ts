import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonItem, IonInput,
  IonButton, IonIcon, MenuController,
  IonInputPasswordToggle, LoadingController
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
    private menuCtrl: MenuController,
    private loadingCtrl: LoadingController
  ) {
    addIcons({ logInOutline, carSport, arrowForwardOutline, atOutline, lockClosedOutline });
  }

  ngOnInit() {
    // Ako je neko već ulogovan, odmah ga baci na početnu
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  async onLogin() {
  if (!this.username || !this.password) {
    alert('Unesite korisničko ime i lozinku.');
    return;
  }

  // Kreiramo loading indikator
  const loading = await this.loadingCtrl.create({
    message: 'Prijava u toku...',
    spinner: 'circles',
    cssClass: 'custom-loading' // Opciono za dodatni stil
  });
  
  // Prikaži loading
  await loading.present();

  this.dataService.getUserByUsername(this.username).subscribe({
    next: async (user) => {
      if (user) {
        if (user.password === this.password) {
          console.log('Login uspešan!', user.id);

          this.authService.setCurrentUser(user);
          this.username = '';
          this.password = '';
          this.menuCtrl.enable(true);

          // Mali delay da bi tranzicija bila smooth
          setTimeout(async () => {
            await loading.dismiss();
            this.router.navigate(['/home'], { replaceUrl: true });
          }, 600);

        } else {
          await loading.dismiss();
          alert('Pogrešna lozinka!');
        }
      } else {
        await loading.dismiss();
        alert('Korisnik sa tim imenom ne postoji.');
      }
    },
    error: async (err) => {
      console.error('Greška pri loginu:', err);
      await loading.dismiss();
      alert('Problem sa konekcijom.');
    }
  });
}
}