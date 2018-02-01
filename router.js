const express = require('express')
var axios = require('axios')
var router = express.Router();
const WebSocket = require('ws');
let config = require('./config')
let sms = require('./sms')
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

router.get("/alldiff", (req, res)=> {
  let promiseArray = []
  //promiseArray.push(axios.get('https://cex.io/api/last_price/XRP/EUR'))
  promiseArray.push(axios.get('https://api.fixer.io/latest'))
  promiseArray.push(fetchKoinexRates())
  promiseArray.push(axios.get('https://cex.io/api/order_book/ETH/EUR/?depth=1'))
  promiseArray.push(axios.get('https://cex.io/api/order_book/XRP/EUR/?depth=1'))
  promiseArray.push(axios.get('https://cex.io/api/order_book/BTC/EUR/?depth=1'))
  promiseArray.push(axios.get('https://cex.io/api/order_book/BCH/EUR/?depth=1'))
  //promiseArray.push(fetchCoinDeltaRates())
  Promise.all(promiseArray).then(response => {

      let finalResponse = {}
      let inputInr = req.query.inputinr? req.query.inputinr: config.defaultInput
      let indianBankTax = config.indianBankTax
      let cexTax = config.cexTax
      let euroPriceInInr = response[0].data.rates.INR

      let ethCexPrice = response[2].data.asks[0][0]
      let ethTransferFee = config.ethTransferFee
      let ethKoinexPrice = response[1].ETH

      let xrpCexPrice = response[3].data.asks[0][0]
      let xrpTransferFee = config.xrpTransferFee
      let xrpKoinexPrice = response[1].XRP

      let btcCexPrice = response[4].data.asks[0][0]
      let btcTransferFee = config.btcTransferFee
      let btcKoinexPrice = response[1].BTC

      let bchCexPrice = response[5].data.asks[0][0]
      let bchTransferFee = config.bchTransferFee
      let bchKoinexPrice = response[1].BCH

      finalResponse['type']= 'ALL'
      finalResponse['inputInr'] = inputInr
      finalResponse['indianBankTax'] = inputInr * indianBankTax
      finalResponse['inputCexRawInr'] = inputInr - finalResponse['indianBankTax']
      finalResponse['inputCexRawEur'] = finalResponse['inputCexRawInr']/euroPriceInInr
      finalResponse['cexTaxEur'] = finalResponse['inputCexRawEur']* cexTax
      finalResponse['cexInputEur'] = finalResponse['inputCexRawEur'] - finalResponse['cexTaxEur']
      finalResponse['BuyRequestFee'] = finalResponse['cexInputEur'] * config.makerFeeCex

      finalResponse['ETH'] = {}
      finalResponse['ETH']['coinBought'] = (finalResponse['cexInputEur'] - finalResponse['BuyRequestFee'])/ethCexPrice
      finalResponse['ETH']['coinFinalAmount'] = finalResponse['ETH']['coinBought'] - ethTransferFee
      finalResponse['ETH']['coinPriceKoinex'] = ethKoinexPrice
      finalResponse['ETH']['koinexRevenue'] = finalResponse['ETH']['coinFinalAmount'] * ethKoinexPrice
      finalResponse['ETH']['profit'] = finalResponse['ETH']['koinexRevenue'] - inputInr

      finalResponse['XRP'] = {}
      finalResponse['XRP']['coinBought'] = (finalResponse['cexInputEur'] - finalResponse['BuyRequestFee'])/xrpCexPrice
      finalResponse['XRP']['coinFinalAmount'] = finalResponse['XRP']['coinBought'] - xrpTransferFee
      finalResponse['XRP']['coinPriceKoinex'] = xrpKoinexPrice
      finalResponse['XRP']['koinexRevenue'] = finalResponse['XRP']['coinFinalAmount'] * xrpKoinexPrice
      finalResponse['XRP']['profit'] = finalResponse['XRP']['koinexRevenue'] - inputInr

      finalResponse['BTC'] = {}
      finalResponse['BTC']['coinBought'] = (finalResponse['cexInputEur'] - finalResponse['BuyRequestFee'])/btcCexPrice
      finalResponse['BTC']['coinFinalAmount'] = finalResponse['BTC']['coinBought'] - btcTransferFee
      finalResponse['BTC']['coinPriceKoinex'] = btcKoinexPrice
      finalResponse['BTC']['koinexRevenue'] = finalResponse['BTC']['coinFinalAmount'] * btcKoinexPrice
      finalResponse['BTC']['profit'] = finalResponse['BTC']['koinexRevenue'] - inputInr

      finalResponse['BCH'] = {}
      finalResponse['BCH']['coinBought'] = (finalResponse['cexInputEur'] - finalResponse['BuyRequestFee'])/bchCexPrice
      finalResponse['BCH']['coinFinalAmount'] = finalResponse['BCH']['coinBought'] - bchTransferFee
      finalResponse['BCH']['coinPriceKoinex'] = bchKoinexPrice
      finalResponse['BCH']['koinexRevenue'] = finalResponse['BCH']['coinFinalAmount'] * bchKoinexPrice
      finalResponse['BCH']['profit'] = finalResponse['BCH']['koinexRevenue'] - inputInr

      calculateMaximumProfit(finalResponse)
      console.log(new Date(), 'maximum profit is' , finalResponse.maxProfitCoin, finalResponse.maxProfit)
      if (finalResponse.maxProfit>=config.maxProfitThreshold) {
        //sms.sendSms('MAXIMUM Profit on '+ finalResponse.maxProfitCoin + ' '+ finalResponse.maxProfit)
        nodemailer.sendEmailAll(finalResponse)
      }
      res.send(finalResponse)
  }, error => {
      res.send('error')
  })
})


router.get("/favourablecextransfer", (req, res)=> {
  let promiseArray = []
  promiseArray.push(axios.get('https://api.fixer.io/latest'))
  promiseArray.push(fetchKoinexRates())
  promiseArray.push(axios.get('https://cex.io/api/order_book/ETH/EUR/?depth=1'))
  promiseArray.push(axios.get('https://cex.io/api/order_book/XRP/EUR/?depth=1'))
  promiseArray.push(axios.get('https://cex.io/api/order_book/BTC/EUR/?depth=1'))
  promiseArray.push(axios.get('https://cex.io/api/order_book/BCH/EUR/?depth=1'))
  Promise.all(promiseArray).then(response => {

      let finalResponse = {}
      let inputInr = req.query.inputinr? req.query.inputinr: config.defaultInput
      let indianBankTax = config.indianBankTax
      let cexTax = config.cexTax
      let euroPriceInInr = response[0].data.rates.INR

      let ethCexPrice = response[2].data.bids[0][0]
      let ethTransferFee = config.ethTransferFee
      let ethKoinexPrice = response[1].ETH

      let xrpCexPrice = response[3].data.bids[0][0]
      let xrpTransferFee = config.xrpTransferFee
      let xrpKoinexPrice = response[1].XRP

      let btcCexPrice = response[4].data.bids[0][0]
      let btcTransferFee = config.btcTransferFee
      let btcKoinexPrice = response[1].BTC

      let bchCexPrice = response[5].data.bids[0][0]
      let bchTransferFee = config.bchTransferFee
      let bchKoinexPrice = response[1].BCH

      finalResponse['indianBankTax'] = inputInr * indianBankTax
      finalResponse['inputCexRawInr'] = inputInr - finalResponse['indianBankTax']
      finalResponse['inputCexRawEur'] = finalResponse['inputCexRawInr']/euroPriceInInr
      finalResponse['cexTaxEur'] = finalResponse['inputCexRawEur']* cexTax
      finalResponse['cexInputEur'] = finalResponse['inputCexRawEur'] - finalResponse['cexTaxEur']

      finalResponse['type']= 'ALL'
      finalResponse['inputInr'] = inputInr
      finalResponse['koinexDepositFee'] = inputInr * config.koinexDepositFee
      finalResponse['BuyRequestFee'] = (finalResponse['inputInr'] - finalResponse['koinexDepositFee']) * config.makerFeeCex
      finalResponse['AvailableInr'] = (finalResponse['inputInr'] - finalResponse['koinexDepositFee'] - finalResponse['BuyRequestFee'])

      finalResponse['ETH'] = {}
      finalResponse['ETH']['coinBought'] = (finalResponse['AvailableInr'])/ethKoinexPrice
      finalResponse['ETH']['coinFinalAmount'] = finalResponse['ETH']['coinBought'] - ethTransferFee
      finalResponse['ETH']['amountOnCex'] = finalResponse['ETH']['coinFinalAmount'] * ethCexPrice

      finalResponse['XRP'] = {}
      finalResponse['XRP']['coinBought'] = (finalResponse['AvailableInr'])/xrpKoinexPrice
      finalResponse['XRP']['coinFinalAmount'] = finalResponse['XRP']['coinBought'] - xrpTransferFee
      finalResponse['XRP']['amountOnCex'] = finalResponse['XRP']['coinFinalAmount'] * xrpCexPrice

      finalResponse['BTC'] = {}
      finalResponse['BTC']['coinBought'] = (finalResponse['AvailableInr'])/btcKoinexPrice
      finalResponse['BTC']['coinFinalAmount'] = finalResponse['BTC']['coinBought'] - btcTransferFee
      finalResponse['BTC']['amountOnCex'] = finalResponse['BTC']['coinFinalAmount'] * btcCexPrice

      finalResponse['BCH'] = {}
      finalResponse['BCH']['coinBought'] = (finalResponse['AvailableInr'])/bchKoinexPrice
      finalResponse['BCH']['coinFinalAmount'] = finalResponse['BCH']['coinBought'] - bchTransferFee
      finalResponse['BCH']['amountOnCex'] = finalResponse['BCH']['coinFinalAmount'] * bchCexPrice

      calculateMaxCexAmount(finalResponse)
      console.log(new Date(), 'maximum amount is' , finalResponse.maxAmountCexCoin, finalResponse.maxAmountCex,'bank transfer price is', finalResponse['cexInputEur'])
      if (finalResponse.maxAmountCex>=finalResponse['cexInputEur']) {
        //sms.sendSms('MAXIMUM Profit on '+ finalResponse.maxProfitCoin + ' '+ finalResponse.maxProfit)
        nodemailer.sendEmailReverseTransfer(finalResponse)
      }
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
              console.log(new Date(),"Koinex cloudflare expection");
              reject(e)
            }
            resolve(prices)
          });
    })
  }
  function calculateMaxCexAmount (finalResponse) {
    let maxAmount = finalResponse.ETH.amountOnCex
    let maxAmountCoin = 'ETH'
    if (finalResponse.XRP.amountOnCex > maxAmount) {
      maxAmount = finalResponse.XRP.amountOnCex
      maxAmountCoin = 'XRP'
    }
    if (finalResponse.BTC.amountOnCex > maxAmount) {
      maxAmount = finalResponse.BTC.amountOnCex
      maxAmountCoin = 'BTC'
    }
    if (finalResponse.BCH.amountOnCex > maxAmount) {
      maxAmount = finalResponse.BCH.amountOnCex
      maxAmountCoin = 'BCH'
    }
    finalResponse ['maxAmountCexCoin'] = maxAmountCoin
    finalResponse ['maxAmountCex'] = maxAmount
    return 
  }

  function calculateMaximumProfit (finalResponse) {
    let maxProfit = finalResponse.ETH.profit
    let maxProfitCoin = 'ETH'
    if (finalResponse.XRP.profit > maxProfit) {
      maxProfit = finalResponse.XRP.profit
      maxProfitCoin = 'XRP'
    }
    if (finalResponse.BTC.profit < maxProfit) {
      maxProfit = finalResponse.BTC.profit
      maxProfitCoin = 'BTC'
    }
    if (finalResponse.BCH.profit < maxProfit) {
      maxProfit = finalResponse.BCH.profit
      maxProfitCoin = 'BCH'
    }
    finalResponse ['maxProfitCoin'] = maxProfitCoin
    finalResponse ['maxProfit'] = maxProfit
    return 
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