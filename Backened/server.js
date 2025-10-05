import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./database/connection.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { config } from "./config.js";

dotenv.config();

const app = express();

connectDB();

app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.use("/api/expenses", expenseRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = config.server.port || 5000;

app.listen(PORT, () => {
  console.log(
    ` Server running in ${config.server.env} mode on port ${PORT}`
  );
  console.log(`API available at http://localhost:${PORT}/api/expenses`);
});
