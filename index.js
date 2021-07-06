const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;

//Mongo local db url
//const dbUrl = "mongodb://127.0.0.1:27017"; //Mongo installed in system

//Mongo Atlas cloud db url
const dbUrl = "mongodb+srv://dbpuli:dbpuli@cluster0.eukkc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

app.use(express.json()); //middleware to access body

const students = [];

//create students
app.post("/students", async (req, res) => {
  //open connection
  let client = await mongoClient.connect(dbUrl);
  try {
    //select the db
    let db = client.db("studentsdb");
    //select the collections perform db operations
    const data = db.collection("students").insertOne(req.body);
    res.json({ message: "Record Created" });
  } catch (error) {
    console.log(error);
    res.json({ message: "Error occured" });
  } finally {
    //close connection 
    client.close();
  }
});

//get all the students
app.get("/students", async (req, res) => {
  //open connection
  let client = await mongoClient.connect(dbUrl);
  try {
    //select the db
    let db = client.db("studentsdb");
    //select the collections perform db operations
    const data = await db.collection("students").find().toArray();
    res.status(200).json({ message: "Success", data });
  } catch (error) {
    res.json({ message: "Error occured" });
  } finally {
    //close connection
    client.close();
  }
});

//get single student
app.get("/students/:id", async (req, res) => {
  //open connection
  let client = await mongoClient.connect(dbUrl);
  //converting ig to mongo db object id
  const objectId = mongodb.ObjectID(req.params.id);
  try {
    //select the db
    let db = client.db("studentsdb");
    //select the collections perform db operations
    const data = await db.collection("students").findOne({ _id: objectId });
    if(data){
      res.status(200).json({ message: "Success", data });
    } else{
      res.json({message: "User not found with the given ID "})
    }
  } catch (error) {
    res.json({ message: "Error occured" });
  } finally {
    //close connection
    client.close(); 
  }
});

//update student
app.put("/student-update/:id", async (req, res) => {
  //open connection
  let client = await mongoClient.connect(dbUrl);
  //converting ig to mongo db object id
  const objectId = mongodb.ObjectID(req.params.id);
  try {
    //selct the db
    let db = client.db("studentsdb");
    //select the collections perform db operations
    const data = await db.collection("students").findOne({ _id: objectId });
    if(data){
      const updated = await db.collection('students').findOneAndUpdate({_id: objectId },{$set:{age:req.body.age}})
      res.json({message:"Record updated"})
    }else{
      res.json({message:'Record not found with given ID'})
    }
  } catch (error) {
    console.log(error);
    res.json({ message: "Error occured" });
  } finally {
    //close connection
    client.close();
  }
});

//delete student
app.delete("/student-delete/:id", async (req, res) => {
  //open connection
  let client = await mongoClient.connect(dbUrl);
  //converting id to mongo db object id
  const objectId = mongodb.ObjectID(req.params.id);
  try {
    //selct the db
    let db = client.db("studentsdb");
    //select the collections perform db operations
    const data = await db.collection("students").findOne({ _id: objectId });
    if(data){
      const deleted = await db.collection("students").findOneAndDelete({_id:objectId})
      res.json({message:"Record deleted"})
    }else{
      res.json({message:'Record not found with given ID'})
    }
  } catch (error) {
    console.log(error);
    res.json({ message: "Error occured" });
  } finally {
    //close connection
    client.close();
  }
});



app.listen(port, () => {
  console.log("Server listening to port:" + port);
});
