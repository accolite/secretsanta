(function () {    
    // Initialize Firebase
    var firebase = require("firebase");
    var config = {
        apiKey: "AIzaSyBMyZjbWf1J0-A677LvTRXQfb9t7a3y25o",
        authDomain: "secretsanta-accolite.firebaseapp.com",
        databaseURL: "https://secretsanta-accolite.firebaseio.com",
        projectId: "secretsanta-accolite",
        storageBucket: "",
        messagingSenderId: "993421622636"
    };
    firebase.initializeApp(config);
    exports.firebase = firebase;
})();