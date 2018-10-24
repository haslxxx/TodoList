/*
Hier werden die daten bereitgestellt.
1.) Mockdaten für den anfang
2.) Lokales storage, damit eine unabhängigkeit von Goo gleibt
3.) Sync mit goo  firestore

*/


//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';   //STORAGE

import  _ from 'underscore';                //_.findWhere  etc.

// 3.)
import { AngularFirestore,  AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { ToastController, ToastOptions } from 'ionic-angular'


// Innerhalb der klasse mag er keine enums  ... das mit dem export scheint ein nötiger trick zu sein
export enum Cat {HAUS_GARTEN, UNI, FREIZEIT, ADMIN, SONSTIGES}  // §§§§§§ Kategorie des BacklogItems ... ERWEITERBAR
export enum DatTyp {FIX, SCHED}  // Harter termin oder locker geplant
export enum ItemStatus {LOGGED, TODO, DONE}
export enum ItemWeight {EASY, NORMAL, HEAVY}

export class CatString { // für die anzeige in Views .. weil der user so schlecht mit nummern umgeht
  0: String = "HAUS"
  1: String = "UNI"
  2: String = "FREIZEIT"
  3: String = "ADMIN"
  4: String = "SONSTIG"
}
export interface BacklogItem {  //statt interface könnte man auch class schreiben
    id: number;
    title: string;
    description: string;
    category: Cat;
    dateDue: Date;
    dateType: DatTyp;
    priority: number;
    status: ItemStatus;
    weight: ItemWeight;
    dateDone: Date;
}



@Injectable()
export class KanbandataProvider {

  backlogItems: Array<BacklogItem>; // HIER sind alle LOKALEN Daten
  // 2.)
  myStorage:Storage;
  // 3.)  
  afs: AngularFirestore;
  itemsCollection: AngularFirestoreCollection<BacklogItem> ;
  items: Observable<BacklogItem[]>;

  toastOptions: ToastOptions;
  fsPushInitiated: boolean = true;

  constructor(
    private storage: Storage, 
    private afstore: AngularFirestore,
    private toast: ToastController
    ) {

      console.log('Hello KanbandataProvider Provider');
      // 1.)
      //this.makeListBacklogMock();  // Zuerst mit Mockdata arbeiten
      // 2.)
      this.myStorage = storage; //Storageobjekt speichern
      this.restoreItems();

      // 3.)
      this.afs = afstore; //firestore objekt speichern
      this.itemsCollection  = this.afs.collection('mykanbanbacklog'); // Name der collection = wurzel der daten

      this.toastOptions = {
        message: 'Externe Datenänderung !',
        duration: 5000,
        showCloseButton: true,
        closeButtonText: 'Close'
      }
  }

  getKanbanList() {
    console.log('Hello getKanbanList');
    return this.backlogItems;
  }

  // 2.) ############## Local STORAGE 
  restoreItems() {
    //this.downloadReady = false;
    this.myStorage.length().then((val) => { 
      console.log("StorageLength");
      console.log(val);    
      if (val == 0)  { //Keine einträge --> neu anlegen  
        console.log("Empty List !!)");
        this.myStorage.set('kanbantodo', this.backlogItemsMock); // Wenn leer dann mit Dummydaten füllen
      } else {
        this.myStorage.get('kanbantodo').then((val1) => { //key value pair holen 
          if (val1 == null) { //Keine einträge --> neu anlegen 
            console.log("No Kanban data");
            this.myStorage.set('kanbantodo', this.backlogItemsMock); // Wenn leer dann mit Dummydaten füllen
          } else {
            console.log("Found Local Kanban data"); // HURRA Daten sind vorhanden
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
    this.deleteKanbanItem(newItem); // falls es ein update ist löschen wir das original vorher um es verändert einzufügen
    this.backlogItems.push(newItem); // Ins array mit dem neuen

    this.sortList(); // nach Priority sortieren
    this.pushStorage(); // Array ins storage
    //3.)
    this.pushFirestore();
  }

  deleteKanbanItem (itemToDelete: BacklogItem) {
    console.log("DelID: " + itemToDelete);
    //var idToDelete = itemToDelete.id; // brauchmagarnicht, das Objekt selber ist ihm genug :-)
    this.backlogItems = this.backlogItems.filter(item => item !== itemToDelete); // item 'rausoperieren'
    // 2.)
    this.pushStorage(); // bereinigtes Array ins storage  
    // 3.)
    this.deleteFirestoreItem(itemToDelete); // UND im FS löschen
  }
  

  // 2.) local  STORAGE ZUGRIFF
  private pushStorage() { //schreibt das gesamte array neu ins storage
    this.myStorage.set('kanbantodo', this.backlogItems).then(() => { //ab ins geheime storage
      this.myStorage.length().then((val) => { 
        console.log("local Storage updated");
      });
    });
  }


  // 3.) FIRESTORE ZUGRIFF
  private writeFirestoreItem(itemToWrite: BacklogItem){  // speichert ein eizelnes item in firestore
    this.fsPushInitiated = true; // Verhindert, daß das callback den toast zeigt
    var id = String(itemToWrite.id);
    var setDoc = this.afs.collection('mykanbanbacklog').doc(id).set(itemToWrite);
  }

  private pushFirestore(){  // speichert alle items in firestore   ACHTUNG: alte IDs bleiben DORT erhalten 
    this.fsPushInitiated = true; // Verhindert, daß das callback den toast zeigt
    this.backlogItems.forEach(item => {
      this.writeFirestoreItem(item);
    });
  }

 
  UNUSEDsubscribeFirestoreItem(itemId) {
    var item = this.afs
      .doc<BacklogItem>('/mykanbanbacklog/' + itemId)
      .valueChanges()
      .subscribe(result=>{ // Hier steht nun was zu tun ist , wanimmer sich die daten draußen im store ändern
        console.log("FBitem: " + result.id + "  " + result.description);  
      });    ; 
  }

  subscribeFirestoreCollection() {
    this.itemsCollection
      .valueChanges()
      // !!!!!!!!!!! FIRESTORE COLLECTION CALLBACK (promise)
      .subscribe(firestoreData=>{ // Hier steht nun was zu tun ist , wannimmer sich die daten draußen im store ändern
        if (firestoreData.length != 0) {
          console.log("Got Firestore items");  
          this.updateBacklogItems(firestoreData);
          if (this.fsPushInitiated == true) { // Wir waren es selber .. keine notification an den user !
             this.fsPushInitiated = false;
          } else {
            console.log("Toast");
            this.toast.create(this.toastOptions).present(); // Den user darüber aufklären (nachdem ich es zunächst nicht schaffe die anzeige zu aktualisieren)
          }
        };       
      });   
  }


  private deleteFirestoreItem(itemToDelete: BacklogItem){
    this.fsPushInitiated = true; // Verhindert, daß das callback den toast zeigt
    var id = String(itemToDelete.id);
    var setDoc = this.afs.collection('mykanbanbacklog').doc(id).delete();
  }


 // ##############  UTILS
  private updateBacklogItems(itemList: Array<BacklogItem>) { // schreibt den inhalt von Firestore und/oder Localstorage  ins lokale BacklogItems
    this.backlogItems = _.sortBy(itemList, function(itemX){return parseInt(itemX.priority);});
  };

  getNextId() { // durchsucht die gesamte itemsList und findet den höchsten wert für ID
    var maxIdItem = _.max(this.backlogItems, function(itemX){return itemX.id * 1;} );
    var newId =  maxIdItem.id; // Geht nicht in einem, sonst würde die id des gefundenen objektes erhöht werden
    newId++;
    console.log("GetNextId: " + newId);
    return newId;
  }

  getNextPriority() { // durchsucht die gesamte itemsList und findet den höchsten wert für Priority
    var maxIdItem = _.max(this.backlogItems, function(itemX){return <number>itemX.priority * 1;} );
    var newPri = <number> maxIdItem.priority; // Geht nicht in einem, sonst würde die id des gefundenen objektes erhöht werden
    newPri++;
    console.log("GetNextPriority: " + newPri);
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


  //DUMMYdaten
  backlogItemsMock: Array <BacklogItem>
    = Array(
      {
        id: 1,
        title: 'TodoList fertigstellen',
        description: 'Programm fertigmachen und providers, Firebase zum laufne bringen',
        category: Cat.UNI,
        dateDue: null,
        dateType: null,
        priority: 1,
        status: ItemStatus.LOGGED,
        weight: ItemWeight.NORMAL,
        dateDone: null 
      },
      {
        id: 2,
        title: 'Wanderung Dachstein',
        description: 'Hinfahren, raufgehen, freuen, runtergehen',
        category: Cat.FREIZEIT,
        dateDue: null,
        dateType: null,
        priority: 2,
        status: ItemStatus.LOGGED,
        weight: ItemWeight.NORMAL,
        dateDone: null 
      },
      {
        id: 3,
        title: 'Gaaanz langeeeeeeeee Wanderungggggg  Dachsteinnnnnnnnnnnnn',
        description: 'Hinfahren, raufgehen, freuen, runtergehen',
        category: Cat.FREIZEIT,
        dateDue: null,
        dateType: null,
        priority: 5,
        status: ItemStatus.TODO,
        weight: ItemWeight.EASY,
        dateDone: null 
      }
  );
 
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

  // 1.)  ################## MOCK DATA   ... DummyDaten
  makeListBacklogMock() {
    this.backlogItems = []; 
    var i = 0;
    var numOfActivities = this.backlogItemsMock.length;     
    for(i = 0; i < numOfActivities; i++) {
      this.backlogItems.push(this.backlogItemsMock[i]);
    }
    // Auffüller
    var emptyItem  = this.backlogItemEmpty;
    for (i; i < 14; i++) {
      emptyItem.title = 'Backlogitem ' + (i+1);  // interessant  .. alle haben die nummer 14  #####TODO
      this.backlogItems.push(emptyItem);
    }        
  }

  getEmptyItem() {
    return this.backlogItemEmpty;
  } 

}
