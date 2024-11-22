const express = require("express");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const app = express();
require("dotenv").config();
const credentials = require("./key.json");

app.use(cors());

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
databaseURL:"https://Employee-App.firebaseio.com"
});

const db = admin.firestore();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Add superadmins

app.post("/admins/superadmins", async (req, res) => {
  try {
    console.log("Received data:", req.body); // Log received request
    const { name, surname, email, userId } = req.body;
    console.log(userId);

    if (!name || !surname || !email || !userId) {
      return res.status(400).send("All fields are required!");
    }

    const superadmin = { name, surname, email, userId };
    await db.collection("superadmins").doc(userId).set(superadmin); // Save to Firestore
    res.status(201).send("Superadmin added successfully");
  } catch (error) {
    console.error("Error adding superadmin:", error); // Log error
    res.status(500).send("Internal server error: " + error.message); // Send error response
  }
});

// Add generaladmins
app.post("/admins/generalAdmins", async (req, res) => {
  try {
    const { email, password } = req.body;
    const generaladmin = await generaladmin.findOne({ email });

    if (!generaladmin) {
      res.status(404).json({ message: "General Admin not found" });
    }
    if (generaladmin.password !== password) {
      return res.status(400).json({ message: "Invalid email or password!" });
    }
    res.status(200).json({ message: "Login Success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
