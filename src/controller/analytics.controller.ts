import { Request, Response } from "express";
import { getDashboardAnalytics } from "../utils/analytics.service";
import productModel from "../models/product.model";
import categoryModel from "../models/category.model";
import leadModel from "../models/lead.model";

export const getDashboardCounts = async (req: Request, res: Response) => {
    try{
      const data = await getDashboardAnalytics();
      const totalProducts = await productModel.find().countDocuments();
      const totalCategories = await categoryModel.find().countDocuments();
      const totalLeads = await leadModel.find().countDocuments(); 

      let dashboardData = {
        ...data,
        totalProducts,
        totalCategories,
        totalLeads
      }

      return res.status(200).json({
        message:"Analytics data fetched.",
        success: true, 
        data:dashboardData
    })



    }catch(error){
      console.error("Analytics error", error)
      res.status(500).json({
        message: "Failed to fetch analytics",
      })
    }
}