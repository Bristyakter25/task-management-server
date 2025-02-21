const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lwvml.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const userCollection = client.db('taskManagement').collection('users');
    const taskCollection = client.db('taskManagement').collection('tasks');

    // User related APIs
    app.post('/users', async (req, res) => {
      try {
        const newUser = req.body;
        console.log('Creating new user', newUser);
        const result = await userCollection.insertOne(newUser);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: error.message });
      }
    });

    app.get('/users', async (req, res) => {
      try {
        const cursor = userCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: error.message });
      }
    });

    // Task related APIs
    app.post('/tasks', async (req, res) => {
      try {
        console.log("Request received:", req.body); // Log request body
        const newTask = req.body;
        newTask.timestamp = new Date().toISOString(); // Add a timestamp
        console.log('Creating new task', newTask);
        const result = await taskCollection.insertOne(newTask);
        res.send(result);
      } catch (error) {
        console.error("Error creating task:", error); // Log error details
        res.status(500).send({ message: error.message });
      }
    });
    

    app.get('/tasks', async (req, res) => {
      try {
        const cursor = taskCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: error.message });
      }
    });

    const { ObjectId } = require("mongodb");

app.get('/tasks/:id', async (req, res) => {
  try {
    const id = req.params.id;
    
    // Validate if ID is a valid MongoDB ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid task ID" });
    }

    const task = await taskCollection.findOne({ _id: new ObjectId(id) });

    if (!task) {
      return res.status(404).send({ message: "Task not found" });
    }

    res.send(task);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});


app.put('/tasks/reorder', async (req, res) => {
  try {
    const updatedTasks = req.body;

    // Iterate over each task and update its position in the database
    for (const task of updatedTasks) {
      const filter = { _id: new ObjectId(task._id) };
      
      // Remove the _id field before updating
      const { _id, ...taskWithoutId } = task;
      const updateDoc = { $set: taskWithoutId };
      
      console.log("Filter:", filter);
      console.log("Update Document:", updateDoc);

      const result = await taskCollection.updateOne(filter, updateDoc);
      if (result.matchedCount > 0) {
        console.log('Task updated successfully:', result);
      } else {
        console.error("Task not found:", result);
      }
    }

    res.send({ message: 'Task order updated successfully.' });
  } catch (error) {
    console.error('Error updating task order:', error);
    res.status(500).send({ message: 'Error updating task order.' });
  }
});




app.put('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = req.body;

    if (!ObjectId.isValid(id)) {
      console.error("Invalid task ID:", id);
      return res.status(400).send({ message: "Invalid task ID" });
    }

    if (!updatedTask.category || !updatedTask.title || !updatedTask.description) {
      console.error("Missing required fields in updatedTask:", updatedTask);
      return res.status(400).send({ message: "Missing required fields" });
    }

    const filter = { _id: new ObjectId(id) };
    const updateDoc = { $set: updatedTask };

    console.log("Filter:", filter);
    console.log("Update Document:", updateDoc);

    const result = await taskCollection.updateOne(filter, updateDoc);
    if (result.modifiedCount > 0) {
      console.log('Task updated successfully:', result);
      res.send({ message: 'Task updated successfully.' });
    } else {
      console.error("Task not found or no changes made:", result);
      res.status(404).send({ message: 'Task not found or no changes made.' });
    }
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).send({ message: 'Error updating task.' });
  }
});


app.delete("/tasks/:id", async (req, res) => {
  const taskId = req.params.id;
  try {
    const result = await taskCollection.deleteOne({ _id: new ObjectId(taskId) });
    if (result.deletedCount > 0) {
      res.json({ message: "Task deleted successfully" });
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Error deleting task" });
  }
});

  
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Task Management is ready to execute');
});

app.listen(port, () => {
  console.log(`Task is ready at: ${port}`);
});