(function () {
    // Initialize Firebase
    var firebase = require("firebase");
    // var config = {
    //     apiKey: "AIzaSyBMyZjbWf1J0-A677LvTRXQfb9t7a3y25o",
    //     authDomain: "secretsanta-accolite.firebaseapp.com",
    //     databaseURL: "https://secretsanta-accolite.firebaseio.com",
    //     projectId: "secretsanta-accolite",
    //     storageBucket: "",
    //     messagingSenderId: "993421622636"
    // };
    // var config = {
    //     apiKey: 'AIzaSyBsAyfyywpfbFyjCLNZP8gMZJU08ytjsWA',
    //     authDomain: 'secretsanta-19ed6.firebaseapp.com',
    //     databaseURL: 'https://secretsanta-19ed6.firebaseio.com',
    //     storageBucket: 'secretsanta-19ed6.appspot.com'
    //   };
    var config = {
        apiKey: "AIzaSyA0W1VRYFavR8WPHMzOVirlNKc4TbDCAdA",
        authDomain: "secretsantaprod.firebaseapp.com",
        databaseURL: "https://secretsantaprod.firebaseio.com",
        projectId: "secretsantaprod",
        storageBucket: "secretsantaprod.appspot.com",
        messagingSenderId: "1088657152665"
      };
    firebase.initializeApp(config);
    exports.firebase = firebase;
})();
