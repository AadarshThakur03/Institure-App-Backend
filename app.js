import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import routes from "./src/routes/index.js";
import dbInstance from "./src/services/database.js";
import Migration from "./src/scripts/migration.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

dbInstance.initConnection();

app.use(express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // req.body

// console.log(routes);
app.use("/", routes);

// Global Error Handling Middleware
app.use((req, res, next) => {
  console.error("Global Error");
  res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
});

// Fallback for undefined routes
app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: "Route not found",
  });
});

async function runMigrations() {
  const migration = new Migration(dbInstance);
  try {
    await migration.createDatabaseAndTables();
    console.log("All migrations completed successfully.");
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

// Automatically run migrations once when the server starts
runMigrations().then(() => {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });
});

