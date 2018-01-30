const express = require('express')
var axios = require('axios')
var router = express.Router();
const WebSocket = require('ws');

router.get("/cexprice", (req, res)=> {
    const ws = new WebSocket('wss://troll.coindelta.com:4000/socket.io/?EIO=3&transport=websocket&sid=TQ8gNCxFjI9PaG4gAoei', {
        perMessageDeflate: false
      })
      
      ws.on('message', function incoming(data) {
        console.log(data);
      });
    let promiseArray = []
    promiseArray.push(axios.get('https://cex.io/api/last_price/ETH/EUR'))
    // https://cex.io/api/order_book/ETH/EUR/?depth=3
    promiseArray.push(axios.get('https://api.fixer.io/latest'))
    Promise.all(promiseArray).then(response => {

        let finalResponse = {}
        let inputInr = req.query.inputinr? req.query.inputinr: 100000
        let indianBankTax = 3.5
        let cexTax = 3.5
        let euroPriceInInr = response[1].data.rates.INR
        let etherPrice = response[0].data.lprice


        finalResponse['inputInr'] = inputInr
        finalResponse['indianBankTax'] = inputInr * indianBankTax * 1.18/100
        finalResponse['inputCexRawInr'] = inputInr - finalResponse['indianBankTax']
        finalResponse['inputCexRawEur'] = finalResponse['inputCexRawInr']/euroPriceInInr
        finalResponse['cexTaxEur'] = finalResponse['inputCexRawEur']* cexTax/100
        finalResponse['cexInputEur'] = finalResponse['inputCexRawEur'] - finalResponse['cexTaxEur']
        finalResponse['etherBought'] = finalResponse['cexInputEur']/etherPrice


        res.send(finalResponse)
    }, error => {
        res.send('error')
    })
})


module.exports = router