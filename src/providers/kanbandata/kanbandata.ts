/*
Hier werden die daten bereitgestellt.
1.) Mockdaten für den anfang
2.) Lokales storage, damit eine unabhängigkeit von Goo gleibt
3.) Sync mit goo  firestore

*/


//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';   //STORAGE



/*
  Generated class for the KanbandataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

// Innerhalb der klasse mag er keine enums  ... das mit dem export scheint ein nötiger trick zu sein
export enum Cat {HAUS_GARTEN, UNI, FREIZEIT, ADMIN, SONSTIGES}  //Kategorie des BacklogItems ... ERWEITERBAR
export enum DatTyp {FIX, SCHED}  // Harter termin oder locker geplant
export enum ItemStatus {LOGGED, TODO, DONE}
export enum ItemWeight {EASY, NORMAL, HEAVY}

export class BacklogItem {
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

  backlogItems: Array<BacklogItem>;
  myStorage:Storage;

  constructor(private storage: Storage) {
      console.log('Hello KanbandataProvider Provider');
      // 1.)
      //this.makeListBacklogMock();  // Zuerst mit Mockdata arbeiten
      // 2.)
      this.myStorage = storage; //Storageobjekt speichern
      this.restoreItems();

  }

  getKanbanList() {
    console.log('Hello KanbandataProvider/getKanbanList Provider');
    return this.backlogItems;
  }


  /*
  getNextId() { // durchsucht die gesamte itemsList und findet den höchsten wert für ID
    var maxIdObject;
    console.log("GetNextId");
    maxIdObject = _.max(this.itemsList, function(activity){return activity.id;} );
    var newId =  maxIdObject.id + 1 ;

    console.log(newId);
    return newId;
  }
*/
  // 2.) ############## Local STORAGE 
  restoreItems() {
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
            console.log("Found Kanban data"); // HURRA Daten sind vorhanden
            this.backlogItems = val1;  // Ins lokale anzeigeArray für die ListenView damit !
            
          }
        });   
      };
    });  
  }  


  saveKanbanItem(newItem: BacklogItem) {
    this.deleteKanbanItem(newItem); // falls es ein update ist löschen wir das original vorher um es verändert einzufügen
    this.backlogItems.push(newItem); // Ins array mit dem neuen
    this.writeStorage(); // Array ins storage
  }

  deleteKanbanItem (itemToDelete: BacklogItem) {
    console.log("DelID: " + itemToDelete);
    var idToDelete = itemToDelete.id;
    this.backlogItems = this.backlogItems.filter(item => item !== itemToDelete); // 'rausoperieren'
    this.writeStorage(); // Array ins storage  
  }
  
  private writeStorage() { //schreibt das gesamte array neu ins storage
    this.myStorage.set('kanbantodo', this.backlogItems).then(() => { //ab ins geheime storage
      this.myStorage.length().then((val) => { 
        console.log("StorageLength: " + val);
      });
    });
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
