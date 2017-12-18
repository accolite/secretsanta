var _ = require("underscore");
function storeInFirebase(mappedEmployeesList, firebase) {
    const dbRefForEmployees = firebase.database().ref().child('Employees');
    // var employeeEmailIds = employees.map(employee => employee.emailId);
    var employeeArray = new Array;
    for(var obj in mappedEmployeesList)
    {
        employeeArray.push({
                            id: mappedEmployeesList[obj].id,
                            emailid: mappedEmployeesList[obj].emailId, 
                            name : mappedEmployeesList[obj].name,
                            mobileno: mappedEmployeesList[obj].mobileNo,
                            shift: mappedEmployeesList[obj].shift,
                            company: mappedEmployeesList[obj].company,
                            location: mappedEmployeesList[obj].location,
                            teamName: mappedEmployeesList[obj].teamName,                            
                            childEmailId: mappedEmployeesList[obj].child ? mappedEmployeesList[obj].child.emailId:"",
                            santaEmailId: mappedEmployeesList[obj].santa ? mappedEmployeesList[obj].santa.emailId : "",
                            gender: mappedEmployeesList[obj].gender,
                            wishlist: mappedEmployeesList[obj].wishlist,
                            likes: mappedEmployeesList[obj].likes,
                            dislikes: mappedEmployeesList[obj].dislikes,
                            roomAsChild: mappedEmployeesList[obj].room['roomAsChild'],
                            roomAsSanta: mappedEmployeesList[obj].room['roomAsSanta']
                        });
    }
    dbRefForEmployees.set(employeeArray);
    console.log("pushed employee details to firebase");

    const dbRefForRoomMapping = firebase.database().ref().child('rooms');
    console.log("rooms object added to firebase");
    var rooms = mappedEmployeesList.map(employee => employee.room);
    dbRefForRoomMapping.set(mappedEmployeesList.map(employee => employee.room));
    console.log("rooms object added to firebase");

    // const dbRefForUsersMapping = firebase.database().ref().child('users');
    // dbRefForUsersMapping.set(employees.map(employee => employee.emailid));
    var jsonUsers= {};
    var dbRefForUsersDetailsMapping = firebase.database().ref().child('users');
    for(var obj in mappedEmployeesList)
    {        
        var email = mappedEmployeesList[obj].emailId;
        var trimmedEmail = email.replace(/[^a-zA-Z0-9]/g, "");
        // var roomAsSanta = _.filter(rooms, function(room) {
        //     return room.indexOf(email+"_") != -1
        //  });
        // var roomAsChild = _.filter(rooms, function(room) {
        //     return room.indexOf("_"+email) != -1
        // });
        var roomAsSanta = mappedEmployeesList[obj].room['roomAsSanta'];
        var roomAsChild = mappedEmployeesList[obj].room['roomAsChild'];
        var jsonUser = {};
        // jsonUser[trimmedEmail] = 
        jsonUsers[trimmedEmail] = {"roomAsSanta": roomAsSanta, 'roomAsChild' : roomAsChild};        
    }
    dbRefForUsersDetailsMapping.set(jsonUsers);

    var dbRefForTasksMapping = firebase.database().ref().child('tasks');
    dbRefForTasksMapping.set(mappedEmployeesList.map(employee => employee.room));
    console.log("users object added to firebase");
};
exports.storeInFirebase = storeInFirebase;