import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-upravljanje-vozilima',
  templateUrl: './upravljanje-vozilima.page.html',
  styleUrls: ['./upravljanje-vozilima.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonMenuButton]
})
export class UpravljanjeVozilimaPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
