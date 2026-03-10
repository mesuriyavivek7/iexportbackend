import express from "express";
import { getStats, createStats, updateStats } from "../controller/stats.controller";

const router = express.Router();

router.get("/", getStats);
router.post("/", createStats);
router.put("/", updateStats);

export default router;
