const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const cors = require('cors'); 

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Helper function to find the CSV file by ZIP code
function findCsvFile(zipcode) {
    const statesDir = __dirname; // The root directory containing state folders
    const stateDirs = fs.readdirSync(statesDir).filter(dir => fs.statSync(path.join(statesDir, dir)).isDirectory());

    for (const stateDir of stateDirs) {
        const filePath = path.join(statesDir, stateDir, `${zipcode}.csv`);
        if (fs.existsSync(filePath)) {
            return filePath;
        }
    }
    return null;
}

// Endpoint to get data by ZIP code, and filter by materials
app.get('/data/:zipcode', (req, res) => {
    const { zipcode } = req.params;

    // Find the CSV file for the given ZIP code
    const filePath = findCsvFile(zipcode);

    if (!filePath) {
        return res.status(404).json({ error: `CSV file not found for ZIP code ${zipcode}.` });
    }

    const results = [];

    // Read and parse the CSV file
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
            const { material, radius } = req.query;
            const { materials, distance } = data;

            const distanceInMiles = parseFloat(distance) || 0;
            const maxDistanceInMiles = radius ? parseFloat(radius) : 15;
            // If a material query is provided, filter based on it
            if (!isNaN(distanceInMiles) && distanceInMiles <= maxDistanceInMiles) {
                // If a material query is provided, filter based on it
                if (material) {
                    const materialsList = materials.split(';').map(item => item.trim().toLowerCase());
                    if (materialsList.some(item => item.includes(material.toLowerCase()))) {
                        results.push(data);
                    }
                } else {
                    results.push(data);
                }
            }
        })
        .on('error', (err) => {
            console.error('Error reading CSV file:', err);
            res.status(500).json({ error: 'Internal server error.' });
        })
        .on('end', () => {
            res.json(results);
        });
});

app.get('/start', (req, res) => {
    res.send("Server is running");
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
