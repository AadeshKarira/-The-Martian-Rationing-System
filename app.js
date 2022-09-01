const express = require('express');
const app = express();
require('dotenv').config();
require('./config/db');
app.use(express.json({limit: '5mb'}));

const { ration } = require('./src/');
app.use(ration);


app.use((req, res, next) => {
    res.status(404).json({
        message: 'Ohh you are lost, read the API documentation to find your way back home :)'
    })
})

app.listen(process.env.PORT, () => {
    console.log(`server running on PORT ${process.env.PORT}`);
})