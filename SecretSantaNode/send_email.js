var fs = require('fs');
var _ = require('underscore');
var firebase = require('./firebase_config').firebase;
var gmail_send = require('gmail-send');
function sendEmail(from, to, subject, body, mailType, reports) {
    switch(mailType) {
        case 'poke_santa' :
            pokeSanta(from, to, subject, body, mailType, reports);
            break;
        case 'poke_child' :
            pokeChild(from, to, subject, body, mailType, reports);
            break;
        case 'gift' :
            gift(from, to, subject, body, mailType, reports);
            break;
        case 'task_added' :
            taskAdded(from, to, subject, body, mailType, reports);
            break;
        case 'inform_pairs' :
            informSantasAndChildren(from, to, subject, body, mailType, reports);
            break;
        case 'reports' :
            sendReports(reports);
            break;
    }    
};
function informSantasAndChildren(from, to, subject, body, mailType, reports) {
    var fbListOfEmployees ; var name = "";var htmlData;
    var dbRefForEmployees = firebase.database().ref('/Employees/').once('value').then(function(snapshot) {
        fbListOfEmployees = snapshot.val();                      
        fs.readFile("./templates/santa-invite.html", function(err, data) {
            htmlData = data.toString('utf8');
            _.map(fbListOfEmployees, (employee) => {
                if(employee.emailid == to )
                {
                    name = fbListOfEmployees[employee.roomAsSanta.split("_")[1]].name
                }
                
            });    
            // htmlData = data;
            htmlData = htmlData.replace("{$Emp_Name$}", name);
            gmail_send({
                user: 'secretsanta.accolite@gmail.com',
                pass: 'accolitehyderabadsecretsanta',
                to: to,
                subject: subject,
                html: htmlData
            });
    });          
    
   });
   fs.readFile("./templates/client-invite.html", function(err, data) {
        htmlData = data;        
        gmail_send({
            user: 'secretsanta.accolite@gmail.com',
            pass: 'accolitehyderabadsecretsanta',
            to: to,
            subject: subject,
            html: htmlData
        });
    });
};
function taskAdded(from, to, subject, body, mailType, reports) {
    fs.readFile("./templates/taskAdded.html", function(err, data) {
        htmlData = data;
        gmail_send({    
            user: 'secretsanta.accolite@gmail.com',
            pass: 'accolitehyderabadsecretsanta',
            to: to,
            subject: subject,
            text:    body,                       
            html: htmlData
            })({});
    });
};
function gift(from, to, subject, body, mailType, reports) {
    gmail_send({    
        user: 'secretsanta.accolite@gmail.com',
        pass: 'accolitehyderabadsecretsanta',
        to: to,
        subject: subject,
        text:    body,                       
        html: htmlData
        })({});
};
function pokeSanta(from, to, subject, body, mailType, reports) {
    fs.readFile("./templates/poke_santa.html", function(err, data) {
        htmlData = data;
        gmail_send({    
            user: 'secretsanta.accolite@gmail.com',
            pass: 'accolitehyderabadsecretsanta',
            to: to,
            subject: subject,
            text:    body,                       
            html: htmlData
        })({});
    });
};
function pokeChild(from, to, subject, body, mailType, reports) {
    fs.readFile("./templates/poke_child.html", function(err, data) {
        htmlData = data;
        gmail_send({    
            user: 'secretsanta.accolite@gmail.com',
            pass: 'accolitehyderabadsecretsanta',
            to: to,
            subject: subject,
            text:    body,                       
            html: htmlData
        })({});
    });
};
function sendReports(reports) {
    var top3Santa=[], top3Child=[], bottom3Santa=[], bottom3Child=[];
    var tasks = reports['tasks'];
    tasks.sort(function(a, b){
        return a.santaTaskCount-b.santaTaskCount;
    });
    bottom3Santa = tasks.slice(0,3);
    top3Santa = tasks.slice(tasks.length-3, tasks.length);
    tasks.sort(function(a, b){
        return a.childTaskCompletedCount-b.childTaskCompletedCount;
    });
    bottom3Child = tasks.slice(0,3);
    top3Child = tasks.slice(tasks.length-3, tasks.length);

    var fbListOfEmployees ;
    var dbRefForEmployees = firebase.database().ref('/Employees/').once('value').then(function(snapshot) {
        fbListOfEmployees = snapshot.val();      

        fs.readFile("./templates/simple_reports_child.html", function(err, data) {
            var htmlData = data.toString('utf8');
            console.log(htmlData);
            var room1 = top3Child[0] ? top3Child[0].room : "";
            var room2 = top3Child[1] ? top3Child[1].room : "" ;
            var room3 = top3Child[2] ?  top3Child[2].room : "";

            var room4 = bottom3Child[0] ? bottom3Child[0].room: "";
            var room5 = bottom3Child[1] ? bottom3Child[1].room : "";
            var room6 = bottom3Child[2] ? bottom3Child[2].room : "";
            if(room1 != "")
                htmlData = htmlData.replace("ABC", fbListOfEmployees[room1.split('_')[1]].name);
            else {
                htmlData = htmlData.replace("ABC", "");
            }
            if(room2 != "")
                htmlData = htmlData.replace("DEF", fbListOfEmployees[room2.split('_')[1]].name);
            else {
                htmlData = htmlData.replace("DEF", "");
            }
            if(room3 != "")
                htmlData = htmlData.replace("GHI", fbListOfEmployees[room3.split('_')[1]].name);
            else {
                htmlData = htmlData.replace("GHI", "");
            }
            if(room4 != "")
                htmlData = htmlData.replace("JKL", fbListOfEmployees[room4.split('_')[1]].name);
            else {
                htmlData = htmlData.replace("JKL", "");
            }
            if(room5 != "")
                htmlData = htmlData.replace("MNO", fbListOfEmployees[room5.split('_')[1]].name);
            else {
                htmlData = htmlData.replace("MNO", "");
            }
            if(room6 != "")
                htmlData = htmlData.replace("QPR", fbListOfEmployees[room6.split('_')[1]].name);
            else {
                htmlData = htmlData.replace("QPR", "");
            }
            gmail_send({    
                user: 'secretsanta.accolite@gmail.com',
                pass: 'accolitehyderabadsecretsanta',
                to: ['hyderabad@accoliteindia.com', 'hyderabad@accolitelabs.com'],
                // to : ['mahikanthnag.yalamarthi@accoliteindia.com', 'babanag95@gmaail.com'],
                subject: "",            
                html: htmlData
            })({});
        });                
        fs.readFile("./templates/simple_reports_santa.html", function(err, data) {
            var htmlData = data.toString('utf8');
            var room1 = top3Santa[0] ? top3Santa[0].room : "";
            var room2 = top3Santa[1] ? top3Santa[1].room : "";
            var room3 = top3Santa[2]  ? top3Santa[2].room : "";

            var room4 = bottom3Santa[0] ? bottom3Santa[0].room : "";
            var room5 = bottom3Santa[1]  ? bottom3Santa[1].room : "";
            var room6 = bottom3Santa[2] ? bottom3Santa[2].room : "";
            if(room1 != "")
                htmlData = htmlData.replace("ABC", fbListOfEmployees[room1.split('_')[0]].name);
            else {
                htmlData = htmlData.replace("ABC", "");
            }
            if(room2 != "")
                htmlData = htmlData.replace("DEF", fbListOfEmployees[room2.split('_')[0]].name);
            else {
                htmlData = htmlData.replace("DEF", "");
            }
            if(room3 != "")
                htmlData = htmlData.replace("GHI", fbListOfEmployees[room3.split('_')[0]].name);
            else {
                htmlData = htmlData.replace("GHI", "");
            }

            if(room4 != "")
                htmlData = htmlData.replace("JKL", fbListOfEmployees[room4.split('_')[0]].name);
            else {
                htmlData = htmlData.replace("JKL", "");
            }
            if(room5 != "")
                htmlData = htmlData.replace("MNO", fbListOfEmployees[room5.split('_')[0]].name);
            else {
                htmlData = htmlData.replace("MNO", "");
            }
            if(room6 != "")
                htmlData = htmlData.replace("QPR", fbListOfEmployees[room6.split('_')[0]].name);
            else {
                htmlData = htmlData.replace("QPR", "");
            }
            gmail_send({    
                user: 'secretsanta.accolite@gmail.com',
                pass: 'accolitehyderabadsecretsanta',
                to: ['hyderabad@accoliteindia.com', 'hyderabad@accolitelabs.com'],
                // to : ['mahikanthnag.yalamarthi@accoliteindia.com', 'babanag95@gmaail.com'],
                subject: "",            
                html: htmlData
            })({});
        });        
    });
    
    
};
exports.sendEmail = sendEmail;