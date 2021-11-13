const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const cors = require('cors');

const app = express();
const port = process.env.PORT ||  5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hty68.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



client.connect((err) => {
  const servicesCollection = client.db("DreemSky").collection("services");
  const usersCollection = client.db("DreemSky").collection("users");
  const ordersCollection = client.db("DreemSky").collection("orders");
  const reviewCollection = client.db("DreemSky").collection("review");

  //add servicesCollection
  app.post("/addServices", async (req, res) => {
    console.log(req.body);
    const result = await servicesCollection.insertOne(req.body);
    res.send(result);
  });

  // get all services
  app.get("/allServices", async (req, res) => {
    const result = await servicesCollection.find({}).toArray();
    res.send(result);
  });

  // delete api
  app.delete('/allServices/:id', async(req,res) =>{
    const id = req.params.id;
    const query = {_id:ObjectId(id)};
    const result = await servicesCollection.deleteOne(query);
    res.json(result)
})

  // single service
  app.get("/singleService/:id", async (req, res) => {
    console.log(req.params.id);
    const result = await servicesCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray();
    res.send(result[0]);
    console.log(result);
  });
  // get services use id
  app.get("/allServices/:id", async (req, res) => {
    console.log(req.params.id);
    const result = await servicesCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray();
    res.send(result[0]);
    console.log(result);
  });

  // insert order

  app.post("/addOrders", async (req, res) => {
    const result = await ordersCollection.insertOne(req.body);
    res.send(result);
  });

  app.get("/myOrder/:email", async (req, res) => {
    console.log(req.params.email);
    const result = await ordersCollection
      .find({ email: req.params.email })
      .toArray();
    res.send(result);
  });

  // delete my order api
  app.delete('/myOrder/:id', async(req,res)=>{
    const id = req.params.id;
    const query = {_id:ObjectId(id)};
    const result = await ordersCollection.deleteOne(query);
    res.json(result);
  });

  // review
  app.post("/addReview", async (req, res) => {
    const result = await reviewCollection.insertOne(req.body);
    res.send(result);
  });

  // get review

  app.get("/myReview", async (req,res) =>{
    console.log("hello review")
    const result = await reviewCollection.find({}).toArray();
    res.send(result)
  })

  app.post("/addUserInfo", async (req, res) => {
    console.log("req.body");
    const result = await usersCollection.insertOne(req.body);
    res.send(result);
    console.log(result);
  });

  //  make admin

  app.put("/makeAdmin", async (req, res) => {
    const filter = { email: req.body.email };
    const result = await usersCollection.find(filter).toArray();
    if (result) {
      const documents = await usersCollection.updateOne(filter, {
        $set: { role: "admin" },
      });
      console.log(documents);
    }
  });

  // check admin 
  app.get("/checkAdmin/:email", async (req, res) => {
    const result = await usersCollection
      .find({ email: req.params.email })
      .toArray();
    console.log(result);
    res.send(result);
  });

  /// all order
  app.get("/allOrders", async (req, res) => {   
    const result = await ordersCollection.find({}).toArray();
    res.send(result);
  });
  
// single order
  app.get("/allOrders/:id", async (req, res) => {
    const result = await ordersCollection.find({_id: ObjectId(req.params.id)}).toArray();
    res.send(result);
  });

  app.delete('/allOrders/id', async(req,res) =>{
    const id =req.params.id;
    const query = {_id:ObjectId(id)};
    const result = await ordersCollection.deleteOne(query);
    res.json(result)
  })

  // status update
  app.put("/statusUpdate/:id", async (req, res) => {
    const filter = { _id: ObjectId(req.params.id) };
    console.log(req.params.id);
    const result = await ordersCollection.updateOne(filter, {
      $set: {
        status: req.body.status,
      },
    });
    res.send(result);
    console.log(result);
  });
});


app.get("/", (req, res) => {
  res.send("vip motors server is live");
});

app.listen(port, () => {
  console.log(`listening at ${port}`)
})