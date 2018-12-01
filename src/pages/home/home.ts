import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
//Data
import { KanbandataProvider } from '../../providers/kanbandata/kanbandata';
//Login
import { AngularFireAuth } from '@angular/fire/auth';
import { BrowserModule } from '@angular/platform-browser';


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
    public myData: KanbandataProvider,
    public afAuth: AngularFireAuth,
    public formBuilder: FormBuilder
    ) {
      // ACHTUNG:  Das HIER der KanbanProvider im aufruf geholt wird erwirkt günstigerweise, daß die daten schon bereit sind wenn 
    // der user die listen Backlog oder ToDo anwählt

    this.myData.subscribeFirestoreCollection(); //An Goo firestore "andocken" .. der rest passiert im callback in
    this.subscribeAuthChange(); // listen to changes in authorization
  }

  ionViewWillLoad(){
    this.getData();
  }

  getData(){  //create form based on HTML form
    this.simple_form = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      mail: new FormControl('', Validators.required),
      pwd: new FormControl('', Validators.required),
    });
  }

  user ; //user profile
  //name;
  email;
  photoUrl;
  uid;
  emailVerified;

  subscribeAuthChange() {
    var that = this;
    this.afAuth.auth.onAuthStateChanged(function(user) {
      that.user = user;
      console.log('AUTH: userAuthchange ');
      
      if (user) {
        // User is signed in.
        console.log('AUTH: userAuthchange user valid');
        that.userName = user.displayName;
        that.email = user.email;
        that.photoUrl = user.photoURL;
        that.emailVerified = user.emailVerified;
        that.uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                        // this value to newUserAccount with your backend server, if
                        // you have one. Use User.getToken() instead.
        console.log('AUTH: userData  ' + that.uid + ' ' + that.userName + ' ' + that.email );

        that.userName = user.displayName;
        that.userId = user.uid;
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

//accountCreated: boolean = false;

  newUserAccount(credentials) {
    console.log('AUTH: create useraccount');
    //debugger;
    var that = this;
//    this.afAuth.auth.createUserWithEmailAndPassword("hubsi1@mymail.tv", "123456")
    this.afAuth.auth.createUserWithEmailAndPassword(credentials.mail, credentials.pwd)
//    .then( () => console.log("AUTH: Account Created")) 
    .then (function() {
//        that.accountCreated = true;
        that.updateUserProfile(credentials.name); // namen nachträglich einfügen

        confirm('Account created ' + that.user.displayName);
        that.login = false;  // zurück zur homepage
//        that.userName = credentials.mail;
        
        //If the new account was created, the user is signed in automatically. 
    })
    .catch(function(error) { // Handle Errors here.     
        var errorCode = error.code;
        var errorMessage = error.message;
        
        if(errorCode) {
          console.log('AUTH: error ' + errorCode + '  ' + errorMessage);
          confirm(errorMessage);
        };
   
      //debugger;
      // ...
      //currentUser.Uid --> uid
      })

      ;
  }

  gotoLoginPageClicked() {
    this.login = true;
    this.userName = this.getUserName();

  }

  exitLoginPage() {
    this.login = false;
  }

  updateUserProfile(name) {
    console.log('AUTH: Update Profile ' + name);
    var that = this;
    var user = this.afAuth.auth.currentUser;

    user.updateProfile({
//      displayName: "Jane Q. User",
      displayName: name ,
      photoURL: ""
    }).then(function() {
      // Update successful.
      console.log('AUTH: Profile updated ' + this.user.name);
      that.user.name = this.name;
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
      that.login = false;  // zurück zur homepage
//      that.userName = credentials.mail;
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
 
    //debugger;
    // ...
    //currentUser.Uid --> uid
    })

    ;
  }

  stayLoggedInChange() {
    console.log('AUTH: StayLoggedIn clicked');
  }

  logoutClicked() {
    var that = this;
    console.log('AUTH: Logout clicked');
    this.afAuth.auth.signOut().then(function() {
//      that.userName = "";
      // Sign-out successful.
      console.log('AUTH: Signout OK');
    }).catch(function(error) {
      // An error happened.
      console.log('AUTH: Signout ERR');
    });
  }

  addAccount(value){    
    console.log("AUTH: AddAccount clicked: " + value.mail + ' ' + value.name);
    //this.login = false;
    this.newUserAccount(value);
    // if (this.accountCreated) {
    //   this.accountCreated = false;
    //   this.updateUserProfile(value.name); // namen nachträglich einfügen
    // }

  /*  
    this.firebaseService.addUser(value)
    .then( res => {
      let toast = this.toastCtrl.create({
        message: 'User was created successfully',
        duration: 3000
      });
      toast.present();
      this.resetFields();
    }, err => {
      console.log(err)
    })
  }

  resetFields(){
    this.simple_form.reset()

     */
  }



}
