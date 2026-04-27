import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router'; // Dodat Router
import { 
  IonApp, IonSplitPane, IonMenu, IonContent, IonList, 
  IonListHeader, IonNote, IonMenuToggle, IonItem, 
  IonIcon, IonLabel, IonRouterOutlet, IonRouterLink,
  MenuController // Dodat MenuController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, 
  heartOutline, heartSharp, archiveOutline, archiveSharp, 
  trashOutline, trashSharp, warningOutline, warningSharp, 
  bookmarkOutline, bookmarkSharp, logOutOutline, logOutSharp // Dodat logOut
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [
    RouterLink, RouterLinkActive, IonApp, IonSplitPane, 
    IonMenu, IonContent, IonList, IonListHeader, IonNote, 
    IonMenuToggle, IonItem, IonIcon, IonLabel, 
    IonRouterLink, IonRouterOutlet
  ],
})
export class AppComponent {
  public appPages = [
    { title: 'Inbox', url: '/folder/inbox', icon: 'mail' },
    { title: 'Outbox', url: '/folder/outbox', icon: 'paper-plane' },
    { title: 'Favorites', url: '/folder/favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/trash', icon: 'trash' },
    { title: 'Spam', url: '/folder/spam', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  // Dodajemo servise u constructor
  constructor(private router: Router, private menuCtrl: MenuController) {
    addIcons({ 
      mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, 
      heartOutline, heartSharp, archiveOutline, archiveSharp, 
      trashOutline, trashSharp, warningOutline, warningSharp, 
      bookmarkOutline, bookmarkSharp, logOutOutline, logOutSharp 
    });
  }

  ngOnInit() {
    // Isključuje swipe za otvaranje menija u celoj aplikaciji
    this.menuCtrl.swipeGesture(false);
  }

  // Funkcija za odjavu
  logout() {
    this.router.navigate(['/login']); // Prebaci na login
  }
}