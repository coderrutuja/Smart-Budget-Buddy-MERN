// backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  registerUser,
  loginUser,
  getUserInfo,
} = require("../controllers/authController");

// ✅ Register a new user
router.post("/register", registerUser);

// ✅ Login user
router.post("/login", loginUser);

// ✅ Get user info (protected)
router.get("/getUser", protect, getUserInfo);

// ✅ Upload profile image
router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.status(200).json({ imageUrl });
});

module.exports = router;


// const express = require("express");
// const { protect } = require("../middleware/authMiddleware");
// const { registerUser, loginUser, getUserInfo } = require("../controllers/authController");
// const upload = require("../middleware/uploadMiddleware");

// const router = express.Router();

// router.post("/register", registerUser);
// router.post("/login", loginUser);
// router.get("/getUser", protect, getUserInfo);

// router.post("/upload-image", upload.single("image"), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: "No file uploaded" });
//   }
//   const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
//   res.status(200).json({ imageUrl });
// });

// module.exports = router;



// const express = require("express");
// const { protect } = require("../middleware/authMiddleware");

// const {
//     registerUser,
//     loginUser,
//     getUserInfo,
// } = require("../controllers/authController");

// const upload = require("../middleware/uploadMiddleware");

// const router = express. Router();

// router.post("/register", registerUser);

// router.post("/login", loginUser);

// router.get("/getUser", protect, getUserInfo);

// router.post("/upload-image", upload.single("image"), (req,res) => {
//     if(!req.file) {
//         return res.status(400).json({ message: "No file uploaded "})
//     }

//     const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
//     res.status(200).json({ imageUrl });
// })

// module.exports = router;