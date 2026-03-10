import express from "express";
import { getLeads, createLead } from "../controller/lead.controller";

const router = express.Router();

router.get("/", getLeads);
router.post("/", createLead);

export default router;
