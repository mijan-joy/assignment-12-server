const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middlewire
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Medi tools server is running...')
})

app.listen(port, () => {
    console.log(`medi tools listening: ${port}`)
})