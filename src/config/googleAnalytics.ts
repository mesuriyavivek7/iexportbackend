import { BetaAnalyticsDataClient } from "@google-analytics/data";
import path from "path";

const keyFile = path.join(__dirname,"procureexport-f9c332486a2f.json");

export const analyticsClient = new BetaAnalyticsDataClient({
    keyFilename: keyFile
})

export const GA_PROPERTY_ID = "properties/527678553"