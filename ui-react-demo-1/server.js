const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = 5000;

// MongoDB Connection
const dbName = 'ruleDB'; // Ensure consistent naming here
mongoose.connect(`mongodb://localhost:27017/${dbName}`)
    .then(() => {
        console.log('Connected to Database');
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });

// Define Mongoose Schemas and Models
const departmentSchema = new mongoose.Schema({
    name: String
});

const ruleDetailsSchema = new mongoose.Schema({
    category: String,
    carId: String,
    owner: String,
    startTime: Number,
    endTime: Number,
    requestData: [String]
});

const Department = mongoose.model('Department', departmentSchema);
const RuleDetails = mongoose.model('RuleDetails', ruleDetailsSchema);

// Enable CORS
app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// Route to get all departments
app.get('/departments', async (req, res) => {
    try {
        const departments = await Department.find();
        res.json(departments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route to get ruleDetails
app.get('/ruleDetails', async (req, res) => {
    try {
        const ruleDetails = await RuleDetails.find();
        res.json(ruleDetails);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
