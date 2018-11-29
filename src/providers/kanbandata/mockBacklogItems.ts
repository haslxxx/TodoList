  //DUMMYdaten
  import { BacklogItem, ItemStatus, Cat, ItemWeight } from './kanbandataInterface';


  export class MockItems {

    public getMockBacklogItems() {
        
      var backlogItemsMock
        = Array <BacklogItem>
      (
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

    return backlogItemsMock;
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


    getListBacklogMock() {
      var backlogItems = []; 
      var i = 0;
      var numOfActivities = this.getMockBacklogItems.length;     
      for(i = 0; i < numOfActivities; i++) {
        backlogItems.push(this.getMockBacklogItems[i]);
      }
      // Auffüller
      var emptyItem  = this.backlogItemEmpty;
      for (i; i < 14; i++) {
        emptyItem.title = 'Backlogitem ' + (i+1);  // interessant  .. alle haben die nummer 14  #####TODO
        backlogItems.push(emptyItem);
      }        
    }
  

  }


 