import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';


//Kategorie des BacklogItems  (genaueres fehlt noch ########################### TODO)
export enum Cat {A, B, C}  // Innerhalb der klasse mag er's nicht 
export enum DatTyp {FIX, SCHED}  // Harter termin oder locker geplant
export enum ItemStatus {LOGGED, TODO, DONE}
export enum ItemWeight {EASY, NORMAL, HEAVY}

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

    // -----------------------> das ist vorgekocht von ionic
  selectedItem: any;
  icons: string[];
  items: Array<{title: string, id: number}>;



  constructor(public navCtrl: NavController) {
    this.listBacklogMock();
  }

  listBacklogMock() {
    this.items = [];

    var i = 0;
    var numOfActivities = this.backlogItemsMock.length;     
    for(i = 0; i < numOfActivities; i++) {
      this.items.push(
        {title:this.backlogItemsMock[i].title,
          id:this.backlogItemsMock[i].id
      });
    }

    this.icons = ['attach','basket','beer','bicycle','build','calendar','call','clock','construct' ];
     for (i; i < 14; i++) {
      this.items.push({
        title: 'Backlogitem ' + i ,
        id: null //,
      //  icon: this.icons[Math.floor(Math.random() * this.icons.length)]
      });
    }
      
  }


    backlogItemsMock: Array <
    {
      id: number,
      title: string,
      description: string,
      category: Cat,
      dateDue: Date,
      dateType: DatTyp,
      priority: number,
      status: ItemStatus,
      weight: ItemWeight,
      dateDone: Date
    }
    >
    = Array(
      {
        id: 1,
        title: 'TodoList fertigstellen',
        description: 'Programm fertigmachen und providers, Firebase zum laufne bringen',
        category: Cat.A,
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
        category: Cat.A,
        dateDue: null,
        dateType: null,
        priority: 2,
        status: ItemStatus.LOGGED,
        weight: ItemWeight.NORMAL,
        dateDone: null 
      }


    );
}
