const router = require("express").Router();
const { authenticatetoken } = require("./userauth");
const User = require("../models/user");
const Book = require("../models/book");


// ❤️ Add book to favourites
router.put("/add-to-favourites/:bookid", authenticatetoken, async (req, res) => {
    try {
        const { id } = req.user; // from JWT
        const { bookid } = req.params;

        const user = await User.findById(id);

        // check if already exists
        const isBookFavourite = user.favourites.includes(bookid);

        if (isBookFavourite) {
            return res.status(200).json({
                message: "Book already in favourites"
            });
        }

        await User.findByIdAndUpdate(id, {
            $push: { favourites: bookid }
        });

        return res.status(200).json({
            message: "Book added to favourites"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
});


//  Remove book from favourites
router.put("/remove-from-favourites/:bookid", authenticatetoken, async (req, res) => {
    try {
        const { id } = req.user;
        const { bookid } = req.params;

        await User.findByIdAndUpdate(id, {
            $pull: { favourites: bookid }
        });

        return res.status(200).json({
            message: "Book removed from favourites"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
});


// 📚 Get all favourite books of user
router.get("/get-favourite-books", authenticatetoken, async (req, res) => {
    try {
        const { id } = req.user;

        const user = await User.findById(id).populate("favourites");

        const favouriteBooks = user.favourites;

        return res.status(200).json(favouriteBooks);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

module.exports = router;