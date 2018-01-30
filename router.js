const express = require('express')
var axios = require('axios')
var router = express.Router();
const WebSocket = require('ws');
let config = require('./config')
let nodemailer = require('./nodemailer')

router.get("/ethdiff", (req, res)=> {
    // const ws = new WebSocket('wss://troll.coindelta.com:4000/socket.io/?EIO=3&transport=websocket&sid=TQ8gNCxFjI9PaG4gAoei', {
    //     perMessageDeflate: false
    //   })
      
    //   ws.on('message', function incoming(data) {
    //     console.log(data);
    //   });
    let promiseArray = []
    //promiseArray.push(axios.get('https://cex.io/api/last_price/ETH/EUR'))
    promiseArray.push(axios.get('https://cex.io/api/order_book/ETH/EUR/?depth=1'))
    promiseArray.push(axios.get('https://api.fixer.io/latest'))
    Promise.all(promiseArray).then(response => {

        let finalResponse = {}
        let inputInr = req.query.inputinr? req.query.inputinr: config.defaultInput
        let indianBankTax = config.indianBankTax
        let cexTax = config.cexTax
        let euroPriceInInr = response[1].data.rates.INR
        //let etherPrice = response[0].data.lprice
        let etherPrice = response[0].data.asks[0][0]
        let etherTransferFee = config.ethTransferFee

        finalResponse['type'] = 'ETH'
        finalResponse['inputInr'] = inputInr
        finalResponse['indianBankTax'] = inputInr * indianBankTax
        finalResponse['inputCexRawInr'] = inputInr - finalResponse['indianBankTax']
        finalResponse['inputCexRawEur'] = finalResponse['inputCexRawInr']/euroPriceInInr
        finalResponse['cexTaxEur'] = finalResponse['inputCexRawEur']* cexTax
        finalResponse['cexInputEur'] = finalResponse['inputCexRawEur'] - finalResponse['cexTaxEur']
        finalResponse['BuyRequestFee'] = finalResponse['cexInputEur'] * config.makerFeeCex
        finalResponse['coinBought'] = (finalResponse['cexInputEur'] - finalResponse['BuyRequestFee'])/etherPrice
        finalResponse['coinFinalAmount'] = finalResponse['coinBought'] - etherTransferFee

        nodemailer.sendEmail(`ETH in ${inputInr} inr from cex.io `+finalResponse['coinFinalAmount'], finalResponse)
        res.send(finalResponse)
    }, error => {
        res.send('error')
    })
})


router.get("/xrpdiff", (req, res)=> {
    // const ws = new WebSocket('wss://troll.coindelta.com:4000/socket.io/?EIO=3&transport=websocket&sid=TQ8gNCxFjI9PaG4gAoei', {
    //     perMessageDeflate: false
    //   })
      
    //   ws.on('message', function incoming(data) {
    //     console.log(data);
    //   });
    let promiseArray = []
    //promiseArray.push(axios.get('https://cex.io/api/last_price/XRP/EUR'))
    promiseArray.push(axios.get('https://cex.io/api/order_book/XRP/EUR/?depth=1'))
    promiseArray.push(axios.get('https://api.fixer.io/latest'))
    Promise.all(promiseArray).then(response => {

        let finalResponse = {}
        let inputInr = req.query.inputinr? req.query.inputinr: config.defaultInput
        let indianBankTax = config.indianBankTax
        let cexTax = config.cexTax
        let euroPriceInInr = response[1].data.rates.INR
        let xrpPrice = response[0].data.asks[0][0]
        let xrpTransferFee = config.xrpTransferFee
        finalResponse['type']= 'XRP'
        finalResponse['inputInr'] = inputInr
        finalResponse['indianBankTax'] = inputInr * indianBankTax
        finalResponse['inputCexRawInr'] = inputInr - finalResponse['indianBankTax']
        finalResponse['inputCexRawEur'] = finalResponse['inputCexRawInr']/euroPriceInInr
        finalResponse['cexTaxEur'] = finalResponse['inputCexRawEur']* cexTax
        finalResponse['cexInputEur'] = finalResponse['inputCexRawEur'] - finalResponse['cexTaxEur']
        finalResponse['BuyRequestFee'] = finalResponse['cexInputEur'] * config.makerFeeCex
        finalResponse['coinBought'] = (finalResponse['cexInputEur'] - finalResponse['BuyRequestFee'])/xrpPrice
        finalResponse['coinFinalAmount'] = finalResponse['coinBought'] - xrpTransferFee

        nodemailer.sendEmail(`XRP in ${inputInr} inr from cex.io `+finalResponse['coinFinalAmount'], finalResponse)
        res.send(finalResponse)
    }, error => {
        res.send('error')
    })
})


module.exports = router