const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();
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
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const database = client.db("bistro-restaurent");
    const foodMenu = database.collection("food-menu");
    const reviews = database.collection("review");
    const cartcollection = database.collection("cart");
    const userscollection = database.collection("users");

    //get signle user route is here
    app.get("/singleuser", async (req, res) => {
      const useremail = req.query.email;
      const result = await userscollection.findOne({ email: useremail });
      res.send(result);
    });

    // get all user route is here
    app.get("/getallusers", async (req, res) => {
      const result = await userscollection.find().toArray();
      res.send(result);
    });

    // All menu details is here
    app.get("/allmenusdetails", async (req, res) => {
      const result = await foodMenu.find().toArray();
      res.send(result);
    });

    // Review route is here
    app.get("/reviews", async (req, res) => {
      const result = await reviews.find().toArray();
      res.send(result);
    });

    // load cart data route is here
    app.get("/cartdata", async (req, res) => {
      const useremail = req.query.email;
      const query = { userEmail: useremail };
      const result = await cartcollection.find(query).toArray();
      res.send(result);
    });

    // Cart colletion route is here
    app.post("/usercart", async (req, res) => {
      try {
        const item = req.body;
        const result = await cartcollection.insertOne(item);
        res.send(result);
      } catch (error) {
        console.log(error);
      }
    });

    // Delete cart items from cart route is here
    app.delete("/deletecartitems", async (req, res) => {
      const itemID = req.query.id;
      const query = { _id: new ObjectId(itemID) };
      const result = await cartcollection.deleteOne(query);
      res.send(result);
    });

    // set newuser route is here
    app.post("/createnewuser", async (req, res) => {
      const useremail = req.query.email;
      const user = req.body;
      const exgist = await userscollection.findOne({ email: useremail });
      if (exgist) {
        res.send("already exgist user");
        return;
      }
      const result = await userscollection.insertOne(user);
      res.send(result);
    });

    // handle user role route is here
    app.post("/updateuserrole", async (req, res) => {
      try {
        const useremail = req.query.email;
        const newrRole = req.query.role;
        const query = { email: useremail };
        const updatedoc = {
          $set: {
            role: newrRole,
          },
        };
        const result = await userscollection.updateOne(query, updatedoc);
        res.send(result);
      } catch (error) {}
    });

    // userdelete route is here
    app.delete("/deletesingleuser", async (req,res)=>{
      const userid = req.query.id;
      const query = {_id: new ObjectId(userid)};
      const result = await userscollection.deleteOne(query);
      res.send(result);
    })

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Birsto resturent is running well");
});

app.listen(port, () => {
  console.log(`Server is running with ${port}`);
});
