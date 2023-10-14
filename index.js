const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
app.use(cors());
app.use(express.json());

// mongoDB connect
const uri = "mongodb+srv://curd-recap:IAPOCKmqKaOKqh7U@cluster0.bjwj9uc.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();




        // -----------step -1 start-------Create API--------
        // Connect to the "userDB" database and access its "users" collection
        const database = client.db("usersDB");
        const usersCollections = database.collection("users");

        // create API
        app.post('/users', async (req, res) => {
            const user = req.body; // defined document
            console.log('new user', user);
            // Insert the defined document into the "usersCollections" collection
            const result = await usersCollections.insertOne(user);
            res.send(result);
        })
        // ------------step-1 end ------------------

        // step-2
        // get API
        // https://www.mongodb.com/docs/drivers/node/current/usage-examples/find/
        app.get('/users', async (req, res) => {
            // get api data from database
            const cursor = usersCollections.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // delete api data
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            console.log('will be delete from database', id);
            // delete from database
            const query = { _id: new ObjectId(id) }
            const result = await usersCollections.deleteOne(query);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



// get api from server
app.get('/', (req, res) => {
    res.send('CRUD Recap is Running')
});

// listing Port
app.listen(port, () => {
    console.log(`CRUD is running on port ${port}`);
});