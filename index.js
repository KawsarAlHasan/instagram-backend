const express = require('express')
const cors = require('cors')
const { ServerApiVersion, MongoClient } = require('mongodb')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o35z3.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
})

async function run() {
  try {
    await client.connect()
    const studentCollection = client.db('lovepost').collection('users')

    // create users
    app.put('/user', (req, res) => {
      res.send('Got a PUT request at /user')
    })
  } finally {
  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Running Love Post App')
})

app.listen(port, () => {
  console.log('SERVER IS RUNNING')
})
