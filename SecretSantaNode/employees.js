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
var employeesCopyForSanta = [];
var employeesCopyForChild = [];
console.log("Server Started!");
app.use(upload());

app.get("/", (req, res) => {
    res.sendFile(__dirname+"/index.html");
})

app.post("/", (req, res) => {
    if(req.files){
        // console.log(req.files.filename.data.toString('utf16'));
        var file = req.files.filename;
        var filename = file.name;
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
                        var employeeData = {};
                        employeeData.emailId = curr[0]
                        employeeData.name = curr[1];
                        employeeData.mobileNo = curr[2];
                        employeeData.shift = curr[3] ? curr[3] : "";
                        employeeData.company = curr[4] ? curr[4] : "";
                        employeeData.location = curr[5] ? curr[5] : "";
                        employeeData.teamName = curr[6] ? curr[6] : "";;
                        employees.push(employeeData);
                    });
                    // console.log(employees);
                    mapSantaChild();
                    createRooms();
                    storeInFirebase(employees, firebase);
                });
            }
        });
        function mapSantaChild() {
            employeesCopyForSanta = employees.slice();
            employeesCopyForChild = employees.slice();
            var length = employeesCopyForSanta.length;
            while(employeesCopyForSanta.length >=1)
            {
                var randomSanta = getRandomInt(0, employeesCopyForSanta.length, length+1, false);
                var randomChild = getRandomInt(0, employeesCopyForSanta.length, randomSanta, true);
                employees[employees.indexOf(employeesCopyForSanta[randomSanta])].child = employeesCopyForChild[randomChild];
                employees[employees.indexOf(employeesCopyForChild[randomChild])].santa = employeesCopyForSanta[randomSanta];

                remove(employeesCopyForChild, randomChild);
                remove(employeesCopyForSanta, randomSanta);
            }                                   
        };
        function createRooms() {
            _.map(employees, (data) => {
                data.room = data.santa.emailId+"_"+data.child.emailId;
            });            
        };
        
        function getRandomInt(min, max, randomSanta, checkUnique) {
            min = Math.ceil(min);
            max = Math.floor(max);
            var num = Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
            // if(min == 0 && max == 1 && randomSanta == 0) return 0;
            if(checkUnique)
                return (employeesCopyForChild[num] == employeesCopyForSanta[randomSanta]) ? getRandomInt(min, max, randomSanta, true) : num;
            else 
                return num;
        };        
        function remove(array, index) {                        
            if (index !== -1) {
                array.splice(index, 1);
            }
        };
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