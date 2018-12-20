var firebase = require('./firebase_config').firebase;
var storeInFirebase = require('./firebase_storage').storeInFirebase;
var _ = require("underscore");
function reportGenerator() {
    var reports = [];
    var maxChatRate = -1;
    var maxNumberOfTasksBySanta = 0, minNumberOfTasksBySanta = 9007199254740992;
    var minNumberOfTaskCompletedByChild = 0, maxNumberOfTasksCompletedByChild = 0; totalLength = 0; totalPokes = 0; totalTasks = 0; totalTasksCompleted = 0; maxNumberOfTasksCompletedByChildIndex = 0;
    var roomWithMaxSantaTasks = [], roomWithMaxChildTasksCompleted = []; maxNumberOfTasksBySantaIndex = 0; maxChatLength = 0;
    var roomWithMinSantaTasks = [], roomWithMinChildTasksCompleted = []; roomNumber = []; employeesList = [];
    var roomWithMaxChatRate;
    generateReport();

    function generateReport() {
        reports = [];
        var dbRefForTasks = firebase.database().ref('/tasks/').once('value').then(function (snapshot) {
            getReportForTasks(snapshot);
            // getTotalTasksBySantas(snapshot);
            // getTotalCompletedTasksByChild(snapshot);
            console.log(maxNumberOfTasksBySanta + "in room " + roomWithMaxSantaTasks + "" + maxNumberOfTasksCompletedByChild + "in room " + roomWithMaxChildTasksCompleted);
            var dbRefForChats = firebase.database().ref('/rooms/').once('value').then(function (snapshot) {

                //    getReportForChats(snapshot);
                getTotalPokes(snapshot);
                getTotalMessages(snapshot);
                console.log(reports);
                var sendEmail = require("./send_email").sendEmail;
                var dbRefForChats = firebase.database().ref('/Employees/').once('value').then(function (snapshot) {
                    getEmployees(snapshot);
                    getEmployeesList(snapshot);
                    //  var dbRefForActivities = firebase.database().ref('/activity/').once('value').then(function (snapshot) {
                    //  getTotalPokes(snapshot);


                    const reportsref = firebase.database().ref().child('Reports');
                    delete reports.chat;
                    reportsref.set(reports);
                    // sendEmail(null, null, null, null, 'reports', reports);
                });
            });
        });

    }




    function getReportForTasks(snapshot) {
        reports['maxNumberOfTasksBySanta'] = []; reports['totalTasksCompletedByChild'] = [];
        reports['maxNumberOfTasksCompletedByChild'] = []; reports['totalTasksBySanta'] = [];
        // for (var obj in snapshot.val()) { console.log('obj===================' + obj['roomAsChild'] + '===========' + obj['roomAsSanta']); }
        for (var objkey in snapshot.val()) {
            if (objkey.includes('_')) {
                if (objkey != 'room') {
                    //  console.log(count(snapshot.val()[obj]));
                    console.log(Object.keys(snapshot.val()[objkey]));
                    var santaTaskCount = countSantaTasks(snapshot.val()[objkey].santa);
                    console.log('santaTaskCount----------------------------' + santaTaskCount);
                    totalTasks = totalTasks + santaTaskCount;
                    console.log('totalTasks----------------------------' + totalTasks);
                    reports['totalTasksBySanta'].pop();
                    reports['totalTasksBySanta'].push(totalTasks);

                    // console.log("object--------------------" + snapshot.val()[objkey].santa + '----------' + Object.keys(snapshot.val()));
                    var childTaskCompletedCount = countChildCompletedTasks(snapshot.val()[objkey].santa);
                    totalTasksCompleted = totalTasksCompleted + childTaskCompletedCount;
                    console.log('totalTasksCompleted----------------------------' + totalTasksCompleted);
                    reports['totalTasksCompletedByChild'].pop();
                    reports['totalTasksCompletedByChild'].push(totalTasksCompleted);
                    //  console.log('childTaskCompletedCount----------------------------' + childTaskCompletedCount);
                    // reports['tasks'].push({
                    //     'santaTaskCount': santaTaskCount,
                    //     'childTaskCompletedCount': childTaskCompletedCount,
                    //     'room': objkey
                    // });

                    if (santaTaskCount > maxNumberOfTasksBySanta) {
                        maxNumberOfTasksBySanta = santaTaskCount;
                        maxNumberOfTasksBySantaIndex = objkey.split('_')[0];
                        console.log('----------------------------------------------------------------------------------maxNumberOfTasksBySantaIndex-----' + maxNumberOfTasksBySantaIndex);
                        roomWithMaxSantaTasks.push(objkey.slice(0));
                        // var alreadyMaxSantaThere = false;
                        // console.log('Object Keys'+ Object.keys(reports));

                        //     if (reports['maxNumberOfTasksBySanta']) {
                        //         console.log('------------------------------------------------------' + i.maxNumberOfTasksBySanta);
                        //        reports['maxNumberOfTasksBySanta'].pop();
                        //         reports['maxNumberOfTasksBySanta'].push({
                        //             'maxNumberOfTasksBySanta': maxNumberOfTasksBySanta
                        //         });
                        //         alreadyMaxSantaThere = true;

                        //     }


                        // if (!alreadyMaxSantaThere) {
                        //     reports['maxNumberOfTasksBySanta'].push({
                        //         'maxNumberOfTasksBySanta': maxNumberOfTasksBySanta
                        //     });
                        // }
                        reports['maxNumberOfTasksBySanta'].pop();
                        reports['maxNumberOfTasksBySanta'].push(maxNumberOfTasksBySanta);

                    }
                    else {
                        roomWithMaxSantaTasks = [];
                    }
                    if (santaTaskCount < minNumberOfTasksBySanta) {
                        minNumberOfTasksBySanta = santaTaskCount;
                        roomWithMinSantaTasks.push(objkey.slice(0));
                    }
                    else {
                        roomWithMinSantaTasks = [];
                    }

                    if (childTaskCompletedCount > maxNumberOfTasksCompletedByChild) {
                        maxNumberOfTasksCompletedByChild = childTaskCompletedCount;
                        maxNumberOfTasksCompletedByChildIndex = objkey.split('_')[1];
                        console.log('----------------------------------------------------------------------------------maxNumberOfTasksCompletedByChildIndex-----' + maxNumberOfTasksCompletedByChildIndex);
                        // var alreadyThere = false;
                        // for (var i in reports['maxNumberOfTasksCompletedByChild']) {
                        //     if (i['maxNumberOfTasksCompletedByChild']) {
                        //         console.log('------------------------------------------------------' + i.maxNumberOfTasksCompletedByChild);
                        //         reports['maxNumberOfTasksCompletedByChild'].pop();
                        //         reports['maxNumberOfTasksCompletedByChild'].push({
                        //             'maxNumberOfTasksCompletedByChild': maxNumberOfTasksCompletedByChild
                        //         });
                        //         alreadyThere = true;

                        //     }
                        // }

                        // if (!alreadyThere) {
                        //     reports['maxNumberOfTasksCompletedByChild'].push({
                        //         'maxNumberOfTasksCompletedByChild': maxNumberOfTasksCompletedByChild
                        //     });
                        // }
                        reports['maxNumberOfTasksCompletedByChild'].pop();
                        reports['maxNumberOfTasksCompletedByChild'].push(maxNumberOfTasksCompletedByChild);
                    }

                    roomWithMaxChildTasksCompleted.push(objkey.slice(0));
                }
                else {
                    roomWithMaxChildTasksCompleted = [];
                }
                if (childTaskCompletedCount < minNumberOfTaskCompletedByChild) {
                    minNumberOfTaskCompletedByChild = childTaskCompletedCount;
                    roomWithMinChildTasksCompleted.push(objkey.slice(0))
                }
                else {
                    roomWithMinChildTasksCompleted = [];
                }
            }
            else {
                roomWithMinSantaTasks.push(snapshot.val()[objkey]);
                minNumberOfTasksBySanta = 0;
                // reports['tasks'].push({
                //     'santaTaskCount': 0,
                //     'childTaskCompletedCount': 0,
                //     'room': objkey
                // });
            }
        }
        // console.log('maxNumberOfTasksCompletedByChild----------------------' + maxNumberOfTasksCompletedByChild);
        // console.log('roomWithMaxSantaTasks----------------------' + roomWithMaxSantaTasks.length);
        // console.log('roomWithMinChildTasksCompleted----------------------' + roomWithMinChildTasksCompleted.length);
    }


    function getEmployees(snapshot) {
        console.log('Santa who had given most tasks---------------------------------------------------------------------------' + snapshot.val()[maxNumberOfTasksBySantaIndex].name);
        console.log('Child who had completed most tasks---------------------------------------------------------------------------' + snapshot.val()[maxNumberOfTasksCompletedByChildIndex].name);
        console.log('Most active room of ' + snapshot.val()[roomNumber[0]].name + 'and' + snapshot.val()[roomNumber[1]].name + 'with ' + maxChatLength + 'messages');
    }


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

    function getTotalMessages(snapshot) {
        reports['totalMessages'] = [];
        //  console.log('Object keys ' + Object.keys(snapshot.val()));
        for (var objkey in snapshot.val()) {
            //  console.log('----------------------------------------------------------------' + objkey + objkey.includes('_'));
            if (objkey.includes('_')) {
                if (Object.keys(snapshot.val()[objkey]).length > maxChatLength) {
                    maxChatLength = Object.keys(snapshot.val()[objkey]).length;
                    roomNumber = objkey.split('_');
                }
                totalLength = totalLength + Object.keys(snapshot.val()[objkey]).length;
            }
        }
        reports['totalMessages'].push(totalLength);

    }


    function getTotalPokes(snapshot) {
        reports['totalPokes'] = [];
        // console.log('Object keys ' + Object.keys(snapshot.val()));
        for (var objkey in snapshot.val()) {
            //   console.log('----------------------------------------------------------------' + objkey + objkey.includes('_'));
            if (objkey.includes('_')) {
                for (var innerobjkey in snapshot.val()[objkey]) {

                    var a = snapshot.val()[objkey];

                    if (a[innerobjkey].type == 'special_poke_child' || a[innerobjkey].type == 'special_poke_santa') {


                        totalPokes = totalPokes + 1;
                    }
                }
            }
        }
        // console.log('a1--------------------------------------------------------------------------------------' + a1);
        console.log('totalPokes' + totalPokes);
        reports['totalPokes'].push(totalPokes);

    }

    // function getTotalTasksBySantas(snapshot) {
    //     reports['totalTasksBySanta'] = [];
    //     //  console.log('Object keys ' + Object.keys(snapshot.val()));
    //     for (var objkey in snapshot.val()) {
    //         console.log('----------------------------------------------------------------' + objkey + objkey.includes('_'));
    //         if (objkey.includes('_')) {
    //             console.log('length of each santa' + snapshot.val()[objkey].santa.length);
    //             totalTasks = totalTasks + Object.keys(snapshot.val()[objkey]).length;
    //         }
    //     }
    //     reports['totalTasksBySanta'].push(totalLength);

    // }
    // function getTotalCompletedTasksByChild(snapshot) {
    //     reports['totalTasksCompletedByChild'] = [];
    //     //  console.log('Object keys ' + Object.keys(snapshot.val()));
    //     for (var objkey in snapshot.val()) {
    //         //  console.log('----------------------------------------------------------------' + objkey + objkey.includes('_'));
    //         if (objkey.includes('_')) {
    //             for (var i in snapshot.val()[objkey].santa) {
    //                 if (snapshot.val()[objkey].santa[i].completed == 'true')
    //                     totalTasksCompleted = totalTasksCompleted + 1;
    //             }
    //         }
    //     }
    //     reports['totalTasksCompletedByChild'].push(totalTasksCompleted);

    // }




    function countChildCompletedTasks(foo) {
        //   console.log('foo==========' + Object.keys(foo));
        var count = 0;
        for (var k in foo) {
            //   console.log('count--------------------------------------------' + foo[k].completed);
            if (foo.hasOwnProperty(k) && foo[k].completed == true) {
                ++count;

            }
        }
        //  console.log('count--------------------------------------------' + count);
        return count;
    };

    function countChildTasks(foo) {
        //   console.log('foo==========' + Object.keys(foo));
        var count = 0;
        for (var k in foo) {
            //   console.log('count--------------------------------------------' + foo[k].completed);
            if (foo.hasOwnProperty(k)) {
                ++count;

            }
        }
        //  console.log('count--------------------------------------------' + count);
        return count;
    };




    function getReportForChats(snapshot) {
        var chatRate;
        reports['chat'] = [];
        //   console.log('chat report ----------------------------------------------------------------------------------' + snapshot.val());
        for (var room in snapshot.val()) {
            // console.log(snapshot.val()[room]);
            chatRate = calculateChatRateForRoom(snapshot.val()[room]);
            reports['chat'].push({ 'chatRate': chatRate });
            reports['chat']['room'] = room;
            maxChatRate = chatRate > maxChatRate ? chatRate : maxChatRate
            if (chatRate > maxChatRate) {
                maxChatRate = chatRate;
                roomWithMaxChatRate = room;
            }
        }
        // console.log("max chat rate is " + maxChatRate + " and max chat room is " + roomWithMaxChatRate);
    };

    function getEmployeesList(snapshot) {
        for (var i in Object.keys(snapshot.val())) {
            // for (var item in snapshot.val()[i]) {
            //  console.log('-------------------------------------------------------' + item);
            for (var searchitem in Object.keys(snapshot.val())) {
                if (snapshot.val()[searchitem].santaEmailId == snapshot.val()[i].emailid) {
                    // console.log('   ' + snapshot.val()[searchitem].santaEmailId + ' ' + snapshot.val()[i].emailid);
                    //  console.log('   ' + snapshot.val()[searchitem].name + ' ' + snapshot.val()[i].name);
                    const objData = {
                        'child': snapshot.val()[i].name,
                        'santa': snapshot.val()[searchitem].name
                    };
                   // employeesList.push([snapshot.val()[searchitem].name, snapshot.val()[i].name]);
                   employeesList.push(objData);
                }
                // }
            }
        }
        employeesList.forEach(element => {
            console.log(JSON.stringify(element));
            
        });

        // for (var j in employeesList) {
        //     console.log('============jjjjj' + JSON.stringify(j));
        //     console.log('employee List ---------------------------------------------------------------' + j['santa'] + '---' + j['child']);
        // }
        // console.log('Santa who had given most tasks---------------------------------------------------------------------------' + snapshot.val()[maxNumberOfTasksBySantaIndex].name);
        // console.log('Child who had completed most tasks---------------------------------------------------------------------------' + snapshot.val()[maxNumberOfTasksCompletedByChildIndex].name);
        // console.log('Most active room of ' + snapshot.val()[roomNumber[0]].name + 'and' + snapshot.val()[roomNumber[1]].name + 'with ' + maxChatLength + 'messages');
    }


    function calculateChatRateForRoom(room) {
        var minTimestamp = 9007199254740992; var maxTimeStamp = 0;
        var chatCount = 0;
        for (var obj in room) {
            if (room.hasOwnProperty(obj)) {
                ++chatCount
                minTimestamp = room[obj].timestamp < minTimestamp ? room[obj] : minTimestamp;
                maxTimeStamp = room[obj].timestamp > maxTimeStamp ? room[obj] : maxTimeStamp;
            }
        }
        return chatCount / (maxTimeStamp - minTimestamp);

    };
};


reportGenerator();
exports.reportGenerator = reportGenerator;