// IST EIGENTLICH DIE BACKLOG LISTE ... obwohl sie noch "Contacts" heisst!!!

import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ItemDetailsPage } from '../item-details/item-details';

//Data
import { KanbandataProvider, BacklogItem } from '../../providers/kanbandata/kanbandata';

import { ScreenOrientation } from '@ionic-native/screen-orientation';


@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  selectedItem: any;
  items: Array <BacklogItem>;
  newItem: BacklogItem;

  screenStyle = "landscape";

  constructor(public navCtrl: NavController, public myData: KanbandataProvider ,private screenOrientation: ScreenOrientation) {
    // --- initial SCREEN Orientation
    this.setScreenstyle();
    // detect orientation changes
    this.screenOrientation
      .onChange()
      .subscribe( 
          () => {
            this.setScreenstyle(); 
          // TODO  Hier wird alles aufgerufen was durch eine neuorientierung geändert werden muss
          }  
    );


    // --- Init List Data
    // this.items = this.myData.getKanbanList();  .. nützt nix ... daten noch nicht da wenn liste angezeigt wird :-(


  }

  //############### LIFECYCLE callbacks  systemcallback von IONIC!
  ionViewWillEnter() { 
    console.log("Entering Backlog ListView");
    // --- Fetch Data
    this.items = this.myData.getKanbanList();

  }

  ionViewWillLeave() {
//    this.storage.set('sortoption', this.sortOption); //gewählte sortieroption speichern
  }

  ionViewDidLoad () {

  }

  //################# Orientation
  setScreenstyle() {
    if (this.screenOrientation.type.startsWith('landscape')) {
      this.screenStyle = "landscape";
    } else {
      this.screenStyle = "portrait"; 
    };
    console.log("Orientation Changed: " + this.screenStyle);
  }
  

  //################# View - Events
  itemSelectForTodo(item) {
    console.log("Entering itemSelectForTodo");
  }

  itemEdit(theItem) {
    console.log("Entering itemEdit: " + theItem.title + "  "  + theItem.id);
    this.navCtrl.push(ItemDetailsPage , {
      item: theItem
    });
  }

  itemDelete(item) {
    console.log("Entering itemDelete");
  }

  newClicked() {
    console.log("Entering newClicked");
    this.newItem = this.myData.getEmptyItem();
    this.newItem.title = "Please Enter New Item";

    this.navCtrl.push(ItemDetailsPage, {
      item: this.newItem
    });
  }
/*
  itemSelected(event, item) {
    console.log("Entering itemSelected");
  }
*/



}
