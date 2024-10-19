const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5005;

// Example departments data
const departments = [
    { id: 1, name: 'HR' },
    { id: 2, name: 'Engineering' },
    { id: 3, name: 'Marketing' },
    { id: 4, name: 'HR-manager' },
    { id: 5, name: 'Engineering-manager' },
    { id: 6, name: 'Marketing-manager' },
];

// Example ruleDetails data
const ruleDetails = {
    category: 'Default Category',
    carId: '1234',
    owner: 'Owner Name',
    startTime: Math.floor(new Date('2023-01-01').getTime() / 1000), // Epoch timestamp for start date
    endTime: Math.floor(new Date('2023-12-31').getTime() / 1000),   // Epoch timestamp for end date
    requestData: ['Request1', 'Request2'],  // Example request data
};

// Enable CORS if you're accessing this from another domain
app.use(cors());

// Route to get departments based on search query
app.get('/departments', (req, res) => {
    const search = req.query.search ? req.query.search.toLowerCase() : '';
    const results = departments.filter(department =>
        department.name.toLowerCase().includes(search)
    );
    res.json(results);
});

// Route to get ruleDetails
app.get('/ruleDetails', (req, res) => {
    res.json(ruleDetails);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
