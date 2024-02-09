const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;
// jvuP5EIgV3QVQ5vF

// middleware
app.use(express.json())
app.use(cors())
// import.meta.env.
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.i7x697e.mongodb.net/?retryWrites=true&w=majority`;

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
        const usersPost = client.db("AssignmentDB").collection("userPost");

        // all assignment
        app.get('/assignment', async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result)
        })
        // all userPosted assignment
        app.get('/userPost', async(req, res) => {
            const result = await usersPost.find().toArray();
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
        // put assignment by id
        app.put('/assignment/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;

            const options = { upsert: true };
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    title: data.title,
                    description: data.description,
                    marks: data.marks,
                    thumbnailImageUrl: data.thumbnailImageUrl,
                    difficultyLevel: data.difficultyLevel,
                    dueDate: data.dueDate,
                },
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })
        // put check assignment by id
        app.put('/userPost/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;

            const options = { upsert: true };
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    marks: data.marks,
                    feedback: data.feedback,
                    status: 'completed',
                },
            };
            const result = await usersPost.updateOne(filter, updateDoc, options);
            // res.send(result)
        })

        // assignment posted
        app.post('/assignment', async (req, res) => {
            const data = req.body;
            console.log(data);
            const result = await usersCollection.insertOne(data);
            res.send(result)
        })
        // submission assignment posted
        app.post('/userPost', async (req, res) => {
            const data = req.body;
            const result = await usersPost.insertOne(data);
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