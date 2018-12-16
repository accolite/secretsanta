var Excel = require('exceljs');
var firebase = require('./firebase_config').firebase;
var _ = require("underscore");
var parseXlsx = require('excel');
var express = require("express");
var sendEmail = require('./send_email').sendEmail;
var app = express();
var http = require('http').Server(app).listen(4000);
var upload = require('express-fileupload');
var storeInFirebase = require('./firebase_storage').storeInFirebase;
var reportGenerator = require('./scheduleReportGeneration').reportGenerator;
var cron = require('node-cron');
var bodyParser = require('body-parser');

var employees = [];
var employeeGroups = {};
var employeesCopyForSanta = [];
var employeesCopyForChild = [];
var mappedEmployeesList = [];
var id = 0;
console.log("Server Started!");
app.use(upload());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost');
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get("/testRead", (req, res) => {
    // read from firebase
    var users = firebase.database().ref('test');
    console.log('reading');
    users.on('value', function (snapshot) {
        console.log('users ', snapshot.val());
        res.send('users ' + snapshot.val());
    });
});

app.get("/api", (req, res) => {
    res.sendFile(__dirname+"/index.html");
});

app.post("/api", (req, res) => {
    if(req.files){
        // console.log(req.files.filename.data.toString('utf16'));
        var file = req.files.filename;
        var filename = file.name;

        employees = [];
        employeeGroups = {};
        employeesCopyForSanta = [];
        employeesCopyForChild = [];
        mappedEmployeesList = [];
        file.mv("./"+filename, (err) => {
            if(err)
            {
                console.log('cannot move file');
            }
            else{
                console.log('File has been uploaded ' + filename);
                 parseXlsx("./"+filename, function(err, data) {
                    if(err) throw err;
                      // data is an array of arrays
                    // console.log(data);
                    _.map(data, (curr) => {
                        if(curr[0] == "")
                        {
                            return;
                        }
                        employeeData = {};
                        employeeData.emailId = curr[0]
                        employeeData.name = curr[1];
                        employeeData.mobileNo = curr[2];
                        employeeData.shift = curr[3] ? curr[3] : "";
                        employeeData.company = curr[6] ? curr[6] : "";
                        employeeData.location = curr[5] ? curr[5] : "";
                        employeeData.teamName = curr[4] ? curr[4] : "";
                        employeeData.id = 0;
                        employeeData.active = curr[7] ? curr[7] : "";
                        employeeData.room = {"roomAsSanta" : "", 'roomAsChild' : ""};
                        employees.push(employeeData);
                    });
                    id = 0;
                    groupEmployees();
                    createRooms();
                    storeInFirebase(mappedEmployeesList, firebase);
                }); 
            }
        });

        function groupEmployees() {
            for(var i = 0;i<employees.length; i++) {
                var employee = employees[i];
                if(!employeeGroups[employee.active+"_"+employee.location+"_"+employee.company]) {
                    employeeGroups[employee.active+"_"+employee.location+"_"+employee.company]=[];
                }
                employeeGroups[employee.active+"_"+employee.location+"_"+employee.company].push(employee);
            }
            for (var array in employeeGroups) {
                if (employeeGroups.hasOwnProperty(array)) {
                    mapSantaChild(employeeGroups[array]);
                }
            }
            console.log("employees mapped with santas and children");
        };
        Object.compare = function (obj1, obj2) {
            //Loop through properties in object 1
            for (var p in obj1) {
                //Check property exists on both objects
                if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;

                switch (typeof (obj1[p])) {
                    //Deep compare objects
                    case 'object':
                        if (!Object.compare(obj1[p], obj2[p])) return false;
                        break;
                    //Compare function code
                    case 'function':
                        if (typeof (obj2[p]) == 'undefined' || (p != 'compare' && obj1[p].toString() != obj2[p].toString())) return false;
                        break;
                    //Compare values
                    default:
                        if (obj1[p] != obj2[p]) return false;
                }
            }

            //Check object 2 for any extra properties
            for (var p in obj2) {
                if (typeof (obj1[p]) == 'undefined') return false;
            }
            return true;
        };

        function mapSantaChild(group) {
            var employeesCopyForSanta=[], employeesCopyForChild=[];
            employeesCopyForSanta = group.slice();
            employeesCopyForChild = group.slice();
            var length = employeesCopyForSanta.length;
            if(length == 1)
            {
                console.log(group[0].name+ ' cannot be mapped');
                group[0].santa="";
                group[0].child="";
                group[0].id = id++;
                group[0].gender = "";
                group[0].likes = "";
                group[0].dislikes = "";
                group[0].wishlist = [];
                mappedEmployeesList.push(group[0]);
                return;
            }

            employeesCopyForSanta.sort(function() { return 0.5 - Math.random();}); // shuffle arrays
            employeesCopyForChild.sort(function() { return 0.5 - Math.random();});

            while (employeesCopyForSanta.length>0) {
                // var s = employeesCopyForSanta.pop();

                var santa = employeesCopyForSanta.pop(),
                    child = Object.compare(employeesCopyForChild[0].emailId, santa.emailId) ? employeesCopyForChild[employeesCopyForChild.length-1] : employeesCopyForChild[0];
                if(santa.santa && (santa.santa.emailId == child.emailId))
                {
                    if(santa == employeesCopyForChild[employeesCopyForChild.length-1])
                    {
                        console.log("error");
                    }
                    child = employeesCopyForChild.pop();
                }
                else{
                    if(Object.compare(santa, employeesCopyForChild[0]))
                    {
                        child = employeesCopyForChild.pop();
                    }
                    else
                        child = employeesCopyForChild.shift();
                }





                group[group.indexOf(santa)].child = child;
                group[group.indexOf(child)].santa = santa;

            }
            for(var obj in group)
            {
                group[obj].id = id++;
                group[obj].gender = "";
                group[obj].likes = "";
                group[obj].dislikes = "";
                group[obj].wishlist = [];
                mappedEmployeesList.push(group[obj]);
            }
        };

        function createRooms() {
            _.map(mappedEmployeesList, (data) => {
                data.room['roomAsChild'] = data.santa.id+"_"+data.id;
                data.room['roomAsSanta'] = data.id+"_"+data.child.id;
            });
            console.log("created rooms");
        };
        res.end();
    }
});

app.get("/api/notify", (req, res) => {
    // var from = 'secretsanta.accolite@gmail.com';
    // var to = req.body.to;
    // var body = req.body.body;
    // var subject = req.body.subject;

    // get appropriate body from hr with placeholders for adding names of santa and child
    var body = "This is a test email body";

    var subject = "SecretSanta Application";
    var recepientsArray = employees.map(employee => employee.emailId);
    var fbListOfEmployees ;
    var dbRefForEmployees = firebase.database().ref('/Employees/').once('value').then(function(snapshot) {
        fbListOfEmployees = snapshot.val();
        var i =0;

        _.map(fbListOfEmployees, (employee) => {
            if(i==0) {
            sendEmail(from, employee.emailid, subject, body, 'inform_pairs');
            // sendEmail(from, , subject, body);
            console.log("Email sent for "+ employee.emailid);
            i++;
            }
        });
    });

    res.end();
});

app.get('/api/email/send', (req, res) => {
    var eventType = req.query.event;
    var currUser = req.query.user;
    switch(eventType)
    {
        case 'addTask' : notifyChildAboutAddedTask(currUser);
        res.end();
        break;
        case 'poke_santa': pokeSanta(currUser);
        res.end();
        break;
        case 'poke_child': pokeChild(currUser);
        res.end();
        break;
        case 'gift' : notifyGift(currUser);
        res.end();
        break;
    }
});

function notifyChildAboutAddedTask(currUser) {
    var fbListOfEmployees ;
    var dbRefForEmployees = firebase.database().ref('/Employees/').once('value').then(function(snapshot) {
        fbListOfEmployees = snapshot.val();

        var childEmailId;
        _.map(fbListOfEmployees, (data) => {
            if(data.emailid == currUser)
            {
                var room = data.roomAsSanta;
                var childId = room.split('_')[1];
                childEmailId = fbListOfEmployees[childId].emailid;
            }
        });
        var from = 'secretsanta.accolite@gmail.com';
        var subject = "New Task Added To Your List!!";
        var body = "Your santa has added a new task in your bucket./nGrab on the opportunity to complete the task"
        +" to get yourself one more step closer to a surprise gift!!"
        sendEmail(from, childEmailId, subject, body, 'task_added');
        console.log("informed child about task");
    });
};

function pokeSanta(currUser) {
    var fbListOfEmployees ;
    var dbRefForEmployees = firebase.database().ref('/Employees/').once('value').then(function(snapshot) {
        fbListOfEmployees = snapshot.val();

        var santaEmailId;
        _.map(fbListOfEmployees, (data) => {
            if(data.emailid == currUser)
            {
                var room = data.roomAsChild;
                var santaId = room.split('_')[0];
                santaEmailId = fbListOfEmployees[santaId].emailid;
                console.log("h");
            }
        });
        var from = 'secretsanta.accolite@gmail.com';
        var subject = "POKE!!";
        var body = "Your santa has added a new task in your bucket./nGrab on the opportunity to complete the task"
        +" to get yourself one more step closer to a surprise gift!!"
        sendEmail(from, santaEmailId, subject, body, 'poke_santa');
        console.log("email for poke santa send");
    });

};
function pokeChild(currUser) {
    var fbListOfEmployees ;
    var dbRefForEmployees = firebase.database().ref('/Employees/').once('value').then(function(snapshot) {
        fbListOfEmployees = snapshot.val();

        var childEmailId;
        _.map(fbListOfEmployees, (data) => {
            if(data.emailid == currUser)
            {
                var room = data.roomAsSanta;
                var childId = room.split('_')[1];
                childEmailId = fbListOfEmployees[childId].emailid;
            }
        });
        var from = 'secretsanta.accolite@gmail.com';
        var subject = "POKE!!";
        var body = "Your santa has added a new task in your bucket./nGrab on the opportunity to complete the task"
        +" to get yourself one more step closer to a surprise gift!!"
        sendEmail(from, childEmailId, subject, body, "poke_child");
        console.log("mail for poke child sent");
    });

};
function notifyGift(currUser) {
    var fbListOfEmployees ;
    var dbRefForEmployees = firebase.database().ref('/Employees/').once('value').then(function(snapshot) {
        fbListOfEmployees = snapshot.val();

        var childEmailId;
        _.map(fbListOfEmployees, (data) => {
            if(data.emailid == currUser)
            {
                var room = data.roomAsSanta;
                var childId = room.split('_')[1];
                childEmailId = fbListOfEmployees[childId].emailid;
            }
        });
        var from = 'secretsanta.accolite@gmail.com';
        var subject = "Gift!!";
        var body = "Your santa wants to send you a present!!"
        sendEmail(from, childEmailId, subject, body, 'gift');
        console.log("email for gift sent");
    });
};

app.get('/api/user/', (req, res) => {
    var fbListOfEmployees ;
    var dbRefForEmployees = firebase.database().ref('/Employees/').once('value').then(function(snapshot) {
        fbListOfEmployees = snapshot.val();
        var emailId = req.query.email;
        _.map(fbListOfEmployees,(employee) => {
            if(employee.emailid == emailId)
            {
                var empObj = clone(employee);
                delete empObj.santaEmailId; // check this
                delete empObj.roomAsSanta;
                delete empObj.roomAsChild;
                delete empObj.childEmailId;
                console.log(empObj);
                var str = JSON.stringify(empObj);
                res.end(str);
            }
        });
    });
});

app.post('/api/user/update', (req, res) => {
    var fbListOfEmployees ;
    var dbRefForEmployees = firebase.database().ref('/Employees/').once('value').then(function(snapshot) {
        fbListOfEmployees = snapshot.val();
        var empObj = req.body;
        console.log(empObj);
        var id = empObj.id;
        fbListOfEmployees[id].wishlist = empObj.wishlist;
        fbListOfEmployees[id].gender = empObj.gender ? empObj.gender : "";
        fbListOfEmployees[id].likes = empObj.likes ? empObj.likes : "";
        fbListOfEmployees[id].dislikes = empObj.dislikes ? empObj.dislikes : "";
        const dbRefForEmployees = firebase.database().ref().child('Employees');
        dbRefForEmployees.set(fbListOfEmployees,(err) => {
            console.log(err);
            if(!err) {
                res.end("Successfully updated!");
            }
            else {
                res.end("Error when updating details!");
            }
        });
        console.log("udated employee data");
        res.end();
    });

});
function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
};
cron.schedule('30 16 * * *', function() {
    reportGenerator();
});
