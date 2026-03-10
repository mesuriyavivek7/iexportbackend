import express from "express";
import { getCategoriesPage, createCategoriesPage, updateCategoriesPage } from "../controller/categoriesPage.controller";

const router = express.Router();

router.get("/", getCategoriesPage);
router.post("/", createCategoriesPage);
router.put("/", updateCategoriesPage);

export default router;
