import Vue from 'vue'
import {user} from './scripts/users.js';

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

const homeApp = new Vue({
  el:'#home',
  methods:{
    disconection: function(){
      document.cookie = 'conectedAs=; path=/';
      location.assign("index.html");
    }
  }
});

Vue.component('conversation', {
  props: ['sentence'],
  template:
    '<p :class="sentence.from">{{sentence.sentence}}</p>'
});

const dialogApp = new Vue({
  el:'#dialog',
  data:{
    dialog: [{sentence:'Hello', from: 'ME'}, {sentence:'Hi', from: 'OTHER'}],
    message: '',
    talkingTo: ''
  },
  methods: {
    sendMessage: function(){
      var newMessage = {
        sentence: this.message,
        from: 'ME'
      }
      this.dialog.push(newMessage);
      this.message = '';
    },
    openDialog: function(){
      user.startDialog(this.talkingTo);
    }
  }
});



















// Hold it down
