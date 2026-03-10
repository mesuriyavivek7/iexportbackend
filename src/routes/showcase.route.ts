import express from "express";
import { getShowcase, createShowcase, updateShowcase } from "../controller/showcase.controller";
import { uploadShowcaseImages } from "../config/multer-showcase.config";

const router = express.Router();

router.get("/", getShowcase);
router.post("/", uploadShowcaseImages, createShowcase);
router.put("/", uploadShowcaseImages, updateShowcase);

export default router;
