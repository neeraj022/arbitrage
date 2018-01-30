const express = require('express')
var axios = require('axios')
var router = express.Router();
const WebSocket = require('ws');
let config = require('./config')
let nodemailer = require('./nodemailer')
let curl = require('curlrequest');

router.get("/", (req, res) => {
  res.send('Welcome to landing page')
})


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
        let coinCexPrice = response[0].data.asks[0][0]
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
        finalResponse['coinBought'] = (finalResponse['cexInputEur'] - finalResponse['BuyRequestFee'])/coinCexPrice
        finalResponse['coinFinalAmount'] = finalResponse['coinBought'] - etherTransferFee
        finalResponse['coinPriceKoinex'] = coinKoinexPrice
        finalResponse['koinexRevenue'] = finalResponse['coinFinalAmount'] * coinKoinexPrice
        finalResponse['profit'] = finalResponse['koinexRevenue'] - inputInr

        nodemailer.sendEmail(finalResponse)
        res.send(finalResponse)
    }, error => {
        res.send('error')
    })
})

router.get("/btcdiff", (req, res)=> {
  let promiseArray = []
  //promiseArray.push(axios.get('https://cex.io/api/last_price/ETH/EUR'))
  promiseArray.push(axios.get('https://cex.io/api/order_book/BTC/EUR/?depth=1'))
  promiseArray.push(axios.get('https://api.fixer.io/latest'))
  promiseArray.push(fetchKoinexRates())
  Promise.all(promiseArray).then(response => {

      let finalResponse = {}
      let inputInr = req.query.inputinr? req.query.inputinr: config.defaultInput
      let indianBankTax = config.indianBankTax
      let cexTax = config.cexTax
      let euroPriceInInr = response[1].data.rates.INR
      //let etherPrice = response[0].data.lprice
      let coinCexPrice = response[0].data.asks[0][0]
      let btcTransferFee = config.btcTransferFee
      let coinKoinexPrice = response[2].BTC

      finalResponse['type'] = 'BTC'
      finalResponse['inputInr'] = inputInr
      finalResponse['indianBankTax'] = inputInr * indianBankTax
      finalResponse['inputCexRawInr'] = inputInr - finalResponse['indianBankTax']
      finalResponse['inputCexRawEur'] = finalResponse['inputCexRawInr']/euroPriceInInr
      finalResponse['cexTaxEur'] = finalResponse['inputCexRawEur']* cexTax
      finalResponse['cexInputEur'] = finalResponse['inputCexRawEur'] - finalResponse['cexTaxEur']
      finalResponse['BuyRequestFee'] = finalResponse['cexInputEur'] * config.makerFeeCex
      finalResponse['coinBought'] = (finalResponse['cexInputEur'] - finalResponse['BuyRequestFee'])/coinCexPrice
      finalResponse['coinFinalAmount'] = finalResponse['coinBought'] - btcTransferFee
      finalResponse['coinPriceKoinex'] = coinKoinexPrice
      finalResponse['koinexRevenue'] = finalResponse['coinFinalAmount'] * coinKoinexPrice
      finalResponse['profit'] = finalResponse['koinexRevenue'] - inputInr

      nodemailer.sendEmail(finalResponse)
      res.send(finalResponse)
  }, error => {
      res.send('error')
  })
})


router.get("/bchdiff", (req, res)=> {
  let promiseArray = []
  //promiseArray.push(axios.get('https://cex.io/api/last_price/ETH/EUR'))
  promiseArray.push(axios.get('https://cex.io/api/order_book/BCH/EUR/?depth=1'))
  promiseArray.push(axios.get('https://api.fixer.io/latest'))
  promiseArray.push(fetchKoinexRates())
  Promise.all(promiseArray).then(response => {

      let finalResponse = {}
      let inputInr = req.query.inputinr? req.query.inputinr: config.defaultInput
      let indianBankTax = config.indianBankTax
      let cexTax = config.cexTax
      let euroPriceInInr = response[1].data.rates.INR
      //let etherPrice = response[0].data.lprice
      let coinCexPrice = response[0].data.asks[0][0]
      let bchTransferFee = config.bchTransferFee
      let coinKoinexPrice = response[2].BCH

      finalResponse['type'] = 'BCH'
      finalResponse['inputInr'] = inputInr
      finalResponse['indianBankTax'] = inputInr * indianBankTax
      finalResponse['inputCexRawInr'] = inputInr - finalResponse['indianBankTax']
      finalResponse['inputCexRawEur'] = finalResponse['inputCexRawInr']/euroPriceInInr
      finalResponse['cexTaxEur'] = finalResponse['inputCexRawEur']* cexTax
      finalResponse['cexInputEur'] = finalResponse['inputCexRawEur'] - finalResponse['cexTaxEur']
      finalResponse['BuyRequestFee'] = finalResponse['cexInputEur'] * config.makerFeeCex
      finalResponse['coinBought'] = (finalResponse['cexInputEur'] - finalResponse['BuyRequestFee'])/coinCexPrice
      finalResponse['coinFinalAmount'] = finalResponse['coinBought'] - bchTransferFee
      finalResponse['coinPriceKoinex'] = coinKoinexPrice
      finalResponse['koinexRevenue'] = finalResponse['coinFinalAmount'] * coinKoinexPrice
      finalResponse['profit'] = finalResponse['koinexRevenue'] - inputInr

      nodemailer.sendEmail(finalResponse)
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
    //promiseArray.push(fetchCoinDeltaRates())
    Promise.all(promiseArray).then(response => {

        let finalResponse = {}
        let inputInr = req.query.inputinr? req.query.inputinr: config.defaultInput
        let indianBankTax = config.indianBankTax
        let cexTax = config.cexTax
        let euroPriceInInr = response[1].data.rates.INR
        let coinCexPrice = response[0].data.asks[0][0]
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
        finalResponse['coinBought'] = (finalResponse['cexInputEur'] - finalResponse['BuyRequestFee'])/coinCexPrice
        finalResponse['coinFinalAmount'] = finalResponse['coinBought'] - xrpTransferFee
        finalResponse['coinPriceKoinex'] = coinKoinexPrice
        finalResponse['koinexRevenue'] = finalResponse['coinFinalAmount'] * coinKoinexPrice
        finalResponse['profit'] = finalResponse['koinexRevenue'] - inputInr

        nodemailer.sendEmail(finalResponse)
        res.send(finalResponse)
    }, error => {
        res.send('error')
    })
})


function fetchKoinexRates() {
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

  function fetchCoinDeltaRates() {
    let options = {
      url : 'https://socket.coindelta.com/socket.io/?token=cryptomandi&EIO=3&transport=polling&t=M589mCY&sid=EWBM-31vOY7vDfwcJGbB',
      header : [
        {
          'cookie': '__cfduid=dc28369c5cc7973d2345345ce8e6397af1514565028; __cfruid=428f752951f9f0b15a9c4a123cb98334e22e63c2-1516844081; cf_clearance=3cc7914a39dd2fd29df81e38c74d52bb59b56f91-1517329386-14400; _ga=GA1.2.1523478833.1514565033; _gid=GA1.2.1243518662.1517287659; _gat_gtag_UA_104406898_1=1; io=EWBM-31vOY7vDfwcJGbB'
        }, {
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.81 Safari/537.36'
        }, {
          'cache-control': 'max-age=0'
        }
      ]
    }
  
    return new Promise((resolve, reject) => {
        curl.request(options, function (err, data) {
          console.log(data, err)
            // let prices = {}
            // try {
            //   prices =JSON.parse(data).prices;
            // }
            // catch(e) {
            //   console.log("Koinex cloudflare expection");
            //   reject(e)
            // }
            resolve(data)
          });
    })
  }


module.exports = router