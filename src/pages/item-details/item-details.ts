import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { KanbandataProvider} from '../../providers/kanbandata/kanbandata';
import { BacklogItem, ItemStatus, Cat, ItemWeight, CatString } from '../../providers/kanbandata/kanbandataInterface';


@IonicPage()
@Component({
  selector: 'page-item-details',
  templateUrl: 'item-details.html',
})
export class ItemDetailsPage {

  selectedItem: BacklogItem; 
  category: Cat;


  constructor(public navCtrl: NavController, public myData: KanbandataProvider ,public navParams: NavParams) {
    this.selectedItem = navParams.get('item');
    console.log('Hi Item Detailspage (IDP)')
    console.log("IDP: ItemSelected " + this.selectedItem.title);
  }

  ionViewDidLoad() {
    console.log('IDP: ionViewDidLoad ItemDetailsPage');
  }

  saveClicked() {
    console.log('IDP: saveClicked');
    this.myData.saveKanbanItem (this.selectedItem);
    this.navCtrl.pop(); //Zurück zur liste
  }

  abortClicked() {
    console.log('IDP: abortClicked');
    this.navCtrl.pop(); //Zurück zur liste
  }
}
