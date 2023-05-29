const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
require('dotenv').config();
const cors = require("cors");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_pass}@cluster0.85env82.mongodb.net/?retryWrites=true&w=majority`;

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
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const database = client.db("bistro-restaurent");
    const foodMenu = database.collection("food-menu");
    const reviews = database.collection("review");

    // All menu details is here
    app.get("/allmenusdetails", async(req,res)=>{
        const result = await foodMenu.find().toArray();
        res.send(result);
    });

    // Review route is here
    app.get("/reviews", async(req,res)=>{
        const result = await reviews.find().toArray();
        res.send(result);
    })





  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get("/",(req, res)=>{
    res.send('Birsto resturent is running well');
});




app.listen(port, ()=>{
    console.log(`Server is running with ${port}`);
})