const nodemailer = require('nodemailer');

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
let emailObj = 
{
    sendEmail (text, priceObj) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'neerajybkp3@gmail.com', // generated ethereal user
            pass: 'lgkp500cookie'  // generated ethereal password
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Neeraj Yadav" <neerajybkp3@gmail.com>', // sender address
        to: 'neerajyadav022@gmail.com', // list of receivers
        subject: text, // Subject line
        text: JSON.stringify(priceObj), // plain text body
        html: `<table><thead><tr><th>Type</th><th>Value</th></tr></thead><tbody>
        <tr><td>Input Inr</td><td>${priceObj.inputInr}</td></tr> 
        <tr><td>Indian Bank Tax</td><td>${priceObj.indianBankTax}</td></tr>
        <tr><td>Cex Tax in Eur</td><td>${priceObj.cexTaxEur}</td></tr> 
        <tr><td>Cex Deposit Amount</td><td>${priceObj.cexInputEur}</td></tr>
        <tr><td>Buy Request Fee</td><td>${priceObj.BuyRequestFee}</td></tr> 
        <tr><td>${priceObj.type} Bought</td><td>${priceObj.coinBought}</td></tr>
        <tr><td>${priceObj.type} Final Amount in coindelta</td><td>${priceObj.coinFinalAmount}</td></tr>
        </tbody></table>`
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
}
}

module.exports = emailObj