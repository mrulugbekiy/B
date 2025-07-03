// server/server.js
const express = require('express');
const path = require('path');
const routes = require('./routes');
const app = express();
const port = 3000;

app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.static(path.join(__dirname, '../public'))); // Serve static files

// Use the routes defined in routes.js
app.use('/', routes);

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});