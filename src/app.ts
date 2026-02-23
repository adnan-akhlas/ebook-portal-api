import express from "express";
import httpStatus from "http-status-codes";
import cors from "cors";
import globalError from "./middleware/globalError.middleware";
import router from "./router";
import env from "./config/env.config";

const app = express();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: env.FRONTEND_URL,
  }),
);
app.use("/api", router);

// Get - Health check route to confirm server is running
app.get("/", (req, res): void => {
  res.json({ message: "Welcome to Ebook Portal api." });
});

// Global Error Handler
app.use(globalError);

app.use((req, res, next) => {
  res.status(httpStatus.NOT_FOUND).json({
    route: req.url,
    message: "Requested route not found.",
  });
});

export default app;
