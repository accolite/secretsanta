var firebase = require('./firebase_config').firebase;
var _ = require("underscore");
function reportGenerator() {
    var reports = [];    
    var maxChatRate = -1; 
    var maxNumberOfTasksBySanta = 0, minNumberOfTasksBySanta = 9007199254740992; 
    var minNumberOfTaskCompletedByChild= 0, maxNumberOfTasksCompletedByChild = 0;
    var roomWithMaxSantaTasks=[], roomWithMaxChildTasksCompleted=[];
    var roomWithMinSantaTasks=[], roomWithMinChildTasksCompleted=[];
    var roomWithMaxChatRate;
    generateReport();
    function generateReport() {    
        reports = [];            
        var dbRefForTasks = firebase.database().ref('/tasks/').once('value').then(function(snapshot) {
            getReportForTasks(snapshot);            
            console.log(maxNumberOfTasksBySanta +"in room "+roomWithMaxSantaTasks+  ""+ maxNumberOfTasksCompletedByChild+"in room "+roomWithMaxChildTasksCompleted);
            var dbRefForChats = firebase.database().ref('/rooms/').once('value').then(function(snapshot) {
                getReportForChats(snapshot);
                console.log(reports);
                var sendEmail = require("./send_email").sendEmail;
                sendEmail(null, null, null, null, 'reports', reports);
            });
        });        
        
    }
    function getReportForTasks(snapshot) {
        reports['tasks']=[];        
        for(var obj in snapshot.val())
        {
            if(obj != 'room')
            {
                // console.log(count(snapshot.val()[obj]));
                var santaTaskCount = countSantaTasks(snapshot.val()[obj].santa);
                var childTaskCompletedCount = countChildCompletedTasks(snapshot.val()[obj].santa);
                reports['tasks'].push({'santaTaskCount' : santaTaskCount,
                                        'childTaskCompletedCount' : childTaskCompletedCount,
                                        'room' : obj
                                        });                
                
                if(santaTaskCount > maxNumberOfTasksBySanta)
                {
                    maxNumberOfTasksBySanta = santaTaskCount;
                    roomWithMaxSantaTasks.push(obj.slice(0));                        
                }
                else
                {
                    roomWithMaxSantaTasks=[];
                }
                if(santaTaskCount < minNumberOfTasksBySanta)
                {
                    minNumberOfTasksBySanta = santaTaskCount;
                    roomWithMinSantaTasks.push(obj.slice(0));
                }
                else
                {
                    roomWithMinSantaTasks=[];
                }

                if(childTaskCompletedCount > maxNumberOfTasksCompletedByChild)
                {
                    maxNumberOfTasksCompletedByChild = childTaskCompletedCount;
                    roomWithMaxChildTasksCompleted.push(obj.slice(0));
                }
                else
                {
                    roomWithMaxChildTasksCompleted=[];
                }
                if(childTaskCompletedCount < minNumberOfTaskCompletedByChild)
                {
                    minNumberOfTaskCompletedByChild = childTaskCompletedCount;
                    roomWithMinChildTasksCompleted.push(obj.slice(0))
                }
                else
                {
                    roomWithMinChildTasksCompleted=[];
                }                    
            }
            else {
                roomWithMinSantaTasks.push(snapshot.val()[obj]);
                minNumberOfTasksBySanta = 0;   
                reports['tasks'].push({'room' : obj});
            }    
        }
    };
    function countSantaTasks(foo) {
        var count = 0;
        var santaObj = foo;
        for (var k in santaObj) {
            if (santaObj.hasOwnProperty(k)) {
               ++count;
            }
        }
        return count;
    };
    function countChildCompletedTasks(foo) {
        var count = 0;
        for(var k in foo)
        {
            if(foo.hasOwnProperty(k) && k.completed == 'true')
            {
                ++count;
            }
        }
        return count;
    };
    function getReportForChats(snapshot) {
        var chatRate;
        reports['chat']=[];
        for(var room in snapshot.val())
        {
            // console.log(snapshot.val()[room]);
            chatRate = calculateChatRateForRoom(snapshot.val()[room]);
            reports['chat'].push({'chatRate' : chatRate});
            reports['chat']['room'] = room;
            maxChatRate = chatRate>maxChatRate?chatRate:maxChatRate
            if(chatRate>maxChatRate)
            {
                maxChatRate = chatRate;
                roomWithMaxChatRate = room;
            }
        }
        console.log("max chat rate is "+maxChatRate+" and max chat room is "+roomWithMaxChatRate);
    };
    function calculateChatRateForRoom(room) {
        var minTimestamp=9007199254740992; var maxTimeStamp = 0;
        var chatCount = 0;
        for(var obj in room)
        {
            if(room.hasOwnProperty(obj))
            {
                ++chatCount
                minTimestamp = room[obj].timestamp<minTimestamp ? room[obj] : minTimestamp;
                maxTimeStamp = room[obj].timestamp>maxTimeStamp ? room[obj] : maxTimeStamp;
            }
        }
         return chatCount/(maxTimeStamp - minTimestamp);

    };
}
reportGenerator();
exports.reportGenerator = reportGenerator;