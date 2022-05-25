const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const res = require('express/lib/response');

const app = express();
const port = process.env.PORT || 5000;

// Middlewire
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sfcm7.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        console.log('mediTools db connected');
        const ToolCollection = client.db('mediToolsDB').collection('product');

        // tools product api
        app.post('/product', async (req, res) => {
            const query = req.body;
            const product = await ToolCollection.insertOne(query);
            res.send(product);
        });

    }
    finally {

    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Medi tools server is running...')
})

app.listen(port, () => {
    console.log(`medi tools listening: ${port}`)
})