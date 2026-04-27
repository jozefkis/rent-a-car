import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-upravljanje-rezervacijama',
  templateUrl: './upravljanje-rezervacijama.page.html',
  styleUrls: ['./upravljanje-rezervacijama.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonMenuButton]
})
export class UpravljanjeRezervacijamaPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
