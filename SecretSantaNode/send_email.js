var fs = require('fs');
var gmail_send = require('gmail-send');
function sendEmail(from, to, subject, body, mailType, reports) {
    switch(mailType) {
        case 'poke_santa' :
            pokeSanta();
            break;
        case 'poke_child' :
            pokeChild();
            break;
        case 'gift' :
            gift();
            break;
        case 'new_task' :
            taskAdded();
            break;
        case 'inform_pairs' :
            informSantasAndChildren();
            break;
        case 'reports' :
            reports(reports);
            break;
    }    
};
function informSantasAndChildren() {
    fs.readFile("./templates/santa-invite.html", function(err, data) {
        htmlData = data;
        htmlData = htmlData.replace("{$Emp_Name$}", name);
        gmail_send({
            user: 'secretsanta.accolite@gmail.com',
            pass: 'accolitehyderabadsecretsanta',
            to: to,
            subject: subject,
            html: htmlData
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
function taskAdded() {
    fs.readFile("./templates/taskAdded.html", function(err, data) {
        htmlData = data;
        gmail_send({    
            user: from,
            pass: 'accolitehyderabadsecretsanta',
            to: to,
            subject: subject,
            text:    body,                       
            html: htmlData
            })({});
    });
};
function gift() {
    gmail_send({    
        user: from,
        pass: 'accolitehyderabadsecretsanta',
        to: to,
        subject: subject,
        text:    body,                       
        html: htmlData
        })({});
};
function pokeSanta() {
    fs.readFile("./templates/poke_santa.html", function(err, data) {
        htmlData = data;
        gmail_send({    
            user: from,
            pass: 'accolitehyderabadsecretsanta',
            to: to,
            subject: subject,
            text:    body,                       
            html: htmlData
        })({});
    });
};
function pokeChild() {
    fs.readFile("./templates/poke_child.html", function(err, data) {
        htmlData = data;
        gmail_send({    
            user: from,
            pass: 'accolitehyderabadsecretsanta',
            to: to,
            subject: subject,
            text:    body,                       
            html: htmlData
        })({});
    });
};
function reports(reports) {
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
            htmlData = data;
            var room1 = top3Child[0].room;
            var room2 = top3Child[1].room;
            var room3 = top3Child[2].room;

            var room4 = bottom3Child[0].room;
            var room5 = bottom3Child[1].room;
            var room6 = bottom3Child[2].room;

            htmlData.replace("ABC", fbListOfEmployees[room1.split('_')[1]].name);
            htmlData.replace("DEF", fbListOfEmployees[room2.split('_')[1]].name);
            htmlData.replace("GHI", fbListOfEmployees[room3.split('_')[1]].name);

            htmlData.replace("JKL", fbListOfEmployees[room4.split('_')[1]].name);
            htmlData.replace("MNO", fbListOfEmployees[room5.split('_')[1]].name);
            htmlData.replace("QPR", fbListOfEmployees[room6.split('_')[1]].name);
            gmail_send({    
                user: 'secretsanta.accolite@gmail.com',
                pass: 'accolitehyderabadsecretsanta',
                to: ['hyderabad@accoliteindia.com', 'hyderabad@accolitelabs.com'],
                subject: subject,            
                html: htmlData
            })({});
        });                
        fs.readFile("./templates/simple_reports_santa.html", function(err, data) {
            htmlData = data;
            var room1 = top3Santa[0].room;
            var room2 = top3Santa[1].room;
            var room3 = top3Santa[2].room;

            var room4 = bottom3Santa[0].room;
            var room5 = bottom3Santa[1].room;
            var room6 = bottom3Santa[2].room;

            htmlData.replace("ABC", fbListOfEmployees[room1.split('_')[0]].name);
            htmlData.replace("DEF", fbListOfEmployees[room2.split('_')[0]].name);
            htmlData.replace("GHI", fbListOfEmployees[room3.split('_')[0]].name);

            htmlData.replace("JKL", fbListOfEmployees[room4.split('_')[0]].name);
            htmlData.replace("MNO", fbListOfEmployees[room5.split('_')[0]].name);
            htmlData.replace("QPR", fbListOfEmployees[room6.split('_')[0]].name);
            gmail_send({    
                user: 'secretsanta.accolite@gmail.com',
                pass: 'accolitehyderabadsecretsanta',
                to: ['hyderabad@accoliteindia.com', 'hyderabad@accolitelabs.com'],
                subject: subject,            
                html: htmlData
            })({});
        });        
    });
    
    
};
exports.sendEmail = sendEmail;