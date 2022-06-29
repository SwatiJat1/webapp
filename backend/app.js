const express = require("express");
const app = express();
var cors = require('cors')
const cookieParser=require('cookie-parser');
const bodyparser= require('body-parser')
const path = require('path')
const errorMiddleware=require('./middlewares/errors')
if (process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({ path: 'backend/config/config.env' })

const products = require("./routes/product");
const auth=require('./routes/auth')
const order=require('./routes/order')
const payment=require('./routes/payment')

const dotenv = require("dotenv");
const fileUpload=require('express-fileupload')
dotenv.config({path:'backend/config/congif.env'})

app.use(express.json());
app.use(cookieParser())
app.use(cors())
app.use(bodyparser.urlencoded({extended:true}));
app.use(fileUpload());



app.use("/api/v1", products);
app.use('/api/v1',auth);
app.use('/api/v1',payment);
app.use('/api/v1',order)

if (process.env.NODE_ENV === 'PRODUCTION') {
    app.use(express.static(path.join(__dirname, 'frontend/build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend/build/index.html'))
    })
}


app.use(errorMiddleware)
module.exports = app;
