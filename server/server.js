const express = require('express');
const cors = require('cors');
const routes = require('./routes'); // Ensure routes.js also uses module.exports
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 8080;
// Logging Middleware
app.use((req, res, next) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    next();
});
app.listen(PORT, () => {
	    console.log(`Server is running on port ${PORT}`);
	});
// Routes
app.use("/api", routes);

// Export for Vercel
module.exports = app;