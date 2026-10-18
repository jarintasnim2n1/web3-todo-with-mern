const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/routes");

dotenv.config();

const app = express();

// Database connect
connectDB();

// Middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Routes
// user -> /api/ethereum/create-task -> server.js -> routes.js -> controllers.js -> model.js
app.use("/api/ethereum", taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at PORT ${PORT}`);
});
