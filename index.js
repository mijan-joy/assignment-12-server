const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const res = require('express/lib/response');

const app = express();
const port = process.env.PORT || 5000;

// Middlewire
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sfcm7.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'Unauthorized access' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' });
        }
        req.decoded = decoded;
        next();
    });
}

async function run() {
    try {
        await client.connect();
        console.log('mediTools db connected');
        const toolCollection = client.db('mediToolsDB').collection('product');
        const reviewCollection = client.db('mediToolsDB').collection('reviews');
        const orderColletion = client.db('mediToolsDB').collection('orders');

        // tools product api
        app.post('/product', async (req, res) => {
            const query = req.body;
            const product = await toolCollection.insertOne(query);
            res.send(product);
        });

        // get product api from database
        app.get('/product', async (req, res) => {
            const query = {};
            const product = await toolCollection.find(query).toArray();
            res.send(product);
        });

        // get product api by id from database
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await toolCollection.findOne(query);
            res.send(product);
        });

        // post review api
        app.post('/review', async (req, res) => {
            const query = req.body;
            const review = await reviewCollection.insertOne(query);
            res.send(review);
        });

        // get review api
        app.get('/review', async (req, res) => {
            const query = {};
            const review = await reviewCollection.find(query).toArray();
            res.send(review);
        });

        // order post api
        app.post('/order', async (req, res) => {
            const order = req.body;
            const result = await orderColletion.insertOne(order);
            res.send(result);
        });

      /*   app.get('/order', async (req, res) => {
            const query = {};
            const order = await orderColletion.find(query).toArray();
            res.send(order);
        }); */

        // order collection by email
        app.get('/order', verifyJWT, async (req, res) => {
            const customer = req.query.customer;
            const decodedEamil = req.decoded.email;
            if (customer === decodedEamil) {
                const query = { customer: customer };
                const orders = await orderColletion.find(query).toArray();
                return res.send(orders);
            }
            else {
                return res.status(403).send({ message: 'Forbidden Access' })
            }

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