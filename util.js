let curl = require('curlrequest');
var axios = require('axios')
const NodeCache = require( "node-cache" );
const myCache = new NodeCache( { stdTTL: 1800, checkperiod: 120 } );
var MongoClient = require('mongodb').MongoClient;
let config = require('./config')

let utilMethods = {
    to2DecimalPlaces (value) {
        let result = value
        try {
            result = parseFloat(Math.round(value * 100) / 100).toFixed(2);
        } 
        catch (e) {

        }
        return result
    },
    to3DecimalPlaces (value) {
        let result = value
        try {
            result = parseFloat(value.toFixed(3));
        } 
        catch (e) {

        }
        return result
    },
    fetchKoinexRates() {
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
            koinexPrices = myCache.get( "koinexPrices" )
            if (koinexPrices) {
              //console.log('cache found', koinexPrices)
              resolve (koinexPrices)
            } else {
            let exceptionOccured = false
            // Connect to the db
            MongoClient.connect(config.MONGO_HOST, function (err, client) {
              const col = client.db(config.DB_NAME).collection('koinex');

              col.find().sort({ _id : -1 }).limit(1).toArray((err, dbprices) => {
                //console.log(dbprices)

                curl.request(options, function (err, data) {
                  
                                  let prices = {}
                                  try {
                                    prices = JSON.parse(data).prices;
                                  }
                                  catch(e) {
                                    console.log(new Date(),"Koinex cloudflare expection");
                                    exceptionOccured = true
                                    prices = dbprices
                                  }
                  
                  
                                  //myCache.set("koinexPrices", prices)
                                  if (!exceptionOccured) {
                                    col.insert(prices)
                                  }
                                  myCache.set("koinexPrices", prices)
                                  resolve(prices)
                                });

              })
                          
            });
          }
        })
      },
    fetchCoinDeltaRates() {
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
      },
      fetchCurrencyRates () {
        return new Promise((resolve, reject) => {
        let currencyPrices = myCache.get( "currencyPrices" )
        if (currencyPrices) {
          console.log('currency price cache found')
          resolve (currencyPrices)
        } else {
          axios.get('https://api.fixer.io/latest').then(response => {
            console.log('setting currency price cache')
            myCache.set("currencyPrices", response.data)
            resolve(response.data)
          }, error => {
            reject (error)
          })
        }
    })
  }
}



module.exports = utilMethods