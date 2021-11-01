const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;

const { MongoClient } = require('mongodb');

// midleware
app.use(cors());
app.use(express.json());


// uri mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kadog.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);


async function run() {

    try {
        await client.connect();
        const database = client.db('YTA_DB');
        const servicesCollection = database.collection('services');
        const orderCollection = database.collection('orders');
        // console.log('connected to database');


        // Get service API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const order = await cursor.toArray();
            // console.log('1', orderCollection.find({}).toArray())
            res.send(order);
        });

        // Get Single API

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('geting service');
            const query = { _id: ObjectId(id) };
            console.log(query);
            const service = await servicesCollection.findOne(query);
            res.json(service);
        });
        // get single order api
        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            // console.log('Order find', id);
            const query = { _id: ObjectId(id) };
            const order = orderCollection.findOne(query);
            // console.log(query);
            // console.log(await orderCollection.find(query));
            // don't know why it shows null
            // res.json(await orderCollection.findOne(query));
            // console.log('1', orderCollection.find({}).toArray())
            // console.log('2', order);
            res.send(order)
        });


        // POST API

        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('Hit the post API', service);
            const result = await servicesCollection.insertOne(service);
            res.json(result);
            // console.log(result);
        });
        // Add orders Api
        app.post('/orders', async (req, res) => {
            const order = req.body;
            console.log('order', order);
            const output = await orderCollection.insertOne(order);
            res.json(output);
        })


        // Delete Api orders
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            console.log("Deleted", id);
            res.json(result);
        })

        // Delete api services
        // app.delete('/services/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const result = await servicesCollection.deleteOne(query);
        //     console.log("Deleted", id);
        //     res.json(result);
        // })
    }

    finally {
        // await client.close();
    }

}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Welcome to Your Travel Agency Server ')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})