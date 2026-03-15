import { analyticsClient, GA_PROPERTY_ID } from "../config/googleAnalytics";

export const getDashboardAnalytics = async () => {
    //Total Views
    const [totalViewsRes] = await analyticsClient.runReport({
        property: GA_PROPERTY_ID,
        dateRanges: [{startDate:"365daysAgo",endDate:"today"}], 
        metrics: [{name: "screenPageViews"}]
    })

    const totalViews = Number(totalViewsRes.rows?.[0]?.metricValues?.[0]?.value) || 0;

    //Monthly Views 
    const startOfYear = new Date().getFullYear() + "-01-01";
    
    const [monthlyRes] = await analyticsClient.runReport({
        property: GA_PROPERTY_ID,
        dateRanges: [{startDate: startOfYear, endDate:"today"}],
        dimensions: [{name: "month"}],
        metrics: [{name: "screenPageViews"}]
    })

    const gaMonthMap : Record<string, number> = {};

    monthlyRes.rows?.forEach((row) => {
        const monthNumber= row.dimensionValues?.[0]?.value || "01"
        const views= Number(row.metricValues?.[0]?.value || 0)

        gaMonthMap[monthNumber] = views
    })

    const monthNames = [
        "Jan","Feb","Mar","Apr","May","Jun",
        "Jul","Aug","Sep","Oct","Nov","Dec"
    ];
      
    const monthlyViews = monthNames.map((month, index) => {

        const monthNumber = String(index + 1).padStart(2, "0");
      
        return {
          month,
          views: gaMonthMap[monthNumber] || 0
        };
    });


    //Country wise views
    const [countryRes] = await analyticsClient.runReport({
        property: GA_PROPERTY_ID,
        dateRanges: [{startDate:"365daysAgo", endDate: "today"}],
        dimensions: [{name:"country"}],
        metrics: [{name:"screenPageViews"}],
        orderBys: [
            {
              metric: { metricName: "screenPageViews" },
              desc: true,
            },
        ],
        limit: 5,
    })

    const countryViews = countryRes.rows?.map((row)=> ({
        country: row.dimensionValues?.[0]?.value,
        views: Number(row.metricValues?.[0]?.value),
    })) || [] 

    return {
        totalViews,
        monthlyViews,
        countryViews,
    };
}

