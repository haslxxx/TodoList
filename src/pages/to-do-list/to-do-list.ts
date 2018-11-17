import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { KanbandataProvider, BacklogItem , ItemStatus} from '../../providers/kanbandata/kanbandata';

@IonicPage()
@Component({
  selector: 'page-to-do-list',
  templateUrl: 'to-do-list.html',
})
export class ToDoListPage {

  //items: Array <BacklogItem>;
  todoItems: Array <BacklogItem>;

  tooltipEvent: 'click' | 'press' = 'click';
  showArrow: boolean = true;
  duration: number = 10000;

  constructor(public navCtrl: NavController, public navParams: NavParams, public myData: KanbandataProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ToDoListPage');
  }

  ionViewWillEnter() {  //Gefilterte Backlogtabelle nach  Status == TODO
    this.todoItems = this.myData.getKanbanList().filter(item => item.status == ItemStatus.TODO);
  }

  postponeClicked(item) { // Punkt aus der ToDo liste wieder zurück ins Backlog
    item.status =  ItemStatus.LOGGED ;
    item.dateDone = null;
    this.myData.saveKanbanItem(item); // in die datenbasis zurückschreiben
    this.navCtrl.setRoot(this.navCtrl.getActive().component); //frisch anzeigen
    // TODO  ein Toast mit einer HURRA meldung
  }

  doneClicked(item) {  // Punkt ist erledigt -->  status auf "ERLEDIGT" ändern und Datum eintragen
    item.status =  ItemStatus.DONE;
    item.priority = 1000;  // "Endlager"  weit hinten
    item.dateDone = new Date().toISOString();  // Aktuelles datum eintragen
    this.myData.saveKanbanItem(item); // in die datenbasis zurückschreiben
    this.navCtrl.setRoot(this.navCtrl.getActive().component); //frisch anzeigen
    // TODO  ein Toast mit einer HURRA meldung
  }


}
