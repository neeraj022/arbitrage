let config = require('./config')

  let sendObj = {
      sendSms (messageToBeSend) 
      { 
          const client = require('twilio')(
            config.TWILIO_ACCOUNT_SID,
            config.TWILIO_AUTH_TOKEN
        );
        client.messages.create({
            from: config.TWILIO_PHONE_NUMBER,
            to: config.CELL_PHONE_NUMBER,
            body: messageToBeSend
          }).then((messsage) => console.log(message.sid), error => console.log(error));
      }
  } 

  module.exports = sendObj