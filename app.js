const express = require("express")
const cors = require("cors")
require('dotenv').config();

const dbConnect = require('./config/mongo')

const app = express()

// Middleware para CORS y JSON
app.use(cors());
app.use(express.json());

// Puerto
const port = process.env.PORT || 3001

app.listen(port, () => {
    console.log("Servidor escuchando en el puerto " + port)
})

dbConnect()