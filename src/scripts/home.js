import Vue from 'vue'
import {user} from './users.js';
import {crypt} from './cryptage.js';

try{
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
  }
} catch(err) {
  console.log('Not connected');
}

function debugUserConnected() {
  try {
    var me = user.conectedAs;
    return me;
  } catch(err) {
    var me = ' ';
    return me
  }
};

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
      setTimeout(function(){
        var elem = document.getElementById('dialog-scrolled');
        elem.scrollTop = elem.scrollHeight;
      }, 100);
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
        setTimeout(function(){
          var elem = document.getElementById('dialog-scrolled');
          elem.scrollTop = elem.scrollHeight;
        }, 100);
      }, 500);
    }
  }
});

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function returnHours(d) {
    var h = addZero(d.getHours());
    var m = addZero(d.getMinutes());
    var s = addZero(d.getSeconds());
    return(h + ":" + m + ":" + s);
}

const showFriends = function() {
  // Calls function in 'user' to get the list and stock it on 'user.friendList'.
  user.getFriendsList();
  // Whaits 500 ms so the db returns the value.
  setTimeout(function(){
    var list = user.friendList;
    // Decrypts the friend's id before rendering.
    for(let i = 0; i < list.length; i++) {
      list[i] = crypt.keyCypherDecryption(list[i]);
    }
    homeApp.myFriends = list;
    homeApp.allPosts = user.allPosts;
    document.getElementById('posts').className = 'to-show';
    document.getElementById('friend-div').className = 'to-the-right';
    document.getElementById('dialog').className = 'moto';
    document.getElementById('home').className = 'to-show';
    var friendScroll = document.getElementById("friends-scrolled");
    friendScroll.scrollTop = friendScroll.scrollHeight;
    var postScroll = document.getElementById('posts-scrolled');
    postScroll.scrollTop = postScroll.scrollHeight;
  }, 1500);
};

Vue.component('friend-list', {
  props: ['friend'],
  template:
    '<p>{{friend}}</p>'
});

Vue.component('post-list', {
  props: ['post'],
  template:
    '<div class="post-div">\
    <p class="post-text">{{post.text}}</p>\
    <p class="post-info">Posté le {{post.date}} par {{post.by}} à {{post.time}}</p>\
    </div>'
});

const homeApp = new Vue({
  el:'#home',
  data:{
    me: debugUserConnected(),
    newFriend: '',
    myFriends: [],//getFriendsList()
    newPost: '',
    allPosts: []
  },
  methods:{
    disconection: function(){
      document.cookie = 'conectedAs=; path=/';
      location.assign("index.html");
    },
    addFriend: function(){
      user.addFriend(this.newFriend);
      showFriends();
    },
    post: function(){
      var me = this.me;
      var postDate = new Date();
      var id = me + '/' + postDate;
      var time = returnHours(postDate);
      var options = {weekday: "long", year: "numeric", month: "numeric", day: "numeric"};
      var willPost = {
        _id: crypt.keyCypher(id),
        postText: crypt.keyCypher(this.newPost),
        by: crypt.keyCypher(me),
        date: crypt.keyCypher(postDate.toLocaleDateString("fr-FR", options)),
        time: crypt.keyCypher(time)
      };
      user.posting(willPost, crypt.keyCypher(me));
      var temporaryPostAddition = {
        text: this.newPost,
        time: time,
        by: me,
        date: postDate.toLocaleDateString("fr-FR", options)
      }
      this.allPosts.splice(0,0,temporaryPostAddition);
      this.newPost = ' ';
    }
  }
});

try {
  user.getAllPosts();
  showFriends();
} catch(err) {
  console.log('Not now');
}

export {dialogApp, homeApp}
