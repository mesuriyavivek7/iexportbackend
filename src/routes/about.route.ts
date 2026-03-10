import express from "express";
import {
  getAboutHome,
  createAboutHome,
  updateAboutHome,
} from "../controller/aboutHome.controller";
import {
  getAboutPage,
  createAboutPage,
  updateAboutPage,
} from "../controller/aboutPage.controller";
import {
  uploadAboutHomeImage,
  uploadAboutPageImage,
} from "../config/multer-about.config";

const router = express.Router();

// ----- About Us - Home Page (section on homepage) -----
router.get("/home", getAboutHome);
router.post("/home", uploadAboutHomeImage.single("aboutImage"), createAboutHome);
router.put("/home", uploadAboutHomeImage.single("aboutImage"), updateAboutHome);

// ----- About Page (full about page) -----
router.get("/page", getAboutPage);
router.post("/page", uploadAboutPageImage.single("sectionImage"), createAboutPage);
router.put("/page", uploadAboutPageImage.single("sectionImage"), updateAboutPage);

export default router;
