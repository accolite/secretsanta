var _ = require("underscore");
function storeInFirebase(employees, firebase) {
    const dbRefForEmployees = firebase.database().ref().child('Employees');
    // var employeeEmailIds = employees.map(employee => employee.emailId);
    var employeeArray = new Array;
    for(var obj in employees)
    {
        employeeArray.push({emailid: employees[obj].emailId, 
                            name : employees[obj].name,
                            mobileno: employees[obj].mobileNo,
                            shift: employees[obj].shift,
                            company: employees[obj].company,
                            location: employees[obj].location,
                            teamName: employees[obj].teamName});
    }
    dbRefForEmployees.set(employeeArray);

    const dbRefForRoomMapping = firebase.database().ref().child('rooms');
    var rooms = employees.map(employee => employee.room);
    dbRefForRoomMapping.set(employees.map(employee => employee.room));

    // const dbRefForUsersMapping = firebase.database().ref().child('users');
    // dbRefForUsersMapping.set(employees.map(employee => employee.emailid));
    var jsonUsers= [];
    var dbRefForUsersDetailsMapping = firebase.database().ref().child('users');
    for(var obj in employees)
    {        
        var email = employees[obj].emailId;
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