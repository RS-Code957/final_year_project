const router = require("express").Router();
const { authenticatetoken } = require("./userauth");
const Order = require("../models/order");
const User = require("../models/user");
const book = require("../models/book");


//  Place Order
router.post("/place-order", authenticatetoken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { books } = req.body; // array of book IDs

        if (!books || books.length === 0) {
            return res.status(400).json({
                message: "No books provided"
            });
        }

        const order = new Order({
            user: userId,
            books: books,
            status: "Order Placed"
        });

        await order.save();

        // 🧹 Clear user cart after order
        await User.findByIdAndUpdate(userId, {
            cart: []
        });

        return res.status(200).json({
            message: "Order placed successfully"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
});


//  Get user orders
router.get("/get-order-history", authenticatetoken, async (req, res) => {
    try {
        const userId = req.user.id;

        const orders = await Order.find({ user: userId })
            .populate("books")
            .sort({ createdAt: -1 });

        return res.status(200).json(orders);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
});


//  Admin: Get all orders
router.get("/get-all-orders", authenticatetoken, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }

        const orders = await Order.find()
            .populate("books")
            .populate("user")
            .sort({ createdAt: -1 });

        return res.status(200).json(orders);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
});


//  Admin: Update order status
router.put("/update-status/:id", authenticatetoken, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }

        const { id } = req.params;
        const { status } = req.body;

        await Order.findByIdAndUpdate(id, {
            status: status
        });

        return res.status(200).json({
            message: "Order status updated"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

module.exports = router;