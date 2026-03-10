import express from "express";
import { getContactUs, createContactUs, updateContactUs } from "../controller/contactUs.controller";

const router = express.Router();

router.get("/", getContactUs);
router.post("/", createContactUs);
router.put("/", updateContactUs);

export default router;
