import { Order } from "../models/orders.model";
import { startOfMonth, endOfMonth, eachDayOfInterval, format, endOfToday, startOfTomorrow } from 'date-fns';
import { User } from "../models/user.model";

class AdminServiceClass {
    constructor() {
        // super()
    }
    // get daily sales
    public async getDailySalesFunction() {
        const now = new Date();
        const start = startOfMonth(now);
        const end = startOfTomorrow();
        console.log("Start:", start.toISOString());
        console.log("End:", end.toISOString());

        const rawDailySales = await Order.aggregate([
            {
                $match: {
                    "payment_status": "pending",
                    "createdAt": { $gte: start, $lte: end },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                    },
                    total: { $sum: "$summary.total" },
                },
            },
            { $sort: { _id: 1 } }
        ]);
        const allDays = eachDayOfInterval({ start, end }).map(date => format(date, 'yyyy-MM-dd'));

        const dailySales = allDays.map(date => {
            const found = rawDailySales.find(entry => entry._id === date);
            return {
                date,
                total: found ? found.total : 0
            }
        })
        return dailySales;
    }

    // get daily customers
    public async getDailyCustomersFunction() {
        const now = new Date();
        const start = startOfMonth(now);
        const end = startOfTomorrow();

        const rawDailyCustomers = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: start, $lte: end }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        const allDays = eachDayOfInterval({ start, end }).map(date => format(date, 'yyyy-MM-dd'));

        const dailyCustomers = allDays.map(date => {
            const found = rawDailyCustomers.find(entry => entry._id === date);
            return {
                date,
                total: found ? found.count : 0
            }
        })

        return dailyCustomers;
    }

    // get best top 3 selling products
    public async getBestSellingProductsFunction() {
        const productSales = await Order.aggregate([
            { $unwind: "$items" },
            { $match: { payment_status: "pending" } },

            // lookup product details to get the product price
            {
                $lookup: {
                    from: "products",
                    localField: "items.productId",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" },

            // Group by productId and sum revenue and quantity
            {
                $group: {
                    _id: "$items.productId", // group by product ID
                    totalRevenue: {
                        $sum: { $multiply: ["$product.price", "$items.quantity"] }
                    },
                    totalQuantity: {
                        $sum: "$items.quantity"
                    },
                    title: { $first: "$product.title" }
                }
            },
            // Sort and limit to top 4
            { $sort: { totalRevenue: -1 } },
            { $limit: 4 },

            // Project desired fields
            {
                $project: {
                    _id: 0,
                    productId: "$_id",
                    title: 1,
                    totalRevenue: 1,
                    totalQuantity: 1
                }
            },
        ]);

        const totalSales = productSales.reduce((acc, item) => acc + item.totalRevenue, 0);

        return {
            productSales,
            totalSales
        };
    }

    // get top 7 recent orders 
    public async getRecentOrdersFunction() {
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(7)
            .populate("items.productId", "title price images");

        return recentOrders;
    }
}

export const AdminService = new AdminServiceClass();
