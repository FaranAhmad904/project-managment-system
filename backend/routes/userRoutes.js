const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
    getUsers
} = require("../controllers/authController");

const router = express.Router();

router.get("/profile", protect, (req, res) => {
    res.json({
        message: "Protected route accessed successfully",
        user: req.user
    });
});
router.get("/", protect, getUsers);
module.exports = router;