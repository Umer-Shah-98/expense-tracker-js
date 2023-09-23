// Initialize Firebase
var config = {
  apiKey: "AIzaSyAHv0JtgofOgOOdq0PvfrLTZfdjHZ53Rkg",
  authDomain: "expense-tracker-d206d.firebaseapp.com",
  projectId: "expense-tracker-d206d",
  storageBucket: "expense-tracker-d206d.appspot.com",
  messagingSenderId: "1016775174605",
  appId: "1:1016775174605:web:3b3de562034e721c73bc84",
};
firebase.initializeApp(config);

// make auth and firestore references
 const auth = firebase.auth();
 const db = firebase.firestore();

// update firestore settings
db.settings({ timestampsInSnapshots: true });
