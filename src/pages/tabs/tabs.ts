import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { ToDoListPage } from '../to-do-list/to-do-list';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = AboutPage;
  //tab2Root = FirestorePage;  ... war praktisch zum testen von firestore .. brauchma nimmer
  tab3Root = ContactPage; // Ist eigentlich die backlog liste
  tab4Root = ToDoListPage;  //ist eigentlich das gleiche wie die  Backlogliste, nur das diese nur die anzahl erlaubter tagesitems enthält

  constructor() {

  }
}
