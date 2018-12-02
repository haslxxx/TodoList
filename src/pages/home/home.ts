import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
//Data
import { KanbandataProvider } from '../../providers/kanbandata/kanbandata';
//Login
import { AngularFireAuth } from '@angular/fire/auth';
//import { BrowserModule } from '@angular/platform-browser';

export class EmailPasswordCredentials {
  email: string;
  password: string;
}


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  login: boolean = false;
  simple_form: FormGroup;
  stayLoggedIn: boolean;
  userName: string = "DUMMY";
  userId: string = "00";

  constructor(
    public navCtrl: NavController, 
    // KanbanProvider bereits hier in der StartPage im aufruf, bewirkt, daß die daten schon bereit sind 
    // wenn der user die listen Backlog oder ToDo anwählt
    public myData: KanbandataProvider,
    public afAuth: AngularFireAuth,
    public formBuilder: FormBuilder
    ) {

    // passiert nun im callback zum AuthChange    
      // --> this.myData.subscribeFirestoreCollection(); //An Goo firestore "andocken" .. der rest passiert im callback in
    this.subscribeAuthChange(); // listen to changes in authorization
  }

  ionViewWillLoad(){
    this.getFormData();
  }

  getFormData(){  //create form based on HTML form
    this.simple_form = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      mail: new FormControl('', Validators.required),
      pwd: new FormControl('', Validators.required),
    });
  }

  user ; //user profile
  //name;
  email;
  //photoUrl;
  //uid;
  //emailVerified;

  subscribeAuthChange() {  //change in logged in user
    var that = this;
    this.afAuth.auth.onAuthStateChanged(function(user) {
      that.user = user;
      console.log('AUTH: userAuthchange ');
      
      if (user) {  // User is signed in.       
        console.log('AUTH: userAuthchange user valid');
        that.userName = user.displayName;
        that.email = user.email;
        //that.photoUrl = user.photoURL;
        //that.emailVerified = user.emailVerified;
        that.userId = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                        // this value to newUserAccount with your backend server, if
                        // you have one. Use User.getToken() instead.

        //that.userName = user.displayName;
        //that.userId = user.uid;
        var today: String = new Date().toISOString(); // Timestamp for LastVisited
        if (that.newUser) { // for a new account the value for user.displayName isn't set yet at this time
          //user.displayName = that.newUserName;  !! 'read only' property
          that.userName = that.newUserName;         
        }
        console.log('AUTH: userData  ' + that.userId + ' ' + that.userName + ' ' + that.email );

        that.myData.setUser(user, today, that.newUser, that.userName);  // Pass userdata to data provider
        that.newUser = false;

        that.myData.subscribeFirestoreCollection(); // Goo firestore subscription for user
      } else {
        // No user is signed in.
        that.userName = "";
        that.userId = "00";
      }
    });

  }


  getUserId() {
    if (this.user) {
      console.log("AUTH: Returning User ID " + this.user.uid);
      return this.user.uid;
    } else {
      return "00";
    }   
  }

  
  getUserName() {
    if (this.user) {
      console.log("AUTH: Returning User ID " + this.user.displayName);
      return this.user.displayName;
    } else {
      return "Nobody logged in";
    }   
  }


//-------------------------------------------------
  newUser: boolean = false;
  newUserName: string = "";

  newUserAccount(credentials) {
    console.log('AUTH: create useraccount');
    this.newUser = true;
    this.newUserName = credentials.name;
    //debugger;
    var that = this;
    this.afAuth.auth.createUserWithEmailAndPassword(credentials.mail, credentials.pwd)
    .then (function() {
      that.userName = credentials.name; // daher setzen wie ihn mal schon hier  .. sieh unten Aufruf updateUserProfile
      console.log('AUTH: Account created');
      confirm('Account created ' + that.userName);
      that.login = false;  // zurück zur homepageanzeige

      that.updateUserProfile(credentials.name); // namen nachträglich in den account einfügen (asynchron !!)
        //  ... hierher kommen wir niemals !!!
        // hier gehts weiter ohne daß befehl oben schon fertig !! 

        //If the new account was created, the user is signed in automatically. 
    })
    .catch(function(error) { // Handle Errors here.     
        var errorCode = error.code;
        var errorMessage = error.message;        
        if(errorCode) {
          console.log('AUTH: account create error ' + errorCode + '  ' + errorMessage);
          confirm(errorMessage);
        };
    });
  }

  updateUserProfile(name: string) {
    console.log('AUTH: Update Profile ' + name);
    var that = this;
    var currentUser = this.afAuth.auth.currentUser;

    currentUser.updateProfile({
      displayName: name ,
      photoURL: ""
    }).then(function() {
      // Update successful.
      console.log('AUTH: Profile updated ' + name);
      that.user.name = name;
      that.userName = name;
    }).catch(function(error) {
      console.log('AUTH: Profile update ERR ' + error.message);
    });    
  }

  loginClicked(credentials) {
    console.log('AUTH: Login clicked');
    var that = this;
    this.afAuth.auth.signInWithEmailAndPassword(credentials.mail, credentials.pwd)
    .then (function() {
      console.log('AUTH: login OK ');
      that.login = false;  // back to homepage
      //If the new account was created, the user is signed in automatically. 
      confirm('Login Successful');
    })
    .catch(function(error) { // Handle Errors here.
      console.log('AUTH: login ERR ');     
      var errorCode = error.code;
      var errorMessage = error.message;      
      if(errorCode) {
        console.log('AUTH: error ' + errorCode + '  ' + errorMessage);
        confirm(errorMessage);
      };
    });
  }
  
  gotoLoginPageClicked() {
    this.login = true;
    this.userName = this.getUserName();
  }

  exitLoginPageClicked() {
    this.login = false;
  }


  stayLoggedInChange() {
    console.log('AUTH: StayLoggedIn clicked');
  }

  logoutClicked() {
    var that = this;
    console.log('AUTH: Logout clicked');
    this.afAuth.auth.signOut().then(function() {
      // Sign-out successful.
      console.log('AUTH: Signout OK');
    }).catch(function(error) {
      // An error happened.
      console.log('AUTH: Signout ERR');
    });
  }

  addAccountClicked(value){    
    console.log("AUTH: AddAccount clicked: " + value.mail + ' ' + value.name);
    this.newUserAccount(value);
  }



}
