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
  LoadingController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { CommonModule } from '@angular/common';
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
  homeOutline,
  homeSharp,
  peopleSharp,
  peopleOutline
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
    CommonModule,
  ],
})
export class AppComponent {
  public appPages = [
    { title: 'Početna', url: '/home', icon: 'home', onlyAdmin: false },
    { title: 'Moj profil', url: '/profile', icon: 'person', onlyAdmin: false },
    {
      title: 'Upravljanje nalozima',
      url: '/upravljanje-nalozima',
      icon: 'people',
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
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    public authService: AuthService,
    private loadingCtrl: LoadingController,
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
      homeOutline,
      homeSharp,
      peopleSharp,
      peopleOutline
    });
  }

  ngOnInit() {
    // Isključuje swipe za otvaranje menija u celoj aplikaciji
    this.menuCtrl.swipeGesture(false);
  }

  // Funkcija za odjavu
  async logout() {
    const loading = await this.loadingCtrl.create({
      message: 'Odjavljivanje...',
      duration: 800, // Kratak duration kao fallback
      spinner: 'circles',
      cssClass: 'custom-loading'
    });
    await loading.present();

    await this.menuCtrl.close();
    await this.menuCtrl.enable(false);

    this.authService.logout();

    setTimeout(async () => {
      await loading.dismiss();
      this.router.navigate(['/login'], { replaceUrl: true });
    }, 500);
  }

  shouldShowPage(page: any) {
    if (!page.onlyAdmin) return true; // Ako nije admin-only, svi vide
    return this.authService.isAdmin(); // Ako jeste, vidi samo admin
  }
}
