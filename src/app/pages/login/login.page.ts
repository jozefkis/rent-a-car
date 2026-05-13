import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  MenuController,
  IonInputPasswordToggle,
  LoadingController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  logInOutline,
  carSport,
  arrowForwardOutline,
  atOutline,
  lockClosedOutline,
} from 'ionicons/icons';
import { firstValueFrom } from 'rxjs';

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
  ],
})
export class LoginPage implements OnInit {
  username = '';
  password = '';

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router,
    private menuCtrl: MenuController,
    private loadingCtrl: LoadingController,
  ) {
    addIcons({
      logInOutline,
      carSport,
      arrowForwardOutline,
      atOutline,
      lockClosedOutline,
    });
  }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  async onLogin() {
    if (!this.username || !this.password) {
      alert('Unesite korisničko ime i lozinku.');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Prijava u toku...',
      spinner: 'circles',
      cssClass: 'custom-loading',
    });

    await loading.present();

    try {
      // 1. POZIV FIREBASE AUTH
      const virtualEmail = `${this.username}@gmail.com`;
      const authRes = await firstValueFrom(
        this.authService.logIn(virtualEmail, this.password),
      );

      /* KLJUČNA PROMENA: 
       Moramo ODMAH da sačuvamo token u AuthService.
       Čim ovo uradimo, DataService.getTokenQuery() će početi da vraća ispravan ?auth=...
    */
      this.authService.setTokenOnly(authRes.idToken);

      // 2. SADA POVLAČIMO PODATKE IZ BAZE (jer sada imamo token u memoriji)
      const user = await firstValueFrom(
        this.dataService.getUserByUsername(this.username),
      );

      if (user) {
        console.log('Login uspešan!', user.id);

        // Sada setujemo kompletnog korisnika (podatke iz baze + token)
        this.authService.setCurrentUser(user, authRes.idToken);

        this.username = '';
        this.password = '';
        this.menuCtrl.enable(true);

        setTimeout(async () => {
          await loading.dismiss();
          this.router.navigate(['/home'], { replaceUrl: true });
        }, 600);
      } else {
        await loading.dismiss();
        alert('Korisnik ne postoji u bazi podataka.');
      }
    } catch (err: any) {
      console.error('Greška pri loginu:', err);
      await loading.dismiss();

      if (err.error?.error?.message === 'INVALID_LOGIN_CREDENTIALS') {
        alert('Pogrešno korisničko ime ili lozinka.');
      } else {
        alert('Problem sa konekcijom ili nepostojeći korisnik.');
      }
    }
  }
}
