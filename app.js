const express = require('express')
const app = express()
const router = require('./router')

app.use(router)
 let port = 7000
app.listen(port, () => console.log(`Price App listening on port ${port}!`))