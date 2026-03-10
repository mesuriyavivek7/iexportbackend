import express from "express";
import { getCategorySection, createCategorySection, updateCategorySection } from "../controller/categorySection.controller";

const router = express.Router();

router.get("/", getCategorySection);
router.post("/", createCategorySection);
router.put("/", updateCategorySection);

export default router;
