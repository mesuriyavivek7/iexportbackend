import express from "express";
import { getHero, createHero, updateHero } from "../controller/hero.controller";
import { uploadHeroImage } from "../config/multer.config";

const router = express.Router();

router.get("/", getHero);
router.post("/", uploadHeroImage.single("heroImage"), createHero);
router.put("/", uploadHeroImage.single("heroImage"), updateHero);

export default router;
