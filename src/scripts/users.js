const PouchDB = require('pouchdb');
import {crypt} from './cryptage.js';
const syncDom = document.getElementById('sync-wrapper');

const db = new PouchDB('whattodo');
const remoteCouch = "http://127.0.0.1:5984/whattodo";


function sync(){
  syncDom.setAttribute('data-sync-state', 'syncing');
  var opts = {live: true};
  db.replicate.to(remoteCouch, opts, syncError);
  db.replicate.from(remoteCouch, opts, syncError);
}

function syncError(){
  syncDom.setAttribute('data-sync-state', 'error');
}

const user = {
  conectedAs: "",
  isConected: false,
  createUser: function(newUser){
    db.put(newUser);
  },
  logInCheck: function(tryingToConnectAs){
    db.get(tryingToConnectAs.id,(err, doc) => {
      if(!err){
        if(tryingToConnectAs.password === doc.password){
          this.conectedAs = tryingToConnectAs.id;
          this.isConected = true;
          document.cookie = 'conectedAs=' + crypt.keyCypherDecryption(tryingToConnectAs.id) + '; expires=Thu, 4 Jan 2018 12:00:00 UTC; path=/';
          location.assign("home.html");
        } else {
          console.log("Wrong password");
          this.isConected = false;
        }
      } else {
        console.log("user not found");
        this.isConected = false;
      }
    });
  },
  posting: (post, user) => {
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
    const Me = crypt.keyCypher(this.conectedAs)
    db.get(Me, (err,doc) =>{
      if(!err){
        // Check if he has already started a dialog with me or I have started a dialog with him.
        const tryID = crypt.keyCypher(talkingTo) + 'AND' + doc._id;
        const checkID = doc._id + 'AND' + crypt.keyCypher(talkingTo);
        // If it's true the tryID will be in doc.dialogID
        if(doc.dialogID.indexOf(tryID) >= 0){
          console.log('it exists');
        // Check if I have started a dialog with him.
        } else if (doc.dialogID.indexOf(checkID) >= 0) {
          console.log('it exists');
        } else {
          console.log('it doesn t');
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
    // Put the dialog inside talkingTo db file
    db.get(talkingTo, (err,doc) => {
      if(!err){
        doc.dialogID.push(id);
        db.put(doc);
      }
    });
  }
};

if(remoteCouch){
  sync();
}

console.log("user.js loaded.");
export {user}
