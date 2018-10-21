import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//ENUMS
import { KanbandataProvider, BacklogItem, Cat } from '../../providers/kanbandata/kanbandata';
import { FirebaseProvider } from '../../providers/firebase/firebase';


/**
 * Generated class for the ItemDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-item-details',
  templateUrl: 'item-details.html',
})
export class ItemDetailsPage {

  selectedItem: BacklogItem; 
  category: Cat;


  constructor(public navCtrl: NavController, public myData: KanbandataProvider, public fbp: FirebaseProvider ,public navParams: NavParams) {
    this.selectedItem = navParams.get('item');
    console.log("ItemSelected " + this.selectedItem.title);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ItemDetailsPage');
  }

  saveClicked() {
    console.log('ItemDetails saveClicked');
    this.myData.saveKanbanItem (this.selectedItem);
    
    // ########################  firestore versuch
    // hier könnte man eine methode aus firebaseprovider aufrufen ... aber schön isses nicht
    this.fbp.writeOneItem(this.selectedItem);

    this.navCtrl.pop(); //Zurück zur liste
  }

  abortClicked() {
    console.log('ItemDetails abortClicked');
    this.navCtrl.pop(); //Zurück zur liste
  }
}
