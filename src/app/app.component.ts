import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {
  IonApp,
  IonSplitPane,
  IonMenu,
  IonContent,
  IonList,
  IonListHeader,
  IonNote,
  IonMenuToggle,
  IonItem,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonRouterLink,
  MenuController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  mailOutline,
  mailSharp,
  paperPlaneOutline,
  paperPlaneSharp,
  heartOutline,
  heartSharp,
  archiveOutline,
  archiveSharp,
  trashOutline,
  trashSharp,
  warningOutline,
  warningSharp,
  bookmarkOutline,
  bookmarkSharp,
  logOutOutline,
  logOutSharp,
  personOutline,
  personSharp,
  carOutline,
  carSharp,
  documentOutline,
  documentSharp,
} from 'ionicons/icons';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [
    RouterLink,
    RouterLinkActive,
    IonApp,
    IonSplitPane,
    IonMenu,
    IonContent,
    IonList,
    IonListHeader,
    IonNote,
    IonMenuToggle,
    IonItem,
    IonIcon,
    IonLabel,
    IonRouterLink,
    IonRouterOutlet,
  ],
})
export class AppComponent {
  public appPages = [
    {
      title: 'Upravljanje nalozima',
      url: '/upravljanje-nalozima',
      icon: 'person',
      onlyAdmin: true,
    },
    {
      title: 'Upravljanje vozilima',
      url: '/upravljanje-vozilima',
      icon: 'car',
      onlyAdmin: true,
    },
    {
      title: 'Upravljanje rezervacijama',
      url: '/upravljanje-rezervacijama',
      icon: 'document',
      onlyAdmin: true,
    },
    { title: 'Home', url: '/home', icon: 'home', onlyAdmin: false  },
    { title: 'Inbox', url: '/folder/inbox', icon: 'mail', onlyAdmin: false },
    { title: 'Outbox', url: '/folder/outbox', icon: 'paper-plane', onlyAdmin: false  },
    { title: 'Favorites', url: '/folder/favorites', icon: 'heart', onlyAdmin: false  },
    { title: 'Archived', url: '/folder/archived', icon: 'archive', onlyAdmin: false  },
    { title: 'Trash', url: '/folder/trash', icon: 'trash', onlyAdmin: false  },
    { title: 'Spam', url: '/folder/spam', icon: 'warning', onlyAdmin: false  },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  // Dodajemo servise u constructor
  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    private authService: AuthService,
  ) {
    addIcons({
      mailOutline,
      mailSharp,
      paperPlaneOutline,
      paperPlaneSharp,
      heartOutline,
      heartSharp,
      archiveOutline,
      archiveSharp,
      trashOutline,
      trashSharp,
      warningOutline,
      warningSharp,
      bookmarkOutline,
      bookmarkSharp,
      logOutOutline,
      logOutSharp,
      personOutline,
      personSharp,
      carOutline,
      carSharp,
      documentOutline,
      documentSharp,
    });
  }

  ngOnInit() {
    // Isključuje swipe za otvaranje menija u celoj aplikaciji
    this.menuCtrl.swipeGesture(false);
  }

  // Funkcija za odjavu
  logout() {
    this.authService.logout();
    this.menuCtrl.enable(false);
  }

  shouldShowPage(page: any) {
    if (!page.onlyAdmin) return true; // Ako nije admin-only, svi vide
    return this.authService.isAdmin(); // Ako jeste, vidi samo admin
  }
}
