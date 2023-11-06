const express = require('express');
const mongodb = require('mongodb');
const bodyParser = require('body-parser');
const app = express();
const port = 2121;
const MongoClient = mongodb.MongoClient;
const uri = 'mongodb://localhost:27017'; // Replace with your MongoDB URI
const dbName = 'quizdb'; // Replace with your database name

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public')); // Serve HTML and CSS files

app.get('/api/high-scores', async (req, res) => {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('highScores');
        const highScores = await collection.find().sort({ score: -1 }).limit(10).toArray();
        res.json(highScores);
    } finally {
        client.close();
    }
});

// Endpoint to reset high scores
app.post('/api/reset-high-scores', async (req, res) => {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('highScores');
        
        // Delete all entries in the collection
        await collection.deleteMany({});
        
        res.status(204).send(); // Send a no content response
    } finally {
        client.close();
    }
});



app.post('/api/submit-score', async (req, res) => {
    const { name, score } = req.body;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('highScores');
        await collection.insertOne({ name, score });
        res.json({ message: 'Score submitted successfully' });
    } finally {
        client.close();
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
