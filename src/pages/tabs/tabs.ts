import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { BacklogPage } from '../backlog/backlog';
import { HomePage } from '../home/home';
import { ToDoListPage } from '../to-do-list/to-do-list';

import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from 'ionic-angular';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = AboutPage;
  //tab2Root = FirestorePage;  ... war praktisch zum testen von firestore .. brauchma nimmer
  tab3Root = BacklogPage; // Ist eigentlich die backlog liste
  tab4Root = ToDoListPage;  //ist eigentlich das gleiche wie die  Backlogliste, nur das diese nur die anzahl erlaubter tagesitems enthält

  userIsLoggedIn: boolean = false;
  userIsLoggedInLastState: boolean = false;

  constructor(
    public afAuth: AngularFireAuth,
    public navCtrl: NavController
    ) {
    this.subscribeAuthChange();
  }

  subscribeAuthChange() {  //change in logged in user   
    var that = this;
    this.afAuth.auth.onAuthStateChanged(function(user) {
      console.log('TAB: userAuthchange ');   
         
      if (user) {  // User is signed in.       
        console.log('TAB: userAuthchange user valid');
        that.userIsLoggedIn= true;

      //   if (that.userIsLoggedIn != that.userIsLoggedInLastState) {  // to prevent an endless loop
      //     that.navCtrl.setRoot(that.navCtrl.getActive().component);
      //     that.userIsLoggedInLastState = that.userIsLoggedIn;
      //   }
        that.userIsLoggedInLastState = that.userIsLoggedIn;
      } else {
        // No user is signed in.
        console.log('TAB: userAuthchange user NOT logged in');
        that.userIsLoggedIn= false;
        if (that.userIsLoggedIn != that.userIsLoggedInLastState) {  // to prevent an endless loop
          console.log('TAB: userAuthchange user NOT logged in, Tabs refresh');
          that.navCtrl.setRoot(that.navCtrl.getActive().component);
          that.userIsLoggedInLastState = that.userIsLoggedIn;
        }
      }
    });
  }
 
}
