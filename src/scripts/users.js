const PouchDB = require('pouchdb');
import {crypt} from './cryptage.js';
import {dialogApp} from './home.js'
const syncDom = document.getElementById('sync-wrapper');

// Load the cookie and informs the current page the connected user.
// 'userConectedAs' is necessary because 'user' is not yet defined.
var userConectedAs;
var cookieList = decodeURIComponent(document.cookie).split(';');
for(let i = 0; i < cookieList.length; i++){
  var cookie = cookieList[i];
  var list = cookie.split('=');
  if(list[0] === 'conectedAs'){
    userConectedAs = list[1];
  }
}

// Difines the data bases.
const db = new PouchDB('whattodo');
const remoteCouch = "http://127.0.0.1:5984/whattodo";


const updateData = function(){
  if(user.isTalkingTo){
    db.get(user.isTalkingTo, function (err, doc) {
      if(!err){
        var dialogList = doc.dialog;
        for(let i = 0; i < dialogList.length; i++) {
          if(dialogList[i].from === user.conectedAs){
            dialogList[i].from = 'ME';
          } else {
            dialogList[i].from = 'OTHER';
          }
        }
        dialogApp.dialog = dialogList;
      } else {
        console.log(err);
      }
    });
  }
};

// Calls a function every time the data base is modified.
db.changes({
  since: "now",
  live: true
}).on("change", updateData);

// Syncronises PouchDB and CouchDB. DO NOT TOUCH.
function sync(){
  syncDom.setAttribute('data-sync-state', 'syncing');
  var opts = {live: true};
  db.replicate.to(remoteCouch, opts, syncError);
  db.replicate.from(remoteCouch, opts, syncError);
}

// Syncronises PouchDB and CouchDB. DO NOT TOUCH.
function syncError(){
  syncDom.setAttribute('data-sync-state', 'error');
}

// 'user' handles everything related to the data base and the user's data.
// 'user' is exported and can be accessed from any js file.
const user = {
  conectedAs: userConectedAs,
  isTalkingTo: '',
  dialog: [],
  friendList: [],
  isConected: false,
  createUser: function(newUser){
    db.put(newUser);
  },
  addFriend: function(friend){
    const me = crypt.keyCypher(this.conectedAs);
    db.get(me, (err, doc) => {
      if(doc.friendsID.indexOf(crypt.keyCypher(friend)) < 0) {
        // TO DO: Before pushing the data check if 'friend' exisist.
        var newFriend = crypt.keyCypher(friend);
        doc.friendsID.push(newFriend);
        db.put(doc);
        console.log(friend + ' was added to your friend list.');
        db.get(crypt.keyCypher(friend), (err, doc) => {
          doc.friendsID.push(me);
          db.put(doc);
        });
      } else {
        console.log(friend + ' is already your friend');
      }
    });
  },
  getFriendsList: function(){
    // Crypts the user's id and get it's 'friendsID'.
    const me = crypt.keyCypher(this.conectedAs);
    db.get(me, (err, doc) => {
      if(!err){
        user.friendList = doc.friendsID;
      }
    });
    /*db.get(me).then(function(me){
      user.friendList = doc.friendsID;
    })*/
  },
  logInCheck: function(tryingToConnectAs){
    db.get(tryingToConnectAs.id,(err, doc) => {
      if(!err){
        // Check if the given password matches the user's password.
        if(tryingToConnectAs.password === doc.password){
          this.conectedAs = tryingToConnectAs.id;
          this.isConected = true;
          // Will create a cookie with the user's id and an expiration date.
          document.cookie = 'conectedAs=' + crypt.keyCypherDecryption(tryingToConnectAs.id) + '; expires=Thu, 4 Jan 2018 12:00:00 UTC; path=/';
          // Changes the HTML page.
          location.assign("home.html");
        } else {
          // If the password don't match the user's, you won't be able to connect.
          // TO DO: Insted of logging it, show it on the page.
          console.log("Wrong password");
          this.isConected = false;
        }
      } else {
        // If the user id isn't in the db, you won't be able to connect.
        // TO DO: Insted of logging it, show it on the page.
        console.log("user not found");
        this.isConected = false;
      }
    });
  },
  posting: (post, user) => {
    // It adds the post id to the user's 'postsID' list.
    db.get(user, (err, doc) => {
      if(!err){
        doc.postsID.push(post);
        db.put(doc);
      } else {
        console.log(err);
      }
    });
  },
  startDialog: function(talkingTo) {
    const Me = crypt.keyCypher(this.conectedAs);
    db.get(Me, (err, doc) =>{
      if(!err){
        // Check if he has already started a dialog with me or I have started a dialog with him.
        const tryID = crypt.keyCypher(talkingTo) + 'AND' + doc._id;
        const checkID = doc._id + 'AND' + crypt.keyCypher(talkingTo);
        // If it's true the tryID will be in doc.dialogID
        if(doc.dialogID.indexOf(tryID) >= 0){
          db.get(tryID, (err, doc) => {
            if(!err){
              user.isTalkingTo = doc._id;
              user.dialog = doc.dialog;
            } else {
              console.log(err)
            }
          });
        // Check if I have started a dialog with him.
        } else if (doc.dialogID.indexOf(checkID) >= 0) {
          db.get(checkID, (err, doc) => {
            if(!err){
              user.isTalkingTo = doc._id;
              user.dialog = doc.dialog;
            } else {
              console.log(err)
            }
          });
        } else {
          // If the dialog doesn't exisists it'll create one.
          this.createNewDialog(doc._id, crypt.keyCypher(talkingTo));
        }
      } else {
        console.log(err);
      }
    });
  },
  createNewDialog(me, talkingTo){
    const id = me + 'AND' + talkingTo;
    const dialog = {
      _id: id,
      dialog: []
    };
    db.put(dialog);
    // ABOVE: Creates a dialog and add it to the db.
    // BELOW: Get my db file and add the dialog to my dialogID
    db.get(me,(err, doc) => {
      if(!err){
        doc.dialogID.push(id);
        db.put(doc);
      }
    });
    // Put the dialog inside 'talkingTo' db file
    db.get(talkingTo, (err,doc) => {
      if(!err){
        doc.dialogID.push(id);
        db.put(doc);
      }
    });
  },
  sendMessage: function(message){
    // Get the conversation.
    db.get(this.isTalkingTo, (err, doc) => {
      if(!err){
        // Pushes the message into the dataBase,
        // changes the 'from' element and put it into this page dialog.
        doc.dialog.push(message);
        db.put(doc);
        message.from = 'ME';
        this.dialog.push(message);
      } else {
        console.log(err);
      }
    });
  }
};

// DO NOT TOUCH THIS.
if(remoteCouch){
  sync();
}

console.log("user.js loaded.");
export {user}
