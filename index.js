const express = require('express')
const cors = require('cors')
const { ServerApiVersion, MongoClient, ObjectId } = require('mongodb')
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
    const usersCollection = client.db('lovepost').collection('users')
    const imagePostCollection = client.db('lovepost').collection('imagePost')

    // get users
    app.get('/users', async (req, res) => {
      const query = {}
      const cursor = usersCollection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })

    // get one user
    app.get('/user/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const result = await usersCollection.findOne(query)
      res.send(result)
    })

    // create users
    app.put('/user/:email', async (req, res) => {
      const email = req.params.email
      const userInfo = req.body
      console.log(userInfo)
      const filter = { email: email }
      const options = { upsert: true }
      const updateDoc = {
        $set: {
          displayName: userInfo.displayName,
          photoURL: userInfo.photoURL,
        },
      }
      const result = await usersCollection.updateOne(filter, updateDoc, options)
      res.send(result)
    })

    // get images
    app.get('/post/images', async (req, res) => {
      const query = {}
      const cursor = imagePostCollection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })

    // image post
    app.post('/post/image', async (req, res) => {
      const newPost = req.body
      const result = await imagePostCollection.insertOne(newPost)
      res.send(result)
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
