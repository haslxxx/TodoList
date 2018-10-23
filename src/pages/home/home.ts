import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
//Data
import { KanbandataProvider } from '../../providers/kanbandata/kanbandata';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public myData: KanbandataProvider) {
      // ACHTUNG:  Das HIER der KanbanProvider im aufruf geholt wird erwirkt günstigerweise, daß die daten schon bereit sind wenn 
    // der user die listen Backlog oder ToDo anwählt

    this.myData.subscribeFirestoreCollection(); //An Goo firestore "andocken" .. der rest passiert im callback in
  }

}
