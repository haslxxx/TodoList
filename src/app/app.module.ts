import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { BacklogPage } from '../pages/backlog/backlog';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ToDoListPage } from '../pages/to-do-list/to-do-list';
import { ItemDetailsPage } from '../pages/item-details/item-details';

//Daten
import { IonicStorageModule } from '@ionic/storage'; //STORAGE hält die daten lokal, die mit firestore synchronisiert werden
import {  CatString } from '../providers/kanbandata/kanbandataInterface';
import { KanbandataProvider} from '../providers/kanbandata/kanbandata';

import { ScreenOrientation } from '@ionic-native/screen-orientation';

// Goo Daten AngularFirestore !! NICHT angular2
import { AngularFireModule } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';

//Goo Authentication  !! NICHT angular2
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { TooltipsModule } from 'ionic-tooltips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Initialize Firebase  (Inhalte aus der FB konfig auf der FB seite kopiert   ...  die zugangsdaten zum Goo service über MEINEN account dort)
import { firebaseConfig } from '../assets/fireBaseConfig';



@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    BacklogPage,
    HomePage,
    TabsPage,
    ItemDetailsPage,
    ToDoListPage 
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(), //STORAGE
    AngularFireModule.initializeApp(firebaseConfig),
    TooltipsModule,
    BrowserAnimationsModule,
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    BacklogPage,
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
    KanbandataProvider,
    AngularFirestore,
    CatString, //Mühsame zurückverwandlung eines enum in einen text
   
  ]
})
export class AppModule {}
