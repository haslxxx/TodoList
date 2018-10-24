import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ItemDetailsPage } from '../item-details/item-details';

//Data
import { KanbandataProvider, BacklogItem, ItemStatus, CatString } from '../../providers/kanbandata/kanbandata';
// Portrait / Landscape 
import { ScreenOrientation } from '@ionic-native/screen-orientation';


@Component({
  selector: 'page-contact',
  templateUrl: 'backlog.html'
})
export class BacklogPage {
  selectedItem: any;
  items: Array <BacklogItem>;
  newItem: BacklogItem;

  screenStyle = "landscape";
  displayFilter = "log"; // Was wollen wir anzeigen

  constructor(
    public navCtrl: NavController, 
    public myData: KanbandataProvider ,
    private screenOrientation: ScreenOrientation,
    public catString: CatString) {
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
      case "log": { 
        this.items = this.myData.getKanbanList().filter(item => item.status == ItemStatus.LOGGED); 
        break; 
      } 
      case "todo": { 
        this.items = this.myData.getKanbanList().filter(item => item.status == ItemStatus.TODO); 
        break; 
      } 
      case "all": {
        this.items = this.myData.getKanbanList();  
        break;    
      } 
      case "done": { 
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
    this.myData.deleteKanbanItem(item);
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

  filterChange(event) { // User hat anderes displayfilter gewählt
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
      this.itemToMove.priority = this.itemToMOveInFront.priority;
      if (this.itemToMove !== this.itemToMOveInFront) {
        this.itemToMove.priority--; //2mal dasselbe angewählt
      };
      // ############### TODO Wasnochfehlt ... zurückschieben aller dahinter liegenden prioritäten (i.e. +1 bis zu einem loch)

      // Move erledigt !  --> Aufräumen
      this.myData.saveKanbanItem(item); // in die datenbasis zurückschreiben
      this.moveInsert = "";
      this.itemToMove = null;
      // Versuch die seite neu aufzubauen .. Klappt :-) Aber vorsicht (es killt alle navigationen davor, was in diesem fall nix ausmacht)
      this.navCtrl.setRoot(this.navCtrl.getActive().component);  
    }
  }

}
