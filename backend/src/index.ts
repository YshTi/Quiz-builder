import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import quizRoutes from "./routes/quizRoutes";

dotenv.config();

const app = express();

const port = Number(process.env.PORT) || 5001;

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

app.use(
  cors({
    origin: frontendUrl,

    methods: ["GET", "POST", "DELETE", "OPTIONS"],

    allowedHeaders: ["Content-Type"],
  }),
);

app.use(express.json());

app.use("/api/quizzes", quizRoutes);

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.listen(port, () => {
  console.log(
    `[server]: Quiz Builder Backend running on http://localhost:${port}`,
  );
});

export default app;
