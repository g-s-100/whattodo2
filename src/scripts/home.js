import Vue from 'vue'
const PouchDB = require('pouchdb')
const syncDom = document.getElementById('sync-wrapper');

const db = new PouchDB('website');
const remoteCouch = "http://127.0.0.1:5984/website";

//––––––––––––––––––––––––––|Start setup|–––––––––––––––––––––––––––––––––––––––

var userConectedAs = '';
var connected = false;
var cookieList = decodeURIComponent(document.cookie).split(';');
for(let i = 0; i < cookieList.length; i++){
  var cookie = cookieList[i];
  var list = cookie.split('=');
  if(list[0] === 'conectedAs'){
    userConectedAs = list[1];
  }
  if (userConectedAs.length > 0) {
    connected = true;
  }
}

// Gets all the differents catégories in the DB.
// TODO: complete the function.
function getAllCategories(what) {
  if(what === 'exercice'){
    return ['Limites', 'Dérivées', 'Gradient', 'Nombres complexes']
  } else {
    return ['Limites', 'Dérivées']
  }
}

// –––––––––––––––––––––––––––|DataBase Setup|––––––––––––––––––––––––––––––––––

// Creates a DB setup if one does not exist.
db.get('DBSETUP', (err, doc) => {
  if(err) {
    var setup = {
      _id: 'DBSETUP',
      categories: [
        {
          nom: 'Tout',
          état: 'confirmé',
          prerequis:['aucun'],
          theoryID:[],
          exerciceID:[]
        }
      ],
      categoriesNames: ['Tout']
    }
    db.put(setup);
  }
});

// Is called every time the DB changes. Does nothing for the moment.
function updateData () {
  console.log('changed')
}
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

// DO NOT TOUCH THIS.
if(remoteCouch){
  sync();
}
// ––––––––––––––––––––––––––––|Components|––––––––––––––––––––––––––––––––––––––––

// Show all the exercices.
Vue.component("exercice-list", {
  props: ["exercice", "number", "addcomment", "like"],
  template:
  "<div class='jumbotron'>\
    <div class='row'>\
      <div class='col-sm-9'>\
        <div class='panel panel-default panel-display'>\
          <div class='panel-heading heading-display'>{{exercice.title}}</div>\
          <iframe frameborder='0' width='100%' height='500' :src='exercice.imgSource'></iframe>\
          <span class='footer-font margin3'>Likes: {{exercice.likes}}  –  Dislikes: {{exercice.dislikes}}</span>\
          <div class='btn-group'><button class='btn btn-default btn-lg btn-like' @click='like(true, number)'>Like</button><button class='btn btn-default btn-lg btn-like' @click='like(false, number)'>Dislike</button></div>\
          <div class='panel-footer footer-font'>{{exercice.comment}}</div>\
        </div>\
      </div>\
      <div class='col-sm-3'>\
        <div class='panel panel-list'></div>\
        <textarea class='form-control' type='text' :id='number'></textarea><button class='btn btn-default btn-sm' @click='addcomment(number)'>Ajouter commentaire</button>\
      </div>\
    </div>\
  </div> "
})

// Show all the theory.
Vue.component("theory-list", {
  props: ["theory", "number", "addcomment", 'like'],
  template:
  "<div class='jumbotron'>\
    <div class='row'>\
      <div class='col-sm-9'>\
        <div class='panel panel-default panel-display'>\
          <div class='panel-heading heading-display'>{{theory.title}}</div>\
          <iframe frameborder='0' width='100%' height='500' :src='theory.imgSource'></iframe>\
          <span class='footer-font margin3'>Likes: {{theory.likes}} – Dislikes: {{theory.dislikes}}</span>\
          <div class='btn-group'><button class='btn btn-default btn-lg btn-like' @click='like(true, number)'>Like</button><button class='btn btn-default btn-lg btn-like' @click='like(false, number)'>Dislike</button></div>\
          <div class='panel-footer footer-font'>{{theory.comment}}</div>\
        </div>\
      </div>\
      <div class='col-sm-3'>\
        <div class='panel panel-list'></div>\
        <textarea class='form-control' type='text' :id='number'></textarea><button class='btn btn-default btn-sm' @click='addcomment(number)'>Ajouter commentaire</button>\
      </div>\
    </div>\
  </div> "
})

// Profil
// A completer |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Vue.component('profil', {
  props: ['user', 'myexercices', 'mytheory', 'mylikedex', 'mylikedth'],
  template:
    '<div class="jumbotron">\
      <div class="row">\
        <div class="col-sm-8">\
          <h1>{{user}}</h1>\
          <div class="btn-group">\
            <button class="btn btn-default btn-lg btn-blue" @click="myexercices">Mes exercices</button>\
            <button class="btn btn-default btn-lg btn-blue" @click="mytheory">Ma théorie</button>\
            <button class="btn btn-default btn-lg btn-blue" @click="mylikedex">Mes Ex. favoris</button>\
            <button class="btn btn-default btn-lg btn-blue" @click="mylikedth">Ma Th. favorite</button>\
          </div>\
        </div>\
        <div class="col-sm-2">\
          <div class="btn-group-vertical panel profil-panel">\
            <button class="btn btn-default btn-lg no-margin">catégorie1</button>\
            <button class="btn btn-default btn-lg no-margin">catégorie2</button>\
            <button class="btn btn-default btn-lg no-margin">catégorie3</button>\
            <button class="btn btn-default btn-lg no-margin">catégorie4</button>\
            <button class="btn btn-default btn-lg no-margin">catégorie5</button>\
            <button class="btn btn-default btn-lg no-margin">catégorie1</button>\
            <button class="btn btn-default btn-lg no-margin">catégorie2</button>\
            <button class="btn btn-default btn-lg no-margin">catégorie3</button>\
            <button class="btn btn-default btn-lg no-margin">catégorie4</button>\
            <button class="btn btn-default btn-lg no-margin">catégorie5</button>\
          </div>\
        </div>\
      </div>\
    </div>'
})

// ––––––––––––––––––––––––––––|App Setup|–––––––––––––––––––––––––––––––––––––––––

const App = new Vue({
  el:'#app',
  data: {
    isLogged: connected,
    user: userConectedAs,
    userInput: '',
    passwordInput: '',
    newUserName: '',
    newUserID: '',
    newUserPassword: '',
    newExerciceTitle: '',
    newExerciceComment: '',
    newExerciceCategory: '',
    newTheoryTitle: '',
    newTheoryComment: '',
    newTheoryCategory: '',
    selectedCategory: '',
    selectedTheoryCategory: '',
    showExercice: false,
    showTheory: false,
    isAdding: false,
    displayProfile: false,
    isConnecting: true,
    home: true,
    contentToShow: [],
    allExCategories: getAllCategories('exercice'),
    allThCategories: getAllCategories('théorie')
  },
  methods:{
    // Connect as a user if it exists.
    logIn: function () {
      db.get(this.userInput, (err,doc) => {
        // Check if the user exists in the DB.
        if(!err){
          // Check if the password entered maches the user password.
          if(this.passwordInput === doc.password) {
            this.user = this.userInput;
            this.isLogged = true;
            document.cookie = 'conectedAs=' + this.userInput + '; expires=Thu, 4 Jan 2018 12:00:00 UTC; path=/';
            this.userInput = '';
            this.passwordInput = '';
          } else {
            // Sends an error to the user.
            alert('Impossible de se connecter; Veuiller verifier votre ID et votre Mot de passe.');
          }
        } else {
          alert('Impossible de se connecter; Veuiller verifier votre ID et votre Mot de passe.');
        }
      });
    },
    createNew: function(){
      this.isConnecting = !this.isConnecting
    },
    disconnect: function(){
      document.cookie = 'conectedAs=; path=/';
      if(this.isLogged){
        this.displayProfile = false;
        this.contentToShow = [];
        this.showExercice = false;
        this.showTheory = false;
        this.isAdding = false;
        this.isLogged = !this.isLogged;
        this.user= '';
      }
    },
    // Create new user on the DB and logs in. || Changes to the user are done here ||
    createUser: function () {
      db.get(this.newUserID, (err, doc) => {
        if(!err) {
          // If the user already exists send a warning.
          alert('Cet identifiant est dejà utilisé.')
        } else {
          // If the user doesn't exists it checks that the password has the minimun length.
          if(this.newUserPassword.length >= 6 && this.newUserID.length >= 4){
            var user = this.newUserID
            // User basic data.
            var newUser = {
              _id: this.newUserID,
              password: this.newUserPassword,
              info:{
                name: this.newUserName
              },
              myTheoryID: [],
              myExercicesID: [],
              likedTheoryID: [],
              dislikedTheoryID: [],
              likedExercicesID: [],
              dislikedExercicesID: [],
              myAnswersID: []
            };
            // Adds the user to the database and logs in.
            db.put(newUser);
            this.isLogged = true;
            this.user = user;
            console.log('Welcome new user!');
          } else {
            // Send a warning because the chosen password is to short.
            alert('Le mot de passe saisi est trop court. Veuiller choisir un mot de passe de au moins 6 caractères.')
          }
        }
      });
    },
    // Create an exercice and add it to the DB.
    postExercice: function () {
      // These variables help to set up the imaga file data.
      var imageFile = document.getElementById("image-exercice").files[0];
      var date = new Date().toISOString();
      var exerciceID = this.user + 'exercice' + date;
      // Creates an url to the image file.
      var imgSource = function (blob) {
          console.log(imageFile.name);
          var url = remoteCouch + "/" + blob + "/exercice.pdf";
          return(url);
      };
      // Creates the exercice before putting it into the DB. Changes to exercices can be done here.
      var newExercice = {
        _id: exerciceID,
        title: this.newExerciceTitle,
        imgSource: imgSource(exerciceID),
        comment: this.newExerciceComment,
        category: this.newExerciceCategory,
        likes: 0,
        dislikes: 0,
        answersID: [],
        commentsID: [],
        _attachments: {
          "exercice.pdf": {
            content_type: imageFile.type,
            data: imageFile
          }
        }
      };
      // Associates the user with the ex data.
      db.get(this.user, (err, doc) => {
        if(!err) {
          doc.myExercicesID.push(exerciceID);
          db.put(doc);
          db.put(newExercice);
          db.get('DBSETUP', (err, doc) => {
            for (var i = 0; i < doc.categories.length; i++) {
              if(doc.categories[i].nom === newExercice.category) {
                doc.categories[i].exerciceID.splice(0,0,newExercice._id);

              }
              if(doc.categories[i].nom === 'Tout') {
                doc.categories[i].exerciceID.splice(0,0,newExercice._id);

              }
            }
            db.put(doc)
          });
        } else {
          console.log('user not found.');
        }
      });
    },
    // Create the theory and adds it to the DB.
    postTheory: function () {
      // These variables help to set up the imaga file data.
      var imageFile = document.getElementById("image-theory").files[0];
      var date = new Date().toISOString();
      var theoryID = this.user + 'theory' + date;
      // Creates an url to the image file.
      var imgSource = function (blob) {
          var url = remoteCouch + "/" + blob + "/theory.pdf";
          return(url);
      };
      // Creates the theory before putting it into the DB. Changes to theory can be done here.
      var newTheory = {
        _id: theoryID,
        title: this.newTheoryTitle,
        imgSource: imgSource(theoryID),
        comment: this.newTheoryComment,
        category: this.newTheoryCategory,
        likes: 0,
        dislikes: 0,
        commentsID: [],
        _attachments: {
          "theory.pdf": {
            content_type: imageFile.type,
            data: imageFile
          }
        }
      };
      // Associates the user with the theory data.
      db.get(this.user, (err, doc) => {
        if(!err) {
          doc.myTheoryID.push(theoryID);
          db.put(doc);
          db.put(newTheory);
          db.get('DBSETUP', (err, doc) => {
            for (var i = 0; i < doc.categories.length; i++) {
              if(doc.categories[i].nom === newTheory.category) {
                doc.categories[i].theoryID.splice(0,0,newTheory._id);

              }
              if(doc.categories[i].nom === 'Tout') {
                doc.categories[i].theoryID.splice(0,0,newTheory._id);

              }
            }
            db.put(doc)
          });
        } else {
          console.log('user not found.');
        }
      });
    },
    // Selects the categories.
    getExercices: function() {
      this.contentToShow = [];
      this.showTheory = false;
      this.displayProfile = false;
      this.isAdding = false;
      this.showExercice = true;
      this.home = false;
      db.get('DBSETUP', (err, doc) => {
        if(!err) {
          for (var i = 0; i < doc.categories.length; i++) {
            if(doc.categories[i].nom === this.selectedCategory) {
              for (var j = 0; j < doc.categories[i].exerciceID.length; j++) {
                db.get(doc.categories[i].exerciceID[j], (err,doc) =>{
                  if (!err) {
                    this.contentToShow.push(doc);
                  } else {
                    console.log('Error N°2');
                  }
                });
              }

            }
          }
        } else {
          console.log('Error HAHAHAHAHAHA!');
        }
      });
      this.selectedTheoryCategory = '';
    },
    // Selects the theories.
    getTheory: function() {
      this.contentToShow = [];
      this.showExercice = false;
      this.displayProfile = false;
      this.showTheory = true;
      this.isAdding = false;
      this.home = false;
      db.get('DBSETUP', (err, doc) => {
        if(!err) {
          for (var i = 0; i < doc.categories.length; i++) {
            if(doc.categories[i].nom === this.selectedTheoryCategory) {
              for (var j = 0; j < doc.categories[i].theoryID.length; j++) {
                db.get(doc.categories[i].theoryID[j], (err,doc) =>{
                  if (!err) {
                    this.contentToShow.push(doc);
                  } else {
                    console.log('Error N°2');
                  }
                });
              }

            }
          }
        } else {
          console.log('Error');
        }
      });
      this.selectedCategory = '';
    },
    addComment: function(number) {
      var comment = document.getElementById(number).value;
      console.log(comment);
    },
    // Add the ex ID to the user's ID list and controls the like/dislike number.
    like: function(ok, number){
      var content = this.contentToShow[number];
      db.get(this.user, (err, doc) => {
        if(!err) {
          if(ok) {
            var positionInArray = doc.dislikedExercicesID.indexOf(content._id);
            if (positionInArray >= 0) {
              doc.dislikedExercicesID.splice(positionInArray, 1);
              doc.likedExercicesID.splice(0, 0, content._id);
              db.get(content._id, (err, doc) => {
                if(!err) {
                  this.contentToShow[number].likes += 1;
                  this.contentToShow[number].dislikes -= 1;
                  var likesNb = doc.likes + 1
                  doc.likes = likesNb;
                  if (doc.dislikes > 0) {
                    var dislikesNb = doc.dislikes - 1;
                    doc.dislikes = dislikesNb;
                  }
                  db.put(doc);
                } else {
                  console.log(err)
                }
              });
            }
            positionInArray = doc.likedExercicesID.indexOf(content._id);
            if (positionInArray < 0) {
              doc.likedExercicesID.splice(0, 0, content._id);
              db.get(content._id, (err, doc) => {
                if(!err) {
                  this.contentToShow[number].likes += 1;
                  var likesNb = doc.likes + 1
                  doc.likes = likesNb;
                  db.put(doc);
                } else {
                  console.log(err)
                }
              });
            }
          } else {
            var positionInArray = doc.likedExercicesID.indexOf(content._id);
            if (positionInArray >= 0) {
              doc.likedExercicesID.splice(positionInArray, 1);
              doc.dislikedExercicesID.splice(0, 0, content._id);
              db.get(content._id, (err, doc) => {
                if(!err) {
                  this.contentToShow[number].likes -= 1;
                  this.contentToShow[number].dislikes += 1;
                  var dislikesNb = doc.dislikes + 1;
                  doc.dislikes = dislikesNb;
                  if (doc.likes > 0) {
                    var likesNb = doc.likes - 1;
                    doc.likes = likesNb;
                  }
                  db.put(doc);
                }
              });
            }
            positionInArray = doc.dislikedExercicesID.indexOf(content._id);
            if (positionInArray < 0) {
              doc.dislikedExercicesID.splice(0, 0, content._id);
              db.get(content._id, (err, doc) => {
                if(!err) {
                  this.contentToShow[number].dislikes += 1;
                  var dislikesNb = doc.dislikes + 1;
                  doc.dislikes = dislikesNb;
                  db.put(doc);
                }
              });
            }
          }
          db.put(doc)
        } else {
          alert('Vous devez d\'abord vous connecter.')
        }
      });
    },
    likeTh: function(ok, number){
      var content = this.contentToShow[number];
      db.get(this.user, (err, doc) => {
        if(!err) {
          if(ok) {
            var positionInArray = doc.dislikedTheoryID.indexOf(content._id);
            if (positionInArray >= 0) {
              doc.dislikedTheoryID.splice(positionInArray, 1);
              doc.likedTheoryID.splice(0, 0, content._id);
              db.get(content._id, (err, doc) => {
                if(!err) {
                  this.contentToShow[number].likes += 1;
                  this.contentToShow[number].dislikes -= 1;
                  var likesNb = doc.likes + 1
                  doc.likes = likesNb;
                  if (doc.dislikes > 0) {
                    var dislikesNb = doc.dislikes - 1;
                    doc.dislikes = dislikesNb;
                  }
                  db.put(doc);
                } else {
                  console.log(err)
                }
              });
            }
            positionInArray = doc.likedTheoryID.indexOf(content._id);
            if (positionInArray < 0) {
              doc.likedTheoryID.splice(0, 0, content._id);
              db.get(content._id, (err, doc) => {
                if(!err) {
                  this.contentToShow[number].likes += 1;
                  var likesNb = doc.likes + 1
                  doc.likes = likesNb;
                  db.put(doc);
                } else {
                  console.log(err)
                }
              });
            }
          } else {
            var positionInArray = doc.likedTheoryID.indexOf(content._id);
            if (positionInArray >= 0) {
              doc.likedTheoryID.splice(positionInArray, 1);
              doc.dislikedTheoryID.splice(0, 0, content._id);
              db.get(content._id, (err, doc) => {
                if(!err) {
                  this.contentToShow[number].likes -= 1;
                  this.contentToShow[number].dislikes += 1;
                  var dislikesNb = doc.dislikes + 1;
                  doc.dislikes = dislikesNb;
                  if (doc.likes > 0) {
                    var likesNb = doc.likes - 1;
                    doc.likes = likesNb;
                  }
                  db.put(doc);
                }
              });
            }
            positionInArray = doc.dislikedTheoryID.indexOf(content._id);
            if (positionInArray < 0) {
              doc.dislikedTheoryID.splice(0, 0, content._id);
              db.get(content._id, (err, doc) => {
                if(!err) {
                  this.contentToShow[number].dislikes += 1;
                  var dislikesNb = doc.dislikes + 1;
                  doc.dislikes = dislikesNb;
                  db.put(doc);
                }
              });
            }
          }
          db.put(doc)
        } else {
          alert('Vous devez d\'abord vous connecter.')
        }
      });
    },
    addStuff: function() {
      if (this.isLogged) {
        this.isAdding = !this.isAdding
        this.contentToShow = [];
        this.showExercice = false;
        this.showTheory = false;
        this.displayProfile = false;
        this.selectedCategory = '';
        this.selectedTheoryCategory = '';
        if(this.isAdding) {
          this.home = false;
        } else {
          this.home = true;
        }
      } else {
        alert('Vous devez d\'abord vous connecter.')
      }
    },
    showProfile: function() {
      if(this.isLogged){
        this.displayProfile = !this.displayProfile;
        this.contentToShow = [];
        this.showExercice = false;
        this.showTheory = false;
        this.isAdding = false;
        this.home = !this.home;
        this.selectedCategory = '';
        this.selectedTheoryCategory = '';
        if(this.displayProfile) {
          this.home = false;
        } else {
          this.home = true;
        }
      } else {
        alert('Vous devez d\'abord vous connecter.')
      }
    },
    getMyExercices: function() {
      this.contentToShow = [];
      this.showTheory = false;
      this.isAdding = false;
      this.showExercice = true;
      db.get(this.user, (err, doc) => {
        if(!err) {
          for (var i = 0; i < doc.myExercicesID.length; i++) {
            db.get(doc.myExercicesID[i], (err,doc) =>{
              if (!err) {
                this.contentToShow.push(doc);
              }
            });
          }
        }
      });
    },
    getMyTheory: function() {
      this.contentToShow = [];
      this.showTheory = true;
      this.isAdding = false;
      this.showExercice = false;
      db.get(this.user, (err, doc) => {
        if(!err) {
          for (var i = 0; i < doc.myTheoryID.length; i++) {
            db.get(doc.myTheoryID[i], (err,doc) =>{
              if (!err) {
                this.contentToShow.push(doc);
              }
            });
          }
        }
      });
    },
    getMyLikedTh: function() {
      this.contentToShow = [];
      this.showTheory = true;
      this.isAdding = false;
      this.showExercice = false;
      db.get(this.user, (err, doc) => {
        if(!err) {
          for (var i = 0; i < doc.likedTheoryID.length; i++) {
            db.get(doc.likedTheoryID[i], (err,doc) =>{
              if (!err) {
                this.contentToShow.push(doc);
              }
            });
          }
        }
      });
    },
    getMyLikedEx: function() {
      this.contentToShow = [];
      this.showTheory = false;
      this.isAdding = false;
      this.showExercice = true;
      db.get(this.user, (err, doc) => {
        if(!err) {
          for (var i = 0; i < doc.likedExercicesID.length; i++) {
            db.get(doc.likedExercicesID[i], (err,doc) =>{
              if (!err) {
                this.contentToShow.push(doc);
              }
            });
          }
        }
      });
    }
  // End of methods.
  }
});














console.log('home.js loaded')
