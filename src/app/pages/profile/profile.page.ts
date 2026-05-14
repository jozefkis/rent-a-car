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
      documentTextSharp,
    });
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe((data) => {
      if (data) {
        this.user = data;
        this.tempUser = { ...data };
      }
    });
  }

  toggleEdit() {
    this.isEditMode = true;
    this.tempUser = { ...this.user };
  }

  cancelEdit() {
    this.isEditMode = false;
    this.tempUser = { ...this.user };
  }

  saveChanges() {
    if (!this.user.id) return;

    const currentUser = this.authService.getLoggedUser();
    const token = currentUser?.token;
    if (!token) return;

    // 1. Prvo REST API poziv za Auth (Email/PW)
    this.authService
      .updateCredentials(this.tempUser.username, this.tempUser.password)
      .subscribe({
        next: (authRes) => {
          // 2. Ako je Auth prošao, onda ide update u Realtime Database
          this.dataService.updateUser(this.user.id, this.tempUser).subscribe({
            next: (res) => {
              this.user = { ...this.tempUser, id: this.user.id };
              this.authService.setCurrentUser(
                this.user,
                authRes.idToken || token,
              );

              this.isEditMode = false;
              console.log('Profil i Auth uspešno ažurirani preko REST API-ja');
            },
            error: (err) => console.error('Baza nije ažurirana:', err),
          });
        },
        error: (err) => {
          console.error('REST API Auth greška:', err);
          if (err.error?.error?.message === 'CREDENTIAL_TOO_OLD_LOGIN_AGAIN') {
            alert('Morate se ponovo ulogovati da biste promenili ove podatke.');
          }
        },
      });
  }
}
