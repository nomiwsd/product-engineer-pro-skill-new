import express from "express";
import { router } from "./routes.js";

const app = express();
app.use(express.json());
app.use(router);
app.use((err, req, res, next) => {
  res.status(500).json({ error: "internal error" });
});

app.listen(process.env.PORT ?? 3000);
