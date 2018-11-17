import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ItemDetailsPage } from '../item-details/item-details';

//Data
import { KanbandataProvider, BacklogItem, ItemStatus, CatString } from '../../providers/kanbandata/kanbandata';
// Portrait / Landscape 
import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { AlertController } from 'ionic-angular';


@Component({
  selector: 'page-contact',
  templateUrl: 'backlog.html'
})
export class BacklogPage {
  selectedItem: any; // Backlogitem das in bearbeitung ist
  items: Array <BacklogItem>; // Lokle kopie der Backlogitems
  newItem: BacklogItem;

  screenStyle = "landscape";
  displayFilter = "Logged"; // Was wollen wir anzeigen

  constructor(
    public navCtrl: NavController, 
    public myData: KanbandataProvider ,
    private screenOrientation: ScreenOrientation,
    public catString: CatString,
    private alertCtrl: AlertController
    ) {
    // this.items = this.myData.getKanbanList(); // Daten laden  ... geht hier nicht

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
  }

// Alert Popup für den Filter Parameter
  filterPopup () {
    let filterAlert = this.alertCtrl.create({
      message: 'Anzeigefilter',
/*      cssClass:'prompt_alert',
      inputs: [
        {name: 'Filter',value: this.displayFilter}
      ],
*/      buttons: [
        {text: 'Logged',handler: data => {this.setFilter('Logged');}},
        {text: 'ToDo',handler: data => {this.setFilter('Todo');}},
        {text: 'All',handler: data => {this.setFilter('All');}},
        {text: 'Done',handler: data => {this.setFilter('Done');}},
      ]
    });
    filterAlert.present();
  }

  setFilter(filterType: string){
    console.log('Filter: ' + filterType);
    this.displayFilter = filterType;
    this.getFilteredKanbanList(); 
  }


  //############### LIFECYCLE callbacks  systemcallback von IONIC!
  ionViewWillEnter() { 
    console.log("Entering Backlog ListView");
    // --- Fetch Data
    this.getFilteredKanbanList();
    // while (this.myData.isDownloadReady() != true) {}; // Warteschleife bis daten geladen sind   --- GEHT NICHT
  }

  private getFilteredKanbanList() {
    console.log("DisplayFILTER: " + this.displayFilter); // Über data binding mit wert im html verbunden
    switch(this.displayFilter) { 
      case "Logged": { 
        this.items = this.myData.getKanbanList().filter(item => item.status == ItemStatus.LOGGED); 
        break; 
      } 
      case "Todo": { 
        this.items = this.myData.getKanbanList().filter(item => item.status == ItemStatus.TODO); 
        break; 
      } 
      case "All": {
        this.items = this.myData.getKanbanList();  
        break;    
      } 
      case "Done": { 
        this.items = this.myData.getKanbanList().filter(item => item.status == ItemStatus.DONE);
        break; 
      }  
      default: { 
        this.items = this.myData.getKanbanList(); 
        break;              
      } 
    }        
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
  

  //################# Click- Events
  itemSelectForTodo(item) {
    console.log("Entering itemSelectForTodo");
    item.status =  ItemStatus.TODO ;
    this.myData.saveKanbanItem(item); // in die datenbasis zurückschreiben
    this.navCtrl.setRoot(this.navCtrl.getActive().component); //frisch anzeigen
  }

  itemEdit(theItem) {
    console.log("Entering itemEdit: " + theItem.title + "  "  + theItem.id);
    this.navCtrl.push(ItemDetailsPage , {
      item: theItem
    });
  }

  itemDelete(item) {
    console.log("Entering itemDelete");
    this.myData.deleteKanbanItem(item, false);
    // Versuch die seite neu aufzubauen .. Klappt :-) Aber vorsicht (es killt alle navigationen davor, was in diesem fall nix ausmacht)
    this.navCtrl.setRoot(this.navCtrl.getActive().component);  
  }

  newClicked() {
    console.log("Entering newClicked");
    this.newItem = undefined; //Object.assign({}, obj);
//    this.newItem = this.myData.getEmptyItem();
    this.newItem = Object.assign({}, this.myData.getEmptyItem()); // DAS ist ein wirklich neues objekt
    // --> OHNE würde der letzte verwendete stand immer wieder auftauchen (i.e. die letzte id zB)
    this.newItem.title = ">> Please Enter New Item <<";
    this.newItem.id = this.myData.getNextId();
    this.newItem.priority = this.myData.getNextPriority();
     
    this.navCtrl.push(ItemDetailsPage, {
      item: this.newItem
    });
  }

  itemSelected(event, item) {
    // Klappt nicht, weil DAS auch immer feuert wenn man die funktionsknöpfe von rechts holt
    /*
    console.log("Entering itemSelected");
    this.itemChangePriority(item);
    */
  }

  // #############  SUCHE
  onSearch(ev: any) {
    this.getFilteredKanbanList();    //Ganze liste herstellen
    const val = ev.target.value; //Suchstring aus der searchbar   
    if (val && val.trim() != '') { // Wenn suchstring leer .. nix filtern
      this.items = this.items.filter((item) => {
        return (item.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  filterChange() { // User hat anderes displayfilter gewählt
    this.getFilteredKanbanList();
  }

  itemToMove: BacklogItem;
  itemToMOveInFront: BacklogItem;
  moveInsert: String;

  itemChangePriority(item) {
    if(this.itemToMove == null) { // erstes Item noch nicht ausgewählt
      this.itemToMove = item;
      this.moveInsert = "MOVE: Ziel wählen"
    } else { // zweites Item ausgewählt --> verschieben (i.e. Priorität ändern)
      this.itemToMOveInFront = item;
      if (this.itemToMove !== this.itemToMOveInFront) { // wenn 2mal dasselbe angewählt .. quais abbruch
        this.shiftPriorities(this.itemToMOveInFront, this.itemToMove);
      };
      // Move erledigt !  --> Aufräumen
      this.moveInsert = "";
      this.itemToMove = null;
      // Versuch die seite neu aufzubauen .. Klappt :-) Aber vorsicht (es killt alle navigationen davor, was in diesem fall nix ausmacht)
      this.navCtrl.setRoot(this.navCtrl.getActive().component);  
    }
  }

  shiftPriorities(itemBehind: BacklogItem, itemMoved: BacklogItem) { //Verschiebt die einträge für priority (+1) wenn ein item vorgereiht wurde
// ACHTUNG:  Diese funktion arbeitet auf der gefilterten liste zur anzeige in Backlog. Ausgefilterte items werden nicht berührt
    var priorityBehind = itemBehind.priority;
    console.log("Priority Behind: " + priorityBehind) ;
    this.items.map((item) => {
      if(item.priority >= priorityBehind) {
        console.log("Priority changed: " + item.priority) ;
        item.priority++; // alle ab und incl dem item vor das zu verschieben ist eins nach hinten
        this.myData.saveKanbanItem(item);
      }
    });
    itemMoved.priority = priorityBehind;    
    //this.tidyPriorities(); // EINMALIGE ORDNUNGSFUNKTION -->  
    this.myData.saveKanbanItem(itemMoved); //ALT  das moved itemin die datenbasis zurückschreiben
    // FEHLER !!!!!!!!!!!!!!!!!!!! ... NUN müssen ALLE geänderten zurückgeschrieben werden
  }

  tidyPriorities() { //eine durchgehende lückenlose zahlenreihe für "priority"
    var itemNo = 1;
    this.items.forEach(element => {
      element.priority = itemNo;
      itemNo++;      
    });
  }

}
