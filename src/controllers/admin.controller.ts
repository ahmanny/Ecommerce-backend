import { Request, RequestHandler, Response } from "express";
import UnauthorizedAccessException from "../exceptions/UnauthorizedAccessException";
import { AdminService } from "../services/admin.service";
import { error_handler, ok_handler } from "../utils/response_handler";

// refresh user session token controller
export const getAdminDashboardStats = (): RequestHandler => {
    return async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                throw new UnauthorizedAccessException("Unauthorized");
            }
            const dailySales = await AdminService.getDailySalesFunction()
            const dailyCustomers = await AdminService.getDailyCustomersFunction()
            const bestSelling = await AdminService.getBestSellingProductsFunction()
            const recentOrders = await AdminService.getRecentOrdersFunction()

            // console.log("Best Selling Products:", bestSelling);


            ok_handler(res, "token refreshed", { dailySales, dailyCustomers, bestSelling, recentOrders })
        } catch (error) {
            console.error('Refresh token error:', error);
            error_handler(error, req, res)
        }
    }
}