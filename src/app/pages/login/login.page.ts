import { Component } from '@angular/core';
import { IonicModule, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons'; // Važno za ikone u standalone
import { carSport, arrowForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class LoginPage {
  constructor(private router: Router, private menuCtrl: MenuController) {
    // Registracija ikona
    addIcons({ carSport, arrowForwardOutline });
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false); // Sakrij meni dok smo na login-u
  }

  onLogin() {
    // Prvo ga upalimo
  this.menuCtrl.enable(true, 'main-content'); // Dodajemo ID sadržaja ako ga imaš
  
  // Forsiramo da meni postane "svestan" da je slobodan
  this.menuCtrl.swipeGesture(true);

  // Navigacija
  this.router.navigate(['/folder/inbox']);
  }
}