import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonIcon,
  IonButton,
  IonButtons,
  IonMenuButton,
  IonCard,
  IonInputPasswordToggle,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personOutline,
  atOutline,
  lockClosedOutline,
  cardOutline,
  airplaneOutline,
  createOutline,
  saveOutline,
  closeOutline,
  documentText,
  documentTextOutline,
  documentTextSharp,
} from 'ionicons/icons';
import { AuthService } from 'src/app/core/services/auth.service';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonInput,
    IonIcon,
    IonButton,
    IonButtons,
    IonMenuButton,
    IonCard,
    IonInputPasswordToggle,
  ],
})
export class ProfilePage implements OnInit {
  user: any = {}; // Originalni podaci iz baze
  tempUser: any = {}; // Kopija za izmenu
  isEditMode: boolean = false;

  constructor(
    private authService: AuthService,
    private dataService: DataService,
  ) {
    addIcons({
      personOutline,
      atOutline,
      lockClosedOutline,
      cardOutline,
      airplaneOutline,
      createOutline,
      saveOutline,
      closeOutline,
      documentText,
      documentTextOutline,
      documentTextSharp
    });
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe((data) => {
      if (data) {
        this.user = data;
        this.tempUser = { ...data }; // Inicijalna kopija
      }
    });
  }

  toggleEdit() {
    this.isEditMode = true;
    this.tempUser = { ...this.user }; // Resetujemo kopiju na trenutno stanje baze pre izmene
  }

  cancelEdit() {
    this.isEditMode = false;
    this.tempUser = { ...this.user }; // Odbacujemo sve što je kucano
  }

  async saveChanges() {
    if (!this.user.id) {
      console.error('ID korisnika nije pronađen!');
      return;
    }

    this.dataService.updateUser(this.user.id, this.tempUser).subscribe({
      next: (res) => {
        // Kada baza potvrdi, tek tada sinhronizujemo lokalno stanje
        this.user = { ...this.tempUser };
        this.authService.setCurrentUser(this.user);
        this.isEditMode = false;
        console.log('Profil je uspešno ažuriran u Firebase-u');
      },
      error: (err) => {
        console.error('Greška pri upisu u bazu:', err);
      },
    });
  }
}
