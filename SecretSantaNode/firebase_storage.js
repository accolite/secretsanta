var _ = require("underscore");
function storeInFirebase(mappedEmployeesList, firebase) {
    const dbRefForEmployees = firebase.database().ref().child('Employees');
    // var employeeEmailIds = employees.map(employee => employee.emailId);
    var employeeArray = new Array;
    for(var obj in mappedEmployeesList)
    {
        employeeArray.push({emailid: mappedEmployeesList[obj].emailId, 
                            name : mappedEmployeesList[obj].name,
                            mobileno: mappedEmployeesList[obj].mobileNo,
                            shift: mappedEmployeesList[obj].shift,
                            company: mappedEmployeesList[obj].company,
                            location: mappedEmployeesList[obj].location,
                            teamName: mappedEmployeesList[obj].teamName,
                            childEmailId: mappedEmployeesList[obj].child ? mappedEmployeesList[obj].child.emailId:"",
                            santaEmailId: mappedEmployeesList[obj].santa ? mappedEmployeesList[obj].santa.emailId : "" 
                        });
    }
    dbRefForEmployees.set(employeeArray);

    const dbRefForRoomMapping = firebase.database().ref().child('rooms');
    var rooms = mappedEmployeesList.map(employee => employee.room);
    dbRefForRoomMapping.set(mappedEmployeesList.map(employee => employee.room));

    // const dbRefForUsersMapping = firebase.database().ref().child('users');
    // dbRefForUsersMapping.set(employees.map(employee => employee.emailid));
    var jsonUsers= [];
    var dbRefForUsersDetailsMapping = firebase.database().ref().child('users');
    for(var obj in mappedEmployeesList)
    {        
        var email = mappedEmployeesList[obj].emailId;
        var trimmedEmail = email.replace(/[^a-zA-Z0-9]/g, "");
        var roomAsSanta = _.filter(rooms, function(room) {
            return room.indexOf(email+"_") != -1
         });
        var roomAsChild = _.filter(rooms, function(room) {
            return room.indexOf("_"+email) != -1
        });
        var jsonUser = {};
        jsonUser[trimmedEmail] = {"roomAsSanta": roomAsSanta, 'roomAsChild' : roomAsChild};
        jsonUsers.push(jsonUser);        
    }
    dbRefForUsersDetailsMapping.set(jsonUsers);
};
exports.storeInFirebase = storeInFirebase;