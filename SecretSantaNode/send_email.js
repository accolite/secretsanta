var fs = require('fs');
var _ = require('underscore');
var firebase = require('./firebase_config').firebase;
var gmail_send = require('gmail-send');
const nodemailer = require('nodemailer');

const emailScheduler = {
    max: 50,
    sent: 0,
    lastIndex: 0,
    emails: [
        { u: 'secretsanta.accolite@gmail.com', p: 'accolitehyderabadsecretsanta' },
        { u: 'secretsanta2.accolite@gmail.com', p: 'accolitehyderabadsecretsanta' },
        // { u: 'secretsanta3.accolite@gmail.com', p: 'accolitehyderabadsecretsanta' } // not there
    ],
    getIndex: function() {
        if(this.sent > this.max) {
            this.sent = 0;
            this.lastIndex = this.lastIndex === this.emails.length - 1 ? 0 : this.lastIndex + 1;
        }
        return this.lastIndex;
    }
}

const mailerSendMail = (htmlData, to, subject) => {
    var _i = emailScheduler.getIndex();
    console.log('got inde', _i)
    var from = emailScheduler.emails[_i].u;
    var password = emailScheduler.emails[_i].p;
    let transporter = nodemailer.createTransport(
        {
            service: 'gmail',
            auth: {
                user: from,
                pass: password
            }
        }
    );
    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Secret Santa👻" <' + from + '>', // sender address
        to: to, // list of receivers
        subject: subject ? subject : 'Hey ✔',
        html: htmlData
    };

    setTimeout(() => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            emailScheduler.sent += 1;
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
    }, 1000);
}

function sendEmail(from, to, subject, body, mailType, reports) {
    switch(mailType) {
        case 'test': 
            mailerSendMail(from, to, 'please ignore: secret santa test');
            break;
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
        case 'task_done' :
            taskDone(from, to, subject, body, mailType, reports);
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
            // htmlData = data.toString('utf8');
            mailerSendMail(htmlData, to, subject)
    });          
    
   });
   fs.readFile("./templates/client-invite.html", function(err, data) {
        htmlData = data.toString('utf8');
        mailerSendMail(htmlData, to, subject)
    });
};
function taskAdded(from, to, subject, body, mailType, reports) {
    // to = 'makaravind11195@gmail.com';
    fs.readFile("./templates/new_task.html", function(err, data) {
        var htmlData = 'New Task added by your santa, go check!';
        if(!err && data) {
            htmlData = data.toString('utf8');
        }
        mailerSendMail(htmlData, to, subject)
        console.log("email sent for task addition");
    });
};

function taskDone(from, to, subject, body, mailType, reports) {
    fs.readFile("./templates/done_task.html", function(err, data) {
        var htmlData = 'Santa liked your efforts! Now, Go ask him for a gift!';
        if(!err && data) {
            htmlData = data.toString('utf8');
        }
        mailerSendMail(htmlData, to, subject)
        console.log("email sent for task completed");
    });
};

function gift(from, to, subject, body, mailType, reports) {
    fs.readFile("./templates/gift_child.html", function(err, data) {
        var htmlData = 'Wow, Your santa promised you a gift, go check!';
        if(!err && data) {
            htmlData = data.toString('utf8');
        }
        mailerSendMail(htmlData, to, subject)
    });
    
};
function pokeSanta(from, to, subject, body, mailType, reports) {
    fs.readFile("./templates/poke_santa.html", function(err, data) {
        var htmlData = 'Your child is missing you! Go and complete the tasks for some gifts';
        if(!err && data) {
            htmlData = data.toString('utf8');
        }
        mailerSendMail(htmlData, to, subject)
    });
};
function pokeChild(from, to, subject, body, mailType, reports) {
    fs.readFile("./templates/poke_child.html", function(err, data) {
        var htmlData = 'Your Santa is missing you! Make your child do some work!';
        if(!err && data) {
            htmlData = data.toString('utf8');
        }
        mailerSendMail(htmlData, to, subject)
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
            var to = 'pavani.kolukuluru@accoliteindia.com,aravindkumar.metku@accoliteindia.com';
            htmlData = data.toString('utf8');
            mailerSendMail(htmlData, to, subject)
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
            var to = 'pavani.kolukuluru@accoliteindia.com,aravindkumar.metku@accoliteindia.com';
            htmlData = data.toString('utf8');
            mailerSendMail(htmlData, to, subject)
        });        
    });
    
    
};
exports.sendEmail = sendEmail;