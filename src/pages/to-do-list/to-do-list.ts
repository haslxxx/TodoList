import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { KanbandataProvider} from '../../providers/kanbandata/kanbandata';
import { BacklogItem, ItemStatus, Cat, ItemWeight, CatString } from '../../providers/kanbandata/kanbandataInterface';

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
    console.log('Hi TodoList page (TDP)')
    this.subscribeSubjects();     
    this.myData.getKanbanList(); //Initial Load
  }

  ionViewDidLoad() {
    console.log('TDP: ionViewDidLoad');
  }

  ionViewWillEnter() {  //Gefilterte Backlogtabelle nach  Status == TODO
    console.log('TDP: ionVieWillEnter');
    this.setFilteredList(this.todoItems);
  }

  setFilteredList(data) {
    this.todoItems = data.filter(item => item.status == ItemStatus.TODO);
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

  dataSubject;
  subscribeSubjects() { //Subject ist das praktischere Observable
    this.dataSubject = this.myData.getDataSubject();
    this.dataSubject.subscribe((data) => { 
      this.setFilteredList(data) ;
      console.log('TDP: Received Subject KanbanData');
    });
  }



}
