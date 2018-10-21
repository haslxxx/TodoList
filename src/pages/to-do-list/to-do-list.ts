import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { KanbandataProvider, BacklogItem , ItemStatus} from '../../providers/kanbandata/kanbandata';
// Alles für's datum
import { DatePipe } from '@angular/common'

/**
 * Generated class for the ToDoListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-to-do-list',
  templateUrl: 'to-do-list.html',
})
export class ToDoListPage {

  //items: Array <BacklogItem>;
  todoItems: Array <BacklogItem>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public myData: KanbandataProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ToDoListPage');
  }

  ionViewWillEnter() {  //Gefilterte Backlogtabelle nach  Status == TODO
    this.todoItems = this.myData.getKanbanList().filter(item => item.status == ItemStatus.TODO);
    //this.todoItems = this.todoItems.filter(item => item.status == ItemStatus.TODO);
  }

  postponeClicked(item) { // Punkt aus der ToDo liste wieder zurück ins Backlog
    item.status =  ItemStatus.LOGGED ;
    item.dateDone = null;
    this.myData.saveKanbanItem(item); // in die datenbasis zurückschreiben
    this.navCtrl.setRoot(this.navCtrl.getActive().component); //frisch anzeigen
  }

  doneClicked(item) {  // Punkt ist erledigt -->  status auf "ERLEDIGT" ändern und Datum eintragen
    item.status =  ItemStatus.DONE;
    item.dateDone = new Date().toISOString();  // Aktuelles datum eintragen
    this.myData.saveKanbanItem(item); // in die datenbasis zurückschreiben
    this.navCtrl.setRoot(this.navCtrl.getActive().component); //frisch anzeigen
  }


}
