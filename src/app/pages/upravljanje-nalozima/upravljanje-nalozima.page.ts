import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton} from '@ionic/angular/standalone';

@Component({
  selector: 'app-upravljanje-nalozima',
  templateUrl: './upravljanje-nalozima.page.html',
  styleUrls: ['./upravljanje-nalozima.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonMenuButton]
})
export class UpravljanjeNalozimaPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
