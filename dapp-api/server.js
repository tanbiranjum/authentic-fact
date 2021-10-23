const app = require('./app')
const mongoose = require('mongoose')
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

mongoose
  .connect('mongodb://localhost/dapp', {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB successfully connected 😱')
  })

const port = 3000

app.listen(port, () => {
  console.log(`This app listening on ${port} 🚀`)
})
