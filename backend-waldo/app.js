require('dotenv').config
const express = require('express')
const app  = express()
const cors = require('cors');
require('./config/passport.js')

// --- Route Imports ---
const apiRouter = require('./routes/apiRouterV1.js')

// --- Middleware Setup ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// --- Routes ---
app.use('/api/v1', apiRouter);

if (require.main === module) {
    const PORT = parseInt(process.env.USE_PORT, 10) || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Visit: http://localhost:${PORT}/`);
    });
}