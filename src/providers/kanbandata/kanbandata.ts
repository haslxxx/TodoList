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

  constructor(public storage: Storage) {
      console.log('Hello KanbandataProvider Provider');
      // 1.)
      //this.makeListBacklogMock();  // Zuerst mit Mockdata arbeiten
      // 2.)
      this.myStorage = storage; //Storageobjekt speichern
      this.restoreItems(this.myStorage);

  }

  getKanbanList() {
    console.log('Hello KanbandataProvider/getKanbanList Provider');
    return this.backlogItems;
  }

  // 2.) ############## Local STORAGE 
  restoreItems(storage: Storage) {
    storage.length().then((val) => { 
      console.log("StorageLength");
      console.log(val);    
      if (val == 0)  { //Keine einträge --> neu anlegen  
        console.log("Empty List !!)");
        this.storage.set('kanbantodo', this.backlogItemsMock); // einmalig laufen lassen
      } else {
        this.storage.get('kanbantodo').then((val1) => { //key value pair holen 
          if (val == null) { //Keine einträge --> neu anlegen 
            console.log("No Kanban data");
            this.storage.set('kanbantodo', this.backlogItemsMock); // einmalig laufen lassen
          } else {
            console.log("Found Kanban data"); // HURRA Daten sind vorhanden
            this.backlogItems = val1;  // Ins lokale anzeigeArray für die ListenView damit !
          }
        });   
      };
    });  
/*
    storage.get('activities').then((val) => { //key value pair holen  (speichern siehe unten)
      this.restoredItems = val;
       this.restoreOptions(storage); // !! ineinander verschachtelte abfragen,  weil nur ganz innen alle daten fertig sind
    });    
    */
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
    category: null,
    dateDue: null,
    dateType: null,
    priority: 1,
    status: null,
    weight: null,
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
