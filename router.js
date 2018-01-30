const express = require('express')
var axios = require('axios')
var router = express.Router();
const WebSocket = require('ws');
let config = require('./config')
let nodemailer = require('./nodemailer')
let curl = require('curlrequest');

router.get("/ethdiff", (req, res)=> {
    let promiseArray = []
    //promiseArray.push(axios.get('https://cex.io/api/last_price/ETH/EUR'))
    promiseArray.push(axios.get('https://cex.io/api/order_book/ETH/EUR/?depth=1'))
    promiseArray.push(axios.get('https://api.fixer.io/latest'))
    promiseArray.push(fetchKoinexRates())
    Promise.all(promiseArray).then(response => {

        let finalResponse = {}
        let inputInr = req.query.inputinr? req.query.inputinr: config.defaultInput
        let indianBankTax = config.indianBankTax
        let cexTax = config.cexTax
        let euroPriceInInr = response[1].data.rates.INR
        //let etherPrice = response[0].data.lprice
        let etherPrice = response[0].data.asks[0][0]
        let etherTransferFee = config.ethTransferFee
        let coinKoinexPrice = response[2].ETH

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
        finalResponse['coinPriceKoinex'] = coinKoinexPrice
        finalResponse['koinexRevenue'] = finalResponse['coinFinalAmount'] * coinKoinexPrice
        finalResponse['profit'] = finalResponse['koinexRevenue'] - inputInr

        nodemailer.sendEmail(`ETH Profit `+finalResponse['profit'], finalResponse)
        res.send(finalResponse)
    }, error => {
        res.send('error')
    })
})


router.get("/xrpdiff", (req, res)=> {
    let promiseArray = []
    //promiseArray.push(axios.get('https://cex.io/api/last_price/XRP/EUR'))
    promiseArray.push(axios.get('https://cex.io/api/order_book/XRP/EUR/?depth=1'))
    promiseArray.push(axios.get('https://api.fixer.io/latest'))
    promiseArray.push(fetchKoinexRates())
    Promise.all(promiseArray).then(response => {

        let finalResponse = {}
        let inputInr = req.query.inputinr? req.query.inputinr: config.defaultInput
        let indianBankTax = config.indianBankTax
        let cexTax = config.cexTax
        let euroPriceInInr = response[1].data.rates.INR
        let xrpPrice = response[0].data.asks[0][0]
        let xrpTransferFee = config.xrpTransferFee
        let coinKoinexPrice = response[2].XRP

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
        finalResponse['coinPriceKoinex'] = coinKoinexPrice
        finalResponse['koinexRevenue'] = finalResponse['coinFinalAmount'] * coinKoinexPrice
        finalResponse['profit'] = finalResponse['koinexRevenue'] - inputInr

        nodemailer.sendEmail(`XRP Profit `+finalResponse['profit'], finalResponse)
        res.send(finalResponse)
    }, error => {
        res.send('error')
    })
})


function fetchKoinexRates(getKoinexResponse) {
    let options = {
      url : 'https://koinex.in/api/ticker',
      header : [
        {
          'cookie': '__cfduid=d7b9e385253fdf3f698753beb7ec93b551507708166; cf_clearance=21ad6447b28165998f71561c830cc82796201d14-1510590752-3600; _koinex-frontend_session=MEJ0ZW52ZjlxdlBOOFgzV3IwWFVNNGZKZXVXODRWVE9RWWRyazlKVVlTSmN4MitSV2hyVGxxdkowUENpajlDdnhnSlhOYUFmNkdTdmlSaXVwMUR5aTQ2TGJQOWFxQTRTRW9CbTlvNndtajA1Sk4zQ0hGdnozcTRJN2ZFOE5aMzFkM3NGeWZoakNIaDdycWVmelJVM3BRPT0tLW0wbVZ3Q0VpWHlrNHltQ1kxcHNPS3c9PQ%3D%3D--8897cc6f6df1da0edb1f9d8fddbff5a09bfb77cb; _ga=GA1.2.1600254668.1507708173; _gid=GA1.2.287117624.1510548185'
        }, {
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.75 Safari/537.36'
        }, {
          'cache-control': 'max-age=0'
        }
      ]
    }
  
    return new Promise((resolve, reject) => {
        curl.request(options, function (err, data) {
            let prices = {}
            try {
              prices =JSON.parse(data).prices;
            }
            catch(e) {
              console.log("Koinex cloudflare expection");
              reject(e)
            }
            resolve(prices)
          });
    })
  }


module.exports = router