import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

//export interface Item { name: string; }
export interface ItemInterface { id: string;
                                 hubsi: number; }

import { KanbandataProvider, BacklogItem, ItemStatus } from '../../providers/kanbandata/kanbandata';

@Component({
  selector: 'app-root',
  templateUrl: 'firestore.html'
  /*
  template: `
    <div>
      {{ (item | async)?.name }}
    </div>
  `
  */
})


export class FirestorePage {
  myData: KanbandataProvider;
  afs: AngularFirestore;

  private itemDoc: AngularFirestoreDocument<ItemInterface>;
  item: Observable<ItemInterface>;

  constructor(private afstore: AngularFirestore, public myKanban: KanbandataProvider) {
    this.myData = myKanban;
    this.afs = afstore;

    //VERSUCHE
    this.getOneItem();
  }


  writeClicked() {
    //this.writeEmptyItem();
    this.myData.subscribeFirestoreItem(16); // the movie
    this.myData.subscribeFirestoreCollection();
  }

  update(item: ItemInterface) {
    this.itemDoc.update(item);
  }

  getOneItem() {
    this.itemDoc = this.afs.doc<ItemInterface>('/testdaten1/xdSmG0CcmVlWGEJrEaOP'); // txDsC754Q1sDuzczfFVz
    this.item = this.itemDoc.valueChanges();

    this.item.subscribe(result=>{
      console.log(result.hubsi);  // DA sind nun endlich  die daten drin :-) 
      // die definition was drin ist steckt im interface namens "Item" .. siehe export ganz oben !
    });    

  }

  writeEmptyItem(){
    // erste schreibversuche
    var data = this.myData.getEmptyItem();
    var setDoc = this.afs.collection('mykanbanbacklog').doc('0').set(data);
  }

  writeOneItem(itemToWrite: BacklogItem){
    // erste schreibversuche
    var data = itemToWrite;
    var id = String(data.id);
    debugger;
    var setDoc = this.afs.collection('mykanbanbacklog').doc(id).set(data);
  }



  tryThis() {
    //const collection: AngularFirestoreCollection<ItemInterface> = aft.collection('items')
  }
}
