import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { KanbandataProvider,BacklogItem } from '../kanbandata/kanbandata';

/*
  Generated class for the FirebaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirebaseProvider {
  myData: KanbandataProvider;
  afs: AngularFirestore;

  private itemDoc: AngularFirestoreDocument<BacklogItem>;
  item: Observable<BacklogItem>;

  constructor(private afstore: AngularFirestore, public myKanban: KanbandataProvider) {
    this.myData = myKanban;
    this.afs = afstore;

    //VERSUCHE
    
  }

  getFirebaseDoc() {
    //return this.userDoc;
  }

  update(item: BacklogItem) {
    this.itemDoc.update(item);
  }

  getOneItem() { // EIGENTLICH !!!  müsste es subscripe xxitem heissen .. und braucht nur einmal zu laufen
    this.itemDoc = this.afs.doc<BacklogItem>('/mykanbanbacklog/0'); // txDsC754Q1sDuzczfFVz
    this.item = this.itemDoc.valueChanges();

    this.item.subscribe(result=>{
      console.log(result.title);  // DA sind nun endlich  die daten drin :-) 
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
    //debugger;
    var setDoc = this.afs.collection('mykanbanbacklog').doc(id).set(data);
  }



}
