import Vue from 'vue'
import {crypt} from './scripts/cryptage.js';
import {user} from './scripts/users.js';

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
    password: ""
  },
  methods: {
    addNewUser: function() {
      var newUser = {
        _id: crypt.keyCypher(this.userID),
        password: crypt.keyCypher(this.password),
        info:{
          firstName: crypt.keyCypher(this.firstName),
          lastName: crypt.keyCypher(this.lastName),
          age: crypt.keyCypher(this.age)
        },
        postsID: [],
        dialogID: []
      };
      user.createUser(newUser);
      this.changeConectionType();
    },
    logIn: function() {
      var tryingToConnectAs = {
        id: crypt.keyCypher(this.userID),
        password: crypt.keyCypher(this.password)
      };
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








// Hold it down.
