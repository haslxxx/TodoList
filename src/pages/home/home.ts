import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
//Data
import { KanbandataProvider } from '../../providers/kanbandata/kanbandata';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  userDoc: any;

//  constructor(public navCtrl: NavController, public myData: KanbandataProvider, private myFb: FirebaseProvider) { // Kapitalabsturz !
//constructor(public navCtrl: NavController, public myData: KanbandataProvider, public myFs: AngularFirestore) { // Kapitalabsturz !
constructor(public navCtrl: NavController, public myData: KanbandataProvider) {
      // ACHTUNG:  Das HIER der KanbanProvider im aufruf geholt wird erwirkt günstigerweise, daß die daten schon bereit sind wenn 
    // der user die listen Backlog oder ToDo anwählt

    //this.userDoc = myFb.getFirebaseDoc();
    //debugger;
  }

}
