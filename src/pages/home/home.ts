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

  constructor(
    public navCtrl: NavController, 
    public myData: KanbandataProvider,
    public afAuth: AngularFireAuth,
    public formBuilder: FormBuilder
    ) {
      // ACHTUNG:  Das HIER der KanbanProvider im aufruf geholt wird erwirkt günstigerweise, daß die daten schon bereit sind wenn 
    // der user die listen Backlog oder ToDo anwählt

    this.myData.subscribeFirestoreCollection(); //An Goo firestore "andocken" .. der rest passiert im callback in

    var user = this.afAuth.auth.currentUser;
    var name, email, photoUrl, uid, emailVerified;
  
    this.afAuth.auth.onAuthStateChanged(function(user) {
      var that = this;
      console.log('AUTH: userAuthchange');
      

      if (user) {
        // User is signed in.
        console.log('AUTH: userAuthchange user exists');
        this.name = user.displayName;
        this.email = user.email;
        this.photoUrl = user.photoURL;
        this.emailVerified = user.emailVerified;
        this.uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                         // this value to authenticate with your backend server, if
                         // you have one. Use User.getToken() instead.
        console.log('AUTH: userAuthchange  ' + this.uid);

      
        this.userName = this.email;
      } else {
        // No user is signed in.
      }
    });
    

  }

  ionViewWillLoad(){
    this.getData();
  }

//------------------------------------------------
emailSignUp(credentials: EmailPasswordCredentials): firebase.Promise<FirebaseAuthState> {
  return this.af.auth.createUser(credentials)
    .then(() => console.log("success"))
    .catch(error => console.log(error));
}





//-------------------------------------------------



  authenticate(credentials) {
    console.log('AUTH: create useraccount');
    //debugger;
    var that = this;
//    this.afAuth.auth.createUserWithEmailAndPassword("hubsi1@mymail.tv", "123456")
    this.afAuth.auth.createUserWithEmailAndPassword(credentials.mail, credentials.pwd)
//    .then( () => console.log("AUTH: Account Created")) 
    .then (function() {
        confirm('Account created');
        that.login = false;  // zurück zur homepage
        that.userName = credentials.mail;
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
  }

  exitLoginPage() {
    this.login = false;
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
      that.userName = "";
      // Sign-out successful.
      console.log('AUTH: Signout OK');
    }).catch(function(error) {
      // An error happened.
      console.log('AUTH: Signout ERR');
    });
  }


  addAccount(value){
    
    console.log("AUTH: AddAccount clicked: " + value.mail);
    //this.login = false;
    this.authenticate(value);

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


  getData(){
    this.simple_form = this.formBuilder.group({
      mail: new FormControl('', Validators.required),
      pwd: new FormControl('', Validators.required),
    });
  }

}
