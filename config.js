let config = {
    defaultInput: 100000,
    xrpTransferFee: 0.01,
    ethTransferFee: 0.001,
    bchTransferFee: 0.001,
    btcTransferFee: 0.0001,
    cexTax: 0.035,
    indianBankTax: 0.035 * 1.18,
    koinexDepositFee: 2/100,
    makerFeeCex: 0.0016,
    takerFeeCex: 0.0025,
    maxProfitThreshold: 7000,
    emailReceivers: 'neerajyadav022@gmail.com, akshay.chunu@gmail.com',
    //emailReceivers: 'neerajyadav022@gmail.com',
    TWILIO_ACCOUNT_SID   : process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN : process.env.TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER : process.env.TWILIO_PHONE_NUMBER,
    CELL_PHONE_NUMBER : ['+919989037913', '+918085601406'],
    MONGO_HOST: "mongodb://localhost:27017",
    DB_NAME: "MY_DB"
}

module.exports = config