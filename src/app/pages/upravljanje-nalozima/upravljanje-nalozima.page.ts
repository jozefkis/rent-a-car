import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton,
  IonList, IonItem, IonLabel, IonBadge, IonSpinner, IonButton, IonIcon, 
  IonModal, IonInput, IonSelect, IonSelectOption 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-upravljanje-nalozima',
  templateUrl: './upravljanje-nalozima.page.html',
  styleUrls: ['./upravljanje-nalozima.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonContent, IonHeader, IonTitle, IonToolbar, 
    IonButtons, IonMenuButton, IonList, IonItem, IonLabel, IonBadge, 
    IonSpinner, IonButton, IonIcon, IonModal, IonInput, IonSelect, IonSelectOption
  ]
})
export class UpravljanjeNalozimaPage implements OnInit {

  users: any[] = [];
  isModalOpen = false;

  newUser = {
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    passportNumber: '',
    idCardNumber: '',
    role: 'customer'
  };

  constructor(private dbService: DataService) {
    addIcons({ add });
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.dbService.getUsers().subscribe((data: any) => {
      this.users = data;
    });
  }

  saveUser() {
      this.dbService.addUser(this.newUser as any).subscribe(() => {
      this.isModalOpen = false;
      this.loadUsers();
      this.newUser = { 
        firstName: '', lastName: '', username: '', password: '', 
        passportNumber: '', idCardNumber: '', role: 'customer' 
      };
    });
  }
}