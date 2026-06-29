const router = require("express").Router();
const { authenticatetoken } = require("./userauth");
const User = require("../models/user");
const Book = require("../models/book");


//  Add to cart
router.put("/add-to-cart/:bookid", authenticatetoken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { bookid } = req.params;

        const user = await User.findById(userId);

        // check if already in cart
        const isBookInCart = user.cart.includes(bookid);

        if (isBookInCart) {
            return res.status(200).json({
                message: "Book already in cart"
            });
        }

        await User.findByIdAndUpdate(userId, {
            $push: { cart: bookid }
        });

        return res.status(200).json({
            message: "Book added to cart"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
});


// Remove from cart
router.put("/remove-from-cart/:bookid", authenticatetoken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { bookid } = req.params;

        await User.findByIdAndUpdate(userId, {
            $pull: { cart: bookid }
        });

        return res.status(200).json({
            message: "Book removed from cart"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

// ——— GET USER CART (Integrated from image) ———
router.get("/get-user-cart", authenticatetoken, async (req, res) => {
    try {
        const userId = req.user.id; // Using ID from your auth middleware

        // populate("cart") swaps book IDs for full book details
        const userData = await User.findById(userId).populate("cart");
        
        // reverse() puts newest additions at the top
        const cart = userData.cart.reverse();

        return res.json({
            status: "Success",
            data: cart,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred" });
    }
});


//  Get cart books
router.get("/get-cart-books", authenticatetoken, async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).populate("cart");

        return res.status(200).json(user.cart);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
});


// 🧹 Clear cart (optional but useful)
router.delete("/clear-cart", authenticatetoken, async (req, res) => {
    try {
        const userId = req.user.id;

        await User.findByIdAndUpdate(userId, {
            cart: []
        });

        return res.status(200).json({
            message: "Cart cleared"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

module.exports = router;