const express = require('express');
const router = express.Router();

// Temporary basic routes to test
router.get('/', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Get issues endpoint working',
        data: [] 
    });
});

router.get('/nearby', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Nearby issues endpoint working',
        data: [] 
    });
});

router.get('/:id', (req, res) => {
    res.json({ 
        success: true, 
        message: `Get issue ${req.params.id} endpoint working`,
        data: { id: req.params.id } 
    });
});

router.post('/', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Create issue endpoint working',
        data: req.body 
    });
});

router.put('/:id', (req, res) => {
    res.json({ 
        success: true, 
        message: `Update issue ${req.params.id} endpoint working`,
        data: { id: req.params.id, ...req.body } 
    });
});

module.exports = router;