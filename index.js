const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;
// jvuP5EIgV3QVQ5vF

// middleware
app.use(express.json())
app.use(cors())

const uri = "mongodb+srv://forhad445:jvuP5EIgV3QVQ5vF@cluster0.i7x697e.mongodb.net/?retryWrites=true&w=majority";

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
        // await client.connect();

        const usersCollection = client.db("AssignmentDB").collection("assignment");

        app.get('/assignment', async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result)
        })
        // get single id using get method
        app.get("/myAssignment/:id", async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: new ObjectId(id),
            };
            const result = await usersCollection.find(query).toArray();
            res.send(result);
        })
        // get single id using delete method
        app.delete("/myAssignment/:id", async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: new ObjectId(id),
            };
            const result = await usersCollection.deleteOne(query);
            res.send(result);
        })

        app.post('/assignment', async (req, res) => {
            const data = req.body;
            console.log(data);
            const result = await usersCollection.insertOne(data);
            res.send(result)
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


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Online Group Study is Running port ${port}`)
})