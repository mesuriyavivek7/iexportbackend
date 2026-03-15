import express, { Application } from "express";
import path from "path";
import cors from "cors";
import authRoutes from "./routes/auth.route";
import heroRoutes from "./routes/hero.route";
import aboutRoutes from "./routes/about.route";
import categorySectionRoutes from "./routes/categorySection.route";
import categoriesPageRoutes from "./routes/categoriesPage.route";
import categoryRoutes from "./routes/category.route";
import productRoutes from "./routes/product.route";
import statsRoutes from "./routes/stats.route";
import showcaseRoutes from "./routes/showcase.route";
import certificateRoutes from "./routes/certificate.route";
import contactUsRoutes from "./routes/contactUs.route";
import leadRoutes from "./routes/lead.route";
import analyticsRoute from './routes/analytics.routes'

const app: Application = express();

app.use(cors());
app.use((req, res, next) => {
  const isMultipart = (req.get("content-type") || "").includes("multipart/form-data");
  if (isMultipart && (req.path.startsWith("/api/showcase") || req.path.startsWith("/api/certificates"))) {
    return next();
  }
  express.json()(req, res, next);
});

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.use("/api/auth", authRoutes);
app.use("/api/hero", heroRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/category-section", categorySectionRoutes);
app.use("/api/categories-page", categoriesPageRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/showcase", showcaseRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/contact-us", contactUsRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/analytics", analyticsRoute)

export default app;
