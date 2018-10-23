import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler, NavController } from 'ionic-angular';
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
import { KanbandataProvider, CatString } from '../providers/kanbandata/kanbandata';

import { ScreenOrientation } from '@ionic-native/screen-orientation';

// Goo Daten
import { FirestorePage } from '../pages/firestore/firestore';
 
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule, AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { FirebaseProvider } from '../providers/firebase/firebase';

// Initialize Firebase  (Inhalte aus der FB konfig auf der FB seite kopiert   ...  die zugangsdaten zum Goo service über MEINEN account dort)
export  const firebaseConfig = {
  apiKey: "AIzaSyD2PfRu3hoXryEEvPEYw7VLr5o-0n9XHos",
  authDomain: "kanbantodo.firebaseapp.com",
  databaseURL: "https://kanbantodo.firebaseio.com",
  projectId: "kanbantodo",
  storageBucket: "kanbantodo.appspot.com",
  messagingSenderId: "911378615179"
};



@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    ItemDetailsPage,
    ToDoListPage,
    FirestorePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(), //STORAGE
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule 
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    ToDoListPage,
    ItemDetailsPage,
    FirestorePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ScreenOrientation,
    AngularFireDatabase,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    KanbandataProvider,
    FirebaseProvider,
    AngularFirestore,
    CatString

  ]
})
export class AppModule {}
