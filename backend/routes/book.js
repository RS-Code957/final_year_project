const router = require("express").Router();
const user = require("../models/user");
const jwt = require("jsonwebtoken");
const Book = require("../models/book");
const { authenticatetoken } = require("./userauth");

//  Add Book (Admin only)
router.post("/add-book", authenticatetoken, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }

        const book = new Book({
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            desc: req.body.desc,
            language: req.body.language,
            category: req.body.category,
            url: req.body.url,
        });

        await book.save();

        return res.status(200).json({
            message: "Book added successfully"
        });

    } catch (error) {
    console.log(error); // 🔥 THIS WILL SHOW REAL ERROR
    res.status(500).json({ message: error.message });
}
});


//  Get all books
router.get("/get-all-books", async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });

        return res.status(200).json(books);

    } catch (error) {
        res.status(500).json({ message: "internal server error" });
    }
});


//  Get single book by ID
router.get("/get-book-by-id/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const book = await Book.findById(id);

        return res.status(200).json(book);

    } catch (error) {
        res.status(500).json({ message: "internal server error" });
    }
});


//  Update book (Admin only)
router.put("/update-book/:id", authenticatetoken, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }

        const { id } = req.params;

        await Book.findByIdAndUpdate(id, {
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            desc: req.body.desc,
            language: req.body.language,
            category: req.body.category,
            url: req.body.url,
        });

        return res.status(200).json({
            message: "Book updated successfully"
        });

    } catch (error) {
        res.status(500).json({ message: "internal server error" });
    }
});


// ❌ Delete book (Admin only)
router.delete("/delete-book/:id", authenticatetoken, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }

        const { id } = req.params;

        await Book.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Book deleted successfully"
        });

    } catch (error) {
        res.status(500).json({ message: "internal server error" });
    }
});

module.exports = router;