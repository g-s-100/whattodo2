import Vue from 'vue'
import {user} from './users.js';
import {crypt} from './cryptage.js';
/*
var cookieList = decodeURIComponent(document.cookie).split(';');
for(let i = 0; i < cookieList.length; i++){
  var cookie = cookieList[i];
  var list = cookie.split('=');
  if(list[0] === 'conectedAs'){
    user.conectedAs = list[1];
  }
}

if(user.conectedAs.length === 0){
  location.assign("index.html");
}*/
function debugUserConnected() {
  try {
    var me = user.conectedAs;
    return me;
  } catch(err) {
    var me = ' ';
    return me
  }
};

/*function getFriendsList() {
  try {
    user.getFriendsList();
    setTimeout(function(){
      var myFriends = user.friendList;
      console.log(myFriends);
      //return myFriends;
    }, 800);
  } catch(err) {
    return [];
  }
}*/



Vue.component('conversation', {
  props: ['sentence'],
  template:
    '<p :class="sentence.from">{{sentence.sentence}}</p>'
});

const dialogApp = new Vue({
  el:'#dialog',
  data:{
    dialog: [],
    message: '',
    talkingTo: ''
  },
  methods: {
    sendMessage: function(){
      var newMessage = {
        sentence: this.message,
        from: user.conectedAs
      };
      user.sendMessage(newMessage);
      this.message = '';
      this.dialog = user.dialog;
    },
    openDialog: function(){
      user.startDialog(this.talkingTo);
      setTimeout(function(){
        var dialogList = user.dialog;
        for(let i = 0; i < dialogList.length; i++) {
          if(dialogList[i].from === user.conectedAs){
            dialogList[i].from = 'ME';
          } else {
            dialogList[i].from = 'OTHER';
          }
        }
        dialogApp.dialog = dialogList;
      }, 500);
    }
  }
});

const showFriends = function(){
  // Calls function in 'user' to get the list and stock it on 'user.friendList'.
  user.getFriendsList();
  // Whaits 500 ms so the db returns the value.
  setTimeout(function(){
    var list = user.friendList;
    console.log(list)
    // Decrypts the friend's id before rendering.
    for(let i = 0; i < list.length; i++) {
      list[i] = crypt.keyCypherDecryption(list[i]);
    }
    homeApp.myFriends = list;
  }, 1000);
};

Vue.component('friend-list', {
  props: ['friend'],
  template:
    '<p>{{friend}}</p>'
});

const homeApp = new Vue({
  el:'#home',
  data:{
    me: debugUserConnected(),
    newFriend: '',
    myFriends: []//getFriendsList()
  },
  methods:{
    disconection: function(){
      document.cookie = 'conectedAs=; path=/';
      location.assign("index.html");
    },
    addFriend: function(){
      user.addFriend(this.newFriend);
    },

    startDialogWith: function(){
      console.log('I\'m Talking to you')
      //dialogApp.talkingTo =
    }
  }
});

try {
  showFriends();
} catch(err) {
  console.log('Not now');
}

export {dialogApp, homeApp}
















// Hold it down
