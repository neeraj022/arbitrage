
var axios = require('axios')
let config = require('./config')
let util = require('./util')

let tickerFunctions = {
    indianMoney (ws) {
        let promiseArray = []
        promiseArray.push(axios.get('https://api.fixer.io/latest'))
        Promise.all(promiseArray).then(response => {
            let finalResponse = {}
            let indianBankTax = config.indianBankTax
            let cexTax = config.cexTax
            let euroPriceInInr = response[0].data.rates.INR
            finalResponse['indianBankTax'] = indianBankTax
            finalResponse['cexTax'] = cexTax
            finalResponse['makerFeeCex'] = config.makerFeeCex
            finalResponse['euroToInr'] = euroPriceInInr
            ws.emit('indianMoney', finalResponse)
        })
    },
    koinexTicker (ws) {
        let promiseArray = []
        //promiseArray.push(util.fetchKoinexRates())
        promiseArray.push(axios.get('https://koinex.in/api/ticker'))
        Promise.all(promiseArray).then(response => {
            let finalResponse = {}
            finalResponse['koinexPrices'] = response[0].data.prices
            ws.emit('koinexTicker', finalResponse)
        })
    },
    btcTicker (ws) {
        let promiseArray = []
        promiseArray.push(axios.get('https://cex.io/api/order_book/BTC/EUR/?depth=1'))
        Promise.all(promiseArray).then(response => {
            let finalResponse = {}
            finalResponse['coinCexPrice'] = response[0].data.asks[0][0]
            finalResponse['btcTransferFee'] = config.btcTransferFee
            ws.emit('btcTicker', finalResponse)
        })
    },
    ethTicker (ws) {
        let promiseArray = []
        promiseArray.push(axios.get('https://cex.io/api/order_book/ETH/EUR/?depth=1'))
        Promise.all(promiseArray).then(response => {
            let finalResponse = {}
            finalResponse['coinCexPrice'] = response[0].data.asks[0][0]
            finalResponse['ethTransferFee'] = config.ethTransferFee
            ws.emit('ethTicker', finalResponse)
        })
    },
    xrpTicker (ws) {
        let promiseArray = []
        promiseArray.push(axios.get('https://cex.io/api/order_book/XRP/EUR/?depth=1'))
        Promise.all(promiseArray).then(response => {
            let finalResponse = {}
            finalResponse['coinCexPrice'] = response[0].data.asks[0][0]
            finalResponse['xrpTransferFee'] = config.xrpTransferFee
            ws.emit('xrpTicker', finalResponse)
        })
    },
    bchTicker (ws) {
        let promiseArray = []
        promiseArray.push(axios.get('https://cex.io/api/order_book/BCH/EUR/?depth=1'))
        Promise.all(promiseArray).then(response => {
            let finalResponse = {}
            finalResponse['coinCexPrice'] = response[0].data.asks[0][0]
            finalResponse['bchTransferFee'] = config.bchTransferFee
            ws.emit('bchTicker', finalResponse)
        })
    },

}

module.exports = tickerFunctions