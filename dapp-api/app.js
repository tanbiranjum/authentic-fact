const path = require('path')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const AppError = require('./util/appError')
const userRoutes = require('./routes/user')
const postRoutes = require('./routes/post')
const nftRoutes = require('./routes/nftRoutes')
var cookieParser = require('cookie-parser')
// const bodyParser = require('body-parser')

const app = express()

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'view'))
app.use(express.static(path.join(__dirname, 'public')))

var whitelist = [
  'http://localhost:8080',
  'http://localhost:8081',
  'http://localhost:5000',
  '*'
]

const corsOption = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}
app.use(cors(corsOption))
app.use(cookieParser())
app.use(express.json())

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}


app.use('/api/v1/nft', nftRoutes)
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/post', postRoutes)

module.exports = app
