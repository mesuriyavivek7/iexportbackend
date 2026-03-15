import express from "express";
import { getDashboardCounts } from "../controller/analytics.controller";

const router = express.Router()

router.get("/dashboard", getDashboardCounts)

export default router