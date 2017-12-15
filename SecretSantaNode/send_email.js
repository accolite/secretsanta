function sendEmail(from, to, subject, body) {
    var fs = require('fs');
    var htmlData;
    fs.readFile("./templates/html.html", function(err, data) {
        htmlData = data;
        require('gmail-send')({    
            user: from,
            pass: 'accolitehyderabadsecretsanta',
            to: to,
            subject: subject,
            text:    body,       
            // html: "<html> <body> <h1>this is a html email</h1></body</html>"
            html: htmlData
            })({});
    });
    
};
exports.sendEmail = sendEmail;