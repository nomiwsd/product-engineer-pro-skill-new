import { Router } from "express";

export const router = Router();

router.get("/health", (req, res) => {
  res.json({ ok: true });
});
