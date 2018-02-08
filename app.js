const express = require('express')
const app = express()
const router = require('./router')
let ticker = require('./ticker')

var server = require('ws').Server;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-HTTP-Method-Override, Content-Type, x-requested-with, authorization");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    next();
});


app.use(router)
//  let port = 7000
// app.listen(port, () => console.log(new Date(), `Price App listening on port ${port}!`))

var server = require('http').createServer(app);  

var io = require('socket.io')(server);


server.listen(7000); 


io.on('connection', function(ws) {
    // ws.on('message', (message) => {
    //     var json = JSON.parse(message)
    //     if(json.type=='name') {
    //         ws.personName = json.data
    //         return ;
    //     }
    //     s.clients.forEach(client => {
    //         if (client!=ws) {
    //             client.send(JSON.stringify({
    //                 name: ws.personName,
    //                 data: json.data
    //             }))
    //         }
    //     })
    // })

    setInterval (() => {
        ticker.indianMoney(ws)
        ticker.btcTicker(ws)
        ticker.ethTicker(ws)
        ticker.xrpTicker(ws)
        ticker.bchTicker(ws)
    }, 200000)

    setInterval (() => {
        ticker.koinexTicker(ws)
    }, 200000)

    console.log('client connected')
    ws.on('close', () => {
        console.log('lost a client')
    })
})