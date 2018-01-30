const nodemailer = require('nodemailer');
let config = require('./config')
let util = require('./util')
// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
let emailObj = 
{
    sendEmail (priceObj) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'neerajybkp3@gmail.com', // generated ethereal user
            pass: 'lgkp500cookie'  // generated ethereal password
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Neeraj Yadav" <neerajybkp3@gmail.com>', // sender address
        to: config.emailReceivers, // list of receivers
        subject: `${priceObj.type} Profit ${util.to2DecimalPlaces(priceObj.profit)}`, // Subject line
        text: JSON.stringify(priceObj), // plain text body
        html: 
        `<head>
        <style>
        #customers {
            font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
            border-collapse: collapse;
            width: 100%;
        }
        
        #customers td, #customers th {
            border: 1px solid #ddd;
            padding: 8px;
        }
        
        #customers tr:nth-child(even){background-color: #f2f2f2;}
        
        #customers tr:hover {background-color: #ddd;}
        
        #customers th {
            padding-top: 12px;
            padding-bottom: 12px;
            text-align: left;
            background-color: #4CAF50;
            color: white;
        }
        .boxes {margin-bottom: 60px;}
        </style>
        </head>
        <body>
        <div class="boxes">
        <h2>${priceObj.type} Buying</h2>
        <table id="customers">
        <thead>
            <tr>
                <th>Type</th>
                <th>Value</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Input (INR)</td>
                <td>${util.to2DecimalPlaces(priceObj.inputInr)}</td>
            </tr> 
            <tr>
                <td>Indian Bank Tax (INR)</td>
                <td>${util.to2DecimalPlaces(priceObj.indianBankTax)}</td>
            </tr>
            <tr>
                <td>Cex Tax (EUR)</td>
                <td>${util.to2DecimalPlaces(priceObj.cexTaxEur)}</td>
            </tr> 
            <tr>
                <td>Cex Deposit Amount (EUR)</td>
                <td>${util.to2DecimalPlaces(priceObj.cexInputEur)}</td>
            </tr>
            <tr>
                <td>Buy Request Fee (EUR)</td>
                <td>${util.to2DecimalPlaces(priceObj.BuyRequestFee)}</td>
            </tr>
            <tr>
                <td>${priceObj.type} Bought</td>
                <td>${util.to3DecimalPlaces(priceObj.coinBought)}</td>
            </tr>
            <tr>
                <td>${priceObj.type} Final Amount in indian exchange</td>
                <td>${util.to3DecimalPlaces(priceObj.coinFinalAmount)}</td>
            </tr>
        </tbody>
        </table>
        </div>

        <div class="boxes">
        <h2> ${priceObj.type} Selling</h2>
        <table id="customers">
        <thead>
            <tr>
                <th>Type</th>
                <th>Koinex</th>
                <th>CoinDelta</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Price (INR)</td>
                <td>${util.to2DecimalPlaces(priceObj.coinPriceKoinex)}</td>
                <td>${util.to2DecimalPlaces(priceObj.coinPriceKoinex)}</td>
            </tr>
            <tr>
                <td>Amount after selling (INR)</td>
                <td>${util.to2DecimalPlaces(priceObj.koinexRevenue)}</td>
                <td>${util.to2DecimalPlaces(priceObj.koinexRevenue)}</td>
            </tr>
            <tr>
            <td>Profit (INR)</td>
            <td>${util.to2DecimalPlaces(priceObj.profit)}</td>
            <td>${util.to2DecimalPlaces(priceObj.profit)}</td>
        </tr>
        </tbody>
        </table>
        </div>


        </body>`
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        // console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
},
sendEmailAll (priceObj) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'neerajybkp3@gmail.com', // generated ethereal user
            pass: 'lgkp500cookie'  // generated ethereal password
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Neeraj Yadav" <neerajybkp3@gmail.com>', // sender address
        to: config.emailReceivers, // list of receivers
        subject: `${priceObj.maxProfitCoin} Profit ${util.to2DecimalPlaces(priceObj.maxProfit)}`, // Subject line
        text: JSON.stringify(priceObj), // plain text body
        html: 
        `<head>
        <style>
        #customers {
            font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
            border-collapse: collapse;
            width: 100%;
        }
        
        #customers td, #customers th {
            border: 1px solid #ddd;
            padding: 8px;
        }
        
        #customers tr:nth-child(even){background-color: #f2f2f2;}
        
        #customers tr:hover {background-color: #ddd;}
        
        #customers th {
            padding-top: 12px;
            padding-bottom: 12px;
            text-align: left;
            background-color: #4CAF50;
            color: white;
        }
        .boxes {margin-bottom: 60px;}
        </style>
        </head>
        <body>
        <div class="boxes">
        <h2>Buying</h2>
        <table id="customers">
        <thead>
            <tr>
                <th>Type</th>
                <th>Value</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Input (INR)</td>
                <td>${util.to2DecimalPlaces(priceObj.inputInr)}</td>
            </tr> 
            <tr>
                <td>Indian Bank Tax (INR)</td>
                <td>${util.to2DecimalPlaces(priceObj.indianBankTax)}</td>
            </tr>
            <tr>
                <td>Cex Tax (EUR)</td>
                <td>${util.to2DecimalPlaces(priceObj.cexTaxEur)}</td>
            </tr> 
            <tr>
                <td>Cex Deposit Amount (EUR)</td>
                <td>${util.to2DecimalPlaces(priceObj.cexInputEur)}</td>
            </tr>
            <tr>
                <td>Buy Request Fee (EUR)</td>
                <td>${util.to2DecimalPlaces(priceObj.BuyRequestFee)}</td>
            </tr> 
        </tbody>
        </table>
        </div>

        <div class="boxes">
        <h2> ETH Selling</h2>
        <table id="customers">
        <thead>
            <tr>
                <th>Type</th>
                <th>Koinex</th>
                <th>CoinDelta</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>ETH Bought</td>
                <td>${util.to3DecimalPlaces(priceObj.ETH.coinBought)}</td>
                <td>${util.to3DecimalPlaces(priceObj.ETH.coinBought)}</td>
            </tr>
            <tr>
                <td>ETH Final Amount in indian exchange</td>
                <td>${util.to3DecimalPlaces(priceObj.ETH.coinFinalAmount)}</td>
                <td>${util.to3DecimalPlaces(priceObj.ETH.coinFinalAmount)}</td>
            </tr>
            <tr>
                <td>Price (INR)</td>
                <td>${util.to2DecimalPlaces(priceObj.ETH.coinPriceKoinex)}</td>
                <td>${util.to2DecimalPlaces(priceObj.ETH.coinPriceKoinex)}</td>
            </tr>
            <tr>
                <td>Amount after selling (INR)</td>
                <td>${util.to2DecimalPlaces(priceObj.ETH.koinexRevenue)}</td>
                <td>${util.to2DecimalPlaces(priceObj.ETH.koinexRevenue)}</td>
            </tr>
            <tr>
            <td>Profit (INR)</td>
            <td>${util.to2DecimalPlaces(priceObj.ETH.profit)}</td>
            <td>${util.to2DecimalPlaces(priceObj.ETH.profit)}</td>
        </tr>
        </tbody>
        </table>
        </div>

        <div class="boxes">
        <h2> XRP Selling</h2>
        <table id="customers">
        <thead>
            <tr>
                <th>Type</th>
                <th>Koinex</th>
                <th>CoinDelta</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>XRP Bought</td>
                <td>${util.to3DecimalPlaces(priceObj.XRP.coinBought)}</td>
                <td>${util.to3DecimalPlaces(priceObj.XRP.coinBought)}</td>
            </tr>
            <tr>
                <td>XRP Final Amount in indian exchange</td>
                <td>${util.to3DecimalPlaces(priceObj.XRP.coinFinalAmount)}</td>
                <td>${util.to3DecimalPlaces(priceObj.XRP.coinFinalAmount)}</td>
            </tr>
            <tr>
                <td>Price (INR)</td>
                <td>${util.to2DecimalPlaces(priceObj.XRP.coinPriceKoinex)}</td>
                <td>${util.to2DecimalPlaces(priceObj.XRP.coinPriceKoinex)}</td>
            </tr>
            <tr>
                <td>Amount after selling (INR)</td>
                <td>${util.to2DecimalPlaces(priceObj.XRP.koinexRevenue)}</td>
                <td>${util.to2DecimalPlaces(priceObj.XRP.koinexRevenue)}</td>
            </tr>
            <tr>
            <td>Profit (INR)</td>
            <td>${util.to2DecimalPlaces(priceObj.XRP.profit)}</td>
            <td>${util.to2DecimalPlaces(priceObj.XRP.profit)}</td>
        </tr>
        </tbody>
        </table>
        </div>

        <div class="boxes">
        <h2> BTC Selling</h2>
        <table id="customers">
        <thead>
            <tr>
                <th>Type</th>
                <th>Koinex</th>
                <th>CoinDelta</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>BTC Bought</td>
                <td>${util.to3DecimalPlaces(priceObj.BTC.coinBought)}</td>
                <td>${util.to3DecimalPlaces(priceObj.BTC.coinBought)}</td>
            </tr>
            <tr>
                <td>BTC Final Amount in indian exchange</td>
                <td>${util.to3DecimalPlaces(priceObj.BTC.coinFinalAmount)}</td>
                <td>${util.to3DecimalPlaces(priceObj.BTC.coinFinalAmount)}</td>
            </tr>
            <tr>
                <td>Price (INR)</td>
                <td>${util.to2DecimalPlaces(priceObj.BTC.coinPriceKoinex)}</td>
                <td>${util.to2DecimalPlaces(priceObj.BTC.coinPriceKoinex)}</td>
            </tr>
            <tr>
                <td>Amount after selling (INR)</td>
                <td>${util.to2DecimalPlaces(priceObj.BTC.koinexRevenue)}</td>
                <td>${util.to2DecimalPlaces(priceObj.BTC.koinexRevenue)}</td>
            </tr>
            <tr>
            <td>Profit (INR)</td>
            <td>${util.to2DecimalPlaces(priceObj.BTC.profit)}</td>
            <td>${util.to2DecimalPlaces(priceObj.BTC.profit)}</td>
        </tr>
        </tbody>
        </table>
        </div>


        <div class="boxes">
        <h2> BCH Selling</h2>
        <table id="customers">
        <thead>
            <tr>
                <th>Type</th>
                <th>Koinex</th>
                <th>CoinDelta</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>BCH Bought</td>
                <td>${util.to3DecimalPlaces(priceObj.BCH.coinBought)}</td>
                <td>${util.to3DecimalPlaces(priceObj.BCH.coinBought)}</td>
            </tr>
            <tr>
                <td>BCH Final Amount in indian exchange</td>
                <td>${util.to3DecimalPlaces(priceObj.BCH.coinFinalAmount)}</td>
                <td>${util.to3DecimalPlaces(priceObj.BCH.coinFinalAmount)}</td>
            </tr>
            <tr>
                <td>Price (INR)</td>
                <td>${util.to2DecimalPlaces(priceObj.BCH.coinPriceKoinex)}</td>
                <td>${util.to2DecimalPlaces(priceObj.BCH.coinPriceKoinex)}</td>
            </tr>
            <tr>
                <td>Amount after selling (INR)</td>
                <td>${util.to2DecimalPlaces(priceObj.BCH.koinexRevenue)}</td>
                <td>${util.to2DecimalPlaces(priceObj.BCH.koinexRevenue)}</td>
            </tr>
            <tr>
            <td>Profit (INR)</td>
            <td>${util.to2DecimalPlaces(priceObj.BCH.profit)}</td>
            <td>${util.to2DecimalPlaces(priceObj.BCH.profit)}</td>
        </tr>
        </tbody>
        </table>
        </div>


        </body>`
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        // console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
}
}

module.exports = emailObj