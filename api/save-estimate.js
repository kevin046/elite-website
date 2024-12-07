const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const ESTIMATES_FILE = path.join(__dirname, '../data/estimates.json');

// Ensure estimates file exists
async function ensureEstimatesFile() {
    try {
        await fs.access(ESTIMATES_FILE);
    } catch {
        await fs.writeFile(ESTIMATES_FILE, '[]');
    }
}

// Save estimate
router.post('/api/save-estimate', async (req, res) => {
    try {
        await ensureEstimatesFile();
        
        const estimates = JSON.parse(await fs.readFile(ESTIMATES_FILE, 'utf8'));
        const newEstimate = {
            id: req.body.estimateNumber,
            date: new Date().toISOString(),
            clientName: req.body.clientName,
            total: req.body.total,
            data: req.body
        };
        
        estimates.push(newEstimate);
        await fs.writeFile(ESTIMATES_FILE, JSON.stringify(estimates, null, 2));
        
        res.json({ success: true, id: newEstimate.id });
    } catch (error) {
        console.error('Error saving estimate:', error);
        res.status(500).json({ error: 'Failed to save estimate' });
    }
}); 