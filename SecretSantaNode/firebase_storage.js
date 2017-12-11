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
    const dbRefForSantaChildMapping = firebase.database().ref().child('rooms');
    dbRefForSantaChildMapping.set(employees.map(employee => employee.room));            
};
exports.storeInFirebase = storeInFirebase;