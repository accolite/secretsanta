var EmailTemplate = require('email-templates-v2').EmailTemplate;
// var email = require('email-templates');
var nodemailer = require('nodemailer2');
var sender = 'smtps://secretsanta.accolite@gmail.com'   // The emailto use in sending the email
//(Change the @ symbol to %40 or do a url encoding )
var password = 'accolitehyderabadsecretsanta'
var transporter = nodemailer.createTransport(sender + ':' + password + '@smtp.gmail.com');
// const email = new EmailTemplate({view: {root: ''}});
var emailTemplate = new EmailTemplate('.//templates');
var niceSantaReport = transporter.templateSender((emailTemplate), {
    from: 'secretsanta.accolite.com',
});

niceSantaReport({
    to: 'babanag95@gmail.com',
    // EmailTemplate renders html and text but no subject so we need to
    // set it manually either here or in the defaults section of templateSender()
    subject: 'Santa Reports'
}, {
    goodchild1 : "mahikanthnag1",
    goodchild2 : "mahikanthnag2",
    goodchild3 : "mahikanthnag3",
    badchild1 : "ankit1",
    badchild2 : "ankit2",
    badchild3 : "ankit3"

}, function(err, info){
    if(err){
       console.log(err);
    }else{
        console.log('Password reminder sent');
    }
});