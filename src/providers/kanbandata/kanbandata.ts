/*
Hier werden die daten bereitgestellt.
1.) Mockdaten für den anfang
2.) Lokales storage, damit eine unabhängigkeit von Goo gleibt
3.) Sync mit goo  firestore
*/

import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';   //STORAGE
import { Subject } from 'rxjs/Subject';

import  _ from 'underscore';                //_.findWhere  etc.

// 3.)
import { AngularFirestore,  AngularFirestoreCollection } from '@angular/fire/firestore';
//import { Observable } from 'rxjs';

import { ToastController, ToastOptions } from 'ionic-angular';
import { BacklogItem, ItemStatus, Cat, ItemWeight } from './kanbandataInterface';
import { MockItems } from './mockBacklogItems';


@Injectable()
export class KanbandataProvider {

  mockData = new MockItems;
  backlogItems: Array<BacklogItem>; // HIER sind alle LOKALEN Daten
  // 2.)
  //myStorage:Storage;
  // 3.)  
  //afs: AngularFirestore;
  itemsCollection: AngularFirestoreCollection<BacklogItem> ;
  //items: Observable<BacklogItem[]>;

  toastOptions: ToastOptions;
  fsPushInitiated: number = 1; // Wird mit jeder schreibaktion auf FS incrementiert, mit jedem aufruf des promise decrementiert
  // so werden alle eigeninitiierten toasts verhindert

//##################  SUBJECT
  dataSubject;

  constructor(
    public myStorage: Storage, 
    public afs: AngularFirestore,
    private toast: ToastController
    ) {

      console.log('Hi KanbandataProvider Provider (KBD)');
      // 1.)
      //this.makeListBacklogMock();  // Zuerst mit Mockdata arbeiten
      // 2.)
      //this.myStorage = storage; //Storageobjekt speichern
      this.restoreItems();

      // 3.)
      //this.afs = afstore; //firestore objekt speichern
      this.itemsCollection  = this.afs.collection('mykanbanbacklog'); // Name der collection = wurzel der daten

      this.toastOptions = {
        message: 'Externe Datenänderung !',
        duration: 5000,
        showCloseButton: true,
        closeButtonText: 'Close'
      }
//##################  SUBJECT
      this.dataSubject  = new Subject();  // Observable
  }

  getKanbanList() {
    console.log('KBD:  getKanbanList');
//    return this.backlogItems;  ++++++++++++++++++++++++++++++++++++++
    this.dataSubject.next(this.backlogItems);
  }

  // 2.) ############## Local STORAGE 
  restoreItems() {
    //this.downloadReady = false;
    this.myStorage.length().then((val) => { 
      console.log("KBD: StorageLength");
      console.log(val);    
      if (val == 0)  { //Keine einträge --> neu anlegen  
        console.log("KBD: Empty List !!)");
        this.myStorage.set('kanbantodo', this.mockData.getMockBacklogItems); // Wenn leer dann mit Dummydaten füllen
      } else {
        this.myStorage.get('kanbantodo').then((val1) => { //key value pair holen 
          if (val1 == null) { //Keine einträge --> neu anlegen 
            console.log("KBD: No Kanban data");
            this.myStorage.set('kanbantodo', this.mockData.getMockBacklogItems); // Wenn leer dann mit Dummydaten füllen
          } else {
            console.log("KBD: Found Local Kanban data"); // HURRA Daten sind vorhanden
            // Daten vom LOCAL STORAGE nach priorität sortiert ins lokale ARRAY kopieren
            this.updateBacklogItems(val1);
            
          } 
        });   
      };
    });  

    //this.subscribeFirestoreCollection(); // Geht HIER nicht, weil Firestore Objekt zum Zeitpunkt noch nicht existiert
  }  

  /*
  isDownloadReady() {
    return this.downloadReady;
  }
*/
  saveKanbanItem(newItem: BacklogItem) {
    this.deleteKanbanItem(newItem, true); // falls es ein update ist löschen wir das original vorher um es verändert einzufügen
    this.backlogItems.push(newItem); // Ins array mit dem neuen

    this.sortList(); // nach Priority sortieren
    this.pushStorage(); // Array ins storage
    //3.)
    //this.pushFirestore(); ---> Wir müssen bei FS nicht immer mit dem vollen geschäft reinfahren, da gleiche ID = schlüsssel nicht dupliziert wird
    this.writeFirestoreItem(newItem);
  }

  deleteKanbanItem (itemToDelete: BacklogItem, saveDelete: boolean) {
    console.log("KBD: DelID: " + itemToDelete);
    //var idToDelete = itemToDelete.id; // brauchmagarnicht, das Objekt selber ist ihm genug :-)
    this.backlogItems = this.backlogItems.filter(item => item !== itemToDelete); // item 'rausoperieren'
    // 2.)
    this.pushStorage(); // bereinigtes Array ins storage  
    // 3.)
    if (!saveDelete) {
      this.deleteFirestoreItem(itemToDelete); // UND im FS löschen, wenn wir nicht im delete wegen save sind (nur für Storage)
    }
  }
  

  // 2.) local  STORAGE ZUGRIFF
  private pushStorage() { //schreibt das gesamte array neu ins storage
    this.myStorage.set('kanbantodo', this.backlogItems).then(() => { //ab ins geheime storage
      this.myStorage.length().then((val) => { 
        console.log("KBD: local Storage updated");
      });
    });
  }


  // 3.) FIRESTORE ZUGRIFF
  private writeFirestoreItem(itemToWrite: BacklogItem){  // speichert ein eizelnes item in firestore
    console.log("KBD: FirestoreItem written") ;
    this.fsPushInitiated++; // Verhindert, daß das callback den toast zeigt
    var id = String(itemToWrite.id);
    var setDoc = this.afs.collection('mykanbanbacklog').doc(id).set(itemToWrite);
  }

/* 
  private pushFirestore(){  // speichert alle items in firestore   ACHTUNG: alte IDs bleiben DORT erhalten 
    this.fsPushInitiated++; // Verhindert, daß das callback den toast zeigt

    this.itemsCollection.valueChanges();
   
    this.backlogItems.forEach(item => {  // Jedes item einzeln
      this.writeFirestoreItem(item);
    });

  }
*/
/*   single item based ... better subscribe collection .. see below
  UNUSEDsubscribeFirestoreItem(itemId) {
    var item = this.afs
      .doc<BacklogItem>('/mykanbanbacklog/' + itemId)
      .valueChanges()
      .subscribe(result=>{ // Hier steht nun was zu tun ist , wanimmer sich die daten draußen im store ändern
        console.log("FBitem: " + result.id + "  " + result.description);  
      });    ; 
  }
*/
  subscribeFirestoreCollection() {
    this.itemsCollection
      .valueChanges()
      // !!!!!!!!!!! FIRESTORE COLLECTION CALLBACK (promise)
      .subscribe(firestoreData=>{ // Hier steht nun was zu tun ist , wannimmer sich die daten draußen im store ändern
        if (firestoreData.length != 0) {
          console.log("KBD: Got Firestore items");  
          this.updateBacklogItems(firestoreData);
          if (this.fsPushInitiated > 0) { // Wir waren es selber .. keine notification an den user !
             this.fsPushInitiated--;
             console.log("KBD: Toast-PushCount: " + this.fsPushInitiated)
          } else {
            console.log("KBD: Toast");
            this.toast.create(this.toastOptions).present(); // Den user darüber aufklären (nachdem ich es zunächst nicht schaffe die anzeige zu aktualisieren)
//##################  SUBJECT
            console.log('KBD: write BacklogItems Observable');
            this.dataSubject.next(this.backlogItems); //send Observable data

          }
        };       
      });   
  }


  private deleteFirestoreItem(itemToDelete: BacklogItem){
    console.log("KBD: FirestoreItem deleted") ;
    this.fsPushInitiated++; // Verhindert, daß das callback den toast zeigt
    var id = String(itemToDelete.id);
    var setDoc = this.afs.collection('mykanbanbacklog').doc(id).delete();
  }


 // ##############  UTILS
  private updateBacklogItems(itemList: Array<BacklogItem>) { // schreibt den inhalt von Firestore und/oder Localstorage  ins lokale BacklogItems
    this.backlogItems = _.sortBy(itemList, function(itemX){return parseInt(itemX.priority);});
//##################  SUBJECT
    console.log('KBD: update sorted BacklogItems Observable');
    this.dataSubject.next(this.backlogItems); //send Observable data

  };

  getNextId() { // durchsucht die gesamte itemsList und findet den höchsten wert für ID
    var maxIdItem = _.max(this.backlogItems, function(itemX){return itemX.id * 1;} );
    var newId =  maxIdItem.id; // Geht nicht in einem, sonst würde die id des gefundenen objektes erhöht werden
    newId++;
    console.log("KBD: GetNextId: " + newId);
    return newId;
  }

  getNextPriority() { // durchsucht die gesamte itemsList und findet den höchsten wert für Priority
    var maxIdItem = _.max(this.backlogItems, function(itemX:BacklogItem){
      if (itemX.status != ItemStatus.DONE) {
        return <number>itemX.priority * 1;
      } else {
        return 0; // Für erledigte einträge uninteressanten wert zurückliefern, damit sie das MAX nicht stören
      }       
    });

    var newPri = <number> maxIdItem.priority; // Geht nicht in einem, sonst würde die id des gefundenen objektes erhöht werden
    newPri++;
    console.log("KBD: GetNextPriority: " + newPri);
    return newPri;
  }

  private sortList() {
//    var sortedItems = _.sortBy(this.backlogItems, 'priority'); // fasst den inhalt von "priority" leider als string auf
  //  var sortedItems: Array <BacklogItem> = _.sortBy(this.backlogItems, function(itemX){return <number>itemX.priority * 1;});
    // DAS  *1 ist die rettung  ... da wird dann endlich eine zahl draus  ... scheiß JS
    var sortedItems: Array <BacklogItem> = 
      _.sortBy(this.backlogItems, function(itemX){return parseInt(itemX.priority);}); // Die eleganteste methode
    this.backlogItems = sortedItems;
  }

  
  backlogItemEmpty:  BacklogItem   
   = {
    id: 0,
    title: 'Empty Item',
    description: '',
    category: Cat.SONSTIGES,
    dateDue: null,
    dateType: null,
    priority: 0,
    status: ItemStatus.LOGGED,
    weight: ItemWeight.NORMAL,
    dateDone: null 
  } ;
    
  getEmptyItem() {
    return this.backlogItemEmpty;
  } 

  public getDataSubject() {
    return this.dataSubject;
  }

}
