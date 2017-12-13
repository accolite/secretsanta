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

var employees = [];
var employeeGroups = {};
var employeesCopyForSanta = [];
var employeesCopyForChild = [];
var mappedEmployeesList = [];
var id = 0;
console.log("Server Started!");
app.use(upload());

app.get("/", (req, res) => {
    res.sendFile(__dirname+"/index.html");
});

app.post("/", (req, res) => {
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
                console.log('File has been uploaded');
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
                if(!employeeGroups[employee.shift+"_"+employee.location+"_"+employee.company]) {
                    employeeGroups[employee.shift+"_"+employee.location+"_"+employee.company]=[];
                }
                employeeGroups[employee.shift+"_"+employee.location+"_"+employee.company].push(employee);
            }
            for (var array in employeeGroups) {
                if (employeeGroups.hasOwnProperty(array)) {
                    mapSantaChild(employeeGroups[array]);
                }
            }                        
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
                mappedEmployeesList.push(group[obj]);
            }                                 
        };

        function createRooms() {
            _.map(mappedEmployeesList, (data) => {
                data.room['roomAsChild'] = data.santa.id+"_"+data.id;
                data.room['roomAsSanta'] = data.id+"_"+data.child.id;
            });            
        };
        
        // function getRandomInt(min, max, randomSanta, checkUnique, employeesCopyForChild, employeesCopyForSanta) {
        //     min = Math.ceil(min);
        //     max = Math.floor(max);
        //     var num = Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
        //     // if(min == 0 && max == 1 && randomSanta == 0) return 0;
        //     if(checkUnique)
        //         return (employeesCopyForChild[num] == employeesCopyForSanta[randomSanta]) ? getRandomInt(min, max, randomSanta, true, employeesCopyForChild, employeesCopyForSanta) : num;
        //     else 
        //         return num;
        // };        
        // function remove(array, index) {                        
        //     if (index !== -1) {
        //         array.splice(index, 1);
        //     }
        // };
        res.end();
    }
});

app.get("/notify", (req, res) => {
    var from = 'secretsanta.accolite@gmail.com';
    // var to = req.body.to;
    // var body = req.body.body;
    // var subject = req.body.subject;

    // get appropriate body from hr with placeholders for adding names of santa and child
    var body = "This is a test email body";
    
    var subject = "SecretSanta Application";
    var recepientsArray = employees.map(employee => employee.emailId)
    _.map(employees, (employee) => {
        sendEmail(from, employee.emailId, subject, body);
        // sendEmail(from, , subject, body);
        console.log("Email sent for "+ employee.emailId);
    });    
    res.end();
});

app.get('/email/send', (req, res) => {
    var eventType = req.query.event;
    var currUser = req.query.user;
    switch(eventType)
    {
        case 'addTask' : notifyChildAboutAddedTask(currUser);
        case 'poke_santa': pokeSanta(currUser);

    }
});

function notifyChildAboutAddedTask(currUser) {
    var childEmailId;
    _.map(mappedEmployeesList, (data) => {
        if(data.emailId == currUser)
        {
            var room = data.room['roomAsSanta'];
            var childId = room.split('_')[1];
            childEmailId = mappedEmployeesList[childId].emailId;
        }
    });
    var from = 'secretsanta.accolite@gmail.com';
    var subject = "New Task Added To Your List!!";
    var body = "Your santa has added a new task in your bucket./nGrab on the opportunity to complete the task"
    +" to get yourself one more step closer to a surprise gift!!"
    sendEmail(from, childEmailId, subject, body);
    
};

function pokeSanta(currUser) {
    var santaEmailId;
    _.map(mappedEmployeesList, (data) => {
        if(data.emailId == currUser)
        {
            var room = data.room['roomAsChild'];
            var santaId = room.split('_')[0];
            santaEmailId = mappedEmployeesList[santaId].emailId;
        }
    });
    var from = 'secretsanta.accolite@gmail.com';
    var subject = "POKE!!";
    var body = "Your santa has added a new task in your bucket./nGrab on the opportunity to complete the task"
    +" to get yourself one more step closer to a surprise gift!!"    
    sendEmail(from, santaEmailId, subject, body);
};

app.post('/user/update', (req, res) => {
    var empObj = req.body;
    var id = empObj.id;
    mappedEmployeesList[id] = empObj;
    storeInFirebase(mappedEmployeesList, firebase);
});