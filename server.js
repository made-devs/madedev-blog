// server.js - Entry point for starting the server
import app from './app.js';

// Set the server port from .env or default to 5000
const PORT = process.env.PORT || 5000;
console.log(process.env.MONGO_URI);

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
