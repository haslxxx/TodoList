import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ToDoListPage } from '../pages/to-do-list/to-do-list';
import { ItemDetailsPage } from '../pages/item-details/item-details';

//Daten
import { IonicStorageModule } from '@ionic/storage'; //STORAGE hält die daten lokal, die mit firestore synchronisiert werden
import { KanbandataProvider } from '../providers/kanbandata/kanbandata';

import { ScreenOrientation } from '@ionic-native/screen-orientation';

//import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    ItemDetailsPage,
    ToDoListPage
  ],
  imports: [
    BrowserModule,
    //CommonModule,  //ngIf etc   ... nutzt aber nix :-(
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()  //STORAGE
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    ToDoListPage,
    ItemDetailsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ScreenOrientation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    KanbandataProvider
  ]
})
export class AppModule {}
