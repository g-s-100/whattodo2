import Vue from 'vue'
import {crypt} from './cryptage.js';
import {user} from './users.js';

const showOrHide = function(){
  document.getElementById('new').className = 'to-show';
}

const conection = new Vue({
  el: "#new",
  data: {
    post: "",
    conected: false,
    conecting: true,
    firstName: "",
    lastName: "",
    age: "",
    userID: "",
    password: "",
    showClass: showOrHide()
  },
  methods: {
    // Creates a new user in the database.
    addNewUser: function() {
      // Defines the user object. Changes can easilly be done here for futures user's.
      var newUser = {
        _id: crypt.keyCypher(this.userID),
        password: crypt.keyCypher(this.password),
        info:{
          firstName: crypt.keyCypher(this.firstName),
          lastName: crypt.keyCypher(this.lastName),
          age: crypt.keyCypher(this.age)
        },
        postsID: [],
        dialogID: [],
        friendsID: []
      };
      // Adds user to db and send you back to connection window.
      user.createUser(newUser);
      this.changeConectionType();
    },
    logIn: function() {
      // Checks the input data.
      var tryingToConnectAs = {
        id: crypt.keyCypher(this.userID),
        password: crypt.keyCypher(this.password)
      };
      // The data must be crypted before checking, else it won't work.
      user.logInCheck(tryingToConnectAs);
    },
    addPost: function() {
      var post = this.post;
      user.posting(post, user.conectedAs);
      this.post = "";
    },
    changeConectionType: function() {
      this.conecting = !this.conecting;
      this.firstName = "";
      this.lastName = "";
      this.age = "";
      this.userID = "";
      this.password = "";
    },
    disconection: function() {
      this.conected = !this.conected;
      user.conectedAs = "";
    }
  }
});

var cookieList = decodeURIComponent(document.cookie).split(';');
for(let i = 0; i < cookieList.length; i++){
  var cookie = cookieList[i];
  var list = cookie.split('=');
  if(list[0] === 'conectedAs'){
    user.conectedAs = list[1];
  }
}

if(user.conectedAs.length > 0){
  location.assign("home.html");
}
