const express = require('express')
var axios = require('axios')
var router = express.Router();
const WebSocket = require('ws');
let config = require('./config')
let sms = require('./sms')
let nodemailer = require('./nodemailer')
let util = require('./util')
var MongoClient = require('mongodb').MongoClient;

router.get("/", (req, res) => {
  res.send('Welcome to landing page')
})


router.get("/ethdiff", (req, res)=> {
    let promiseArray = []
    //promiseArray.push(axios.get('https://cex.io/api/last_price/ETH/EUR'))
    promiseArray.push(axios.get('https://cex.io/api/order_book/ETH/EUR/?depth=1'))
    // promiseArray.push(axios.get('https://api.fixer.io/latest'))
    promiseArray.push(util.fetchCurrencyRates())
    promiseArray.push(util.fetchKoinexRates())
    Promise.all(promiseArray).then(response => {

        let finalResponse = {}
        let inputInr = req.query.inputinr? req.query.inputinr: config.defaultInput
        let indianBankTax = config.indianBankTax
        let cexTax = config.cexTax
        let euroPriceInInr = response[1].rates.INR
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
  //promiseArray.push(axios.get('https://api.fixer.io/latest'))
  promiseArray.push(util.fetchCurrencyRates())
  promiseArray.push(util.fetchKoinexRates())
  Promise.all(promiseArray).then(response => {

      let finalResponse = {}
      let inputInr = req.query.inputinr? req.query.inputinr: config.defaultInput
      let indianBankTax = config.indianBankTax
      let cexTax = config.cexTax
      let euroPriceInInr = response[1].rates.INR
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
  //promiseArray.push(axios.get('https://api.fixer.io/latest'))
  promiseArray.push(util.fetchCurrencyRates())
  promiseArray.push(util.fetchKoinexRates())
  Promise.all(promiseArray).then(response => {

      let finalResponse = {}
      let inputInr = req.query.inputinr? req.query.inputinr: config.defaultInput
      let indianBankTax = config.indianBankTax
      let cexTax = config.cexTax
      let euroPriceInInr = response[1].rates.INR
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
    //promiseArray.push(axios.get('https://api.fixer.io/latest'))
    promiseArray.push(util.fetchCurrencyRates())
    promiseArray.push(util.fetchKoinexRates())
    //promiseArray.push(fetchCoinDeltaRates())
    Promise.all(promiseArray).then(response => {

        let finalResponse = {}
        let inputInr = req.query.inputinr? req.query.inputinr: config.defaultInput
        let indianBankTax = config.indianBankTax
        let cexTax = config.cexTax
        let euroPriceInInr = response[1].rates.INR
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
  //promiseArray.push(axios.get('https://api.fixer.io/latest'))
  promiseArray.push(util.fetchCurrencyRates())
  promiseArray.push(util.fetchKoinexRates())
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
      let euroPriceInInr = response[0].rates.INR

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
  //promiseArray.push(axios.get('https://api.fixer.io/latest'))
  promiseArray.push(util.fetchCurrencyRates())
  promiseArray.push(util.fetchKoinexRates())
  promiseArray.push(axios.get('https://cex.io/api/order_book/ETH/EUR/?depth=1'))
  promiseArray.push(axios.get('https://cex.io/api/order_book/XRP/EUR/?depth=1'))
  promiseArray.push(axios.get('https://cex.io/api/order_book/BTC/EUR/?depth=1'))
  promiseArray.push(axios.get('https://cex.io/api/order_book/BCH/EUR/?depth=1'))
  Promise.all(promiseArray).then(response => {

      let finalResponse = {}
      let inputInr = req.query.inputinr? req.query.inputinr: config.defaultInput
      let indianBankTax = config.indianBankTax
      let cexTax = config.cexTax
      let euroPriceInInr = response[0].rates.INR

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


router.get("/initialDifferenceData", (req, res)=> {
  var ip = req.connection.remoteAddress || req.headers['x-forwarded-for']
   || 
  req.socket.remoteAddress ||
  (req.connection.socket ? req.connection.socket.remoteAddress : null);
  console.log('reqeust ip is', ip)

  //logging request ip detection
  axios.get(`https://tools.keycdn.com/geo.json?host=${ip}`).then(ipdetectResponse => {
    console.log(ipdetectResponse.data)
    MongoClient.connect(config.MONGO_HOST, function (err, client) {
      const col = client.db(config.DB_NAME).collection('viewlocations');
      col.insert({date: new Date(), data: ipdetectResponse.data})
    })
  })


  let promiseArray = []
  //promiseArray.push(axios.get('https://api.fixer.io/latest'))
  promiseArray.push(util.fetchCurrencyRates())
  promiseArray.push(util.fetchKoinexRates())
  //promiseArray.push(axios.get('https://koinex.in/api/ticker'))
  promiseArray.push(axios.get('https://cex.io/api/order_book/ETH/EUR/?depth=1'))
  promiseArray.push(axios.get('https://cex.io/api/order_book/XRP/EUR/?depth=1'))
  promiseArray.push(axios.get('https://cex.io/api/order_book/BTC/EUR/?depth=1'))
  promiseArray.push(axios.get('https://cex.io/api/order_book/BCH/EUR/?depth=1'))
  Promise.all(promiseArray).then(response => {
      let finalResponse = {}

      let indianMoney = {}
      let indianBankTax = config.indianBankTax
      let cexTax = config.cexTax
      let euroPriceInInr = response[0].rates.INR
      indianMoney['indianBankTax'] = indianBankTax
      indianMoney['cexTax'] = cexTax
      indianMoney['makerFeeCex'] = config.makerFeeCex
      indianMoney['euroToInr'] = euroPriceInInr

      let koinexTicker = {}
      koinexTicker = response[1]
      
      let ethTicker = {}
      ethTicker['coinCexPrice'] = response[2].data.asks[0][0]
      ethTicker['ethTransferFee'] = config.ethTransferFee

      let xrpTicker = {}
      xrpTicker['coinCexPrice'] = response[3].data.asks[0][0]
      xrpTicker['xrpTransferFee'] = config.xrpTransferFee

      let btcTicker = {}
      btcTicker['coinCexPrice'] = response[4].data.asks[0][0]
      btcTicker['btcTransferFee'] = config.btcTransferFee

      let bchTicker = {}
      bchTicker['coinCexPrice'] = response[5].data.asks[0][0]
      bchTicker['bchTransferFee'] = config.bchTransferFee

      finalResponse["indianMoney"] = indianMoney
      finalResponse["btcTicker"] = btcTicker
      finalResponse["ethTicker"] = ethTicker
      finalResponse["xrpTicker"] = xrpTicker
      finalResponse["bchTicker"] = bchTicker
      finalResponse["koinexTicker"] = koinexTicker

      res.send(finalResponse)
  }, error => {
      res.send(error)
  })
})



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


module.exports = router