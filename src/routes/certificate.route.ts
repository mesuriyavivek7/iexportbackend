import express from "express";
import { getCertificates, createCertificate, deleteCertificate } from "../controller/certificate.controller";
import { uploadCertificateImage } from "../config/multer-category-product.config";

const router = express.Router();

router.get("/", getCertificates);
router.post("/", uploadCertificateImage.single("image"), createCertificate);
router.delete("/:id", deleteCertificate);

export default router;
