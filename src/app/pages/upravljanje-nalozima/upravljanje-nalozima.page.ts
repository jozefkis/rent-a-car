import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton,
  IonList, IonItem, IonLabel, IonBadge, IonSpinner, IonButton, IonIcon, 
  IonModal, IonInput, IonSelect, IonSelectOption, IonItemSliding, 
  IonItemOptions, IonItemOption, AlertController 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, trash, create } from 'ionicons/icons';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-upravljanje-nalozima',
  templateUrl: './upravljanje-nalozima.page.html',
  styleUrls: ['./upravljanje-nalozima.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonContent, IonHeader, IonTitle, IonToolbar, 
    IonButtons, IonMenuButton, IonList, IonItem, IonLabel, IonBadge, 
    IonSpinner, IonButton, IonIcon, IonModal, IonInput, IonSelect, 
    IonSelectOption, IonItemSliding, IonItemOptions, IonItemOption
  ]
})
export class UpravljanjeNalozimaPage implements OnInit {

  users: any[] = [];
  isModalOpen = false;
  isEditMode = false;
  currentUserId: string | null = null;

  newUser: any = {
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    passportNumber: '',
    idCardNumber: '',
    role: 'customer'
  };

  constructor(private dbService: DataService, private alertCtrl: AlertController) {
    addIcons({ add, trash, create });
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.dbService.getUsers().subscribe({
      next: (data: any) => {
        // Sortiranje: Admini na vrh, pa abecedno po imenu
        this.users = data.sort((a: any, b: any) => {
          if (a.role === 'admin' && b.role !== 'admin') return -1;
          if (a.role !== 'admin' && b.role === 'admin') return 1;
          return a.firstName.localeCompare(b.firstName);
        });
      }
    });
  }

  openEdit(user: any) {
    this.isEditMode = true;
    this.currentUserId = user.id;
    this.newUser = { ...user };
    this.isModalOpen = true;
  }

  deleteUser(id: string) {
    this.dbService.deleteUser(id).subscribe(() => {
      this.loadUsers();
    });
  }

  async saveUser() {
    if (this.isEditMode && this.currentUserId) {
      this.dbService.updateUser(this.currentUserId, this.newUser).subscribe(() => {
        this.closeModal();
        this.loadUsers();
      });
    } else {
      this.dbService.addUser(this.newUser).subscribe(() => {
        this.closeModal();
        this.loadUsers();
      });
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.isEditMode = false;
    this.currentUserId = null;
    this.newUser = { firstName: '', lastName: '', username: '', password: '', passportNumber: '', idCardNumber: '', role: 'customer' };
  }
}