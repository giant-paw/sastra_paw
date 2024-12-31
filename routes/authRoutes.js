const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../database/db.js");
const router = express.Router();

// Route untuk menampilkan form signup untuk Admin
router.get("/signup/admin", (req, res) => {
  res.render("signup", {
    layout: "layouts/main-layout",
    role: "admin",
    error: null,
  });
});

// Route untuk menampilkan form signup untuk User
router.get("/signup/user", (req, res) => {
  res.render("signup", {
    layout: "layouts/main-layout",
    role: "user",
    error: null,
  });
});

// Route Signup
router.post("/signup", (req, res) => {
  const { username, password, role } = req.body;

  // Validasi input
  if (!username || !password || !role) {
    return res.status(400).render("signup", {
      layout: "layouts/main-layout",
      role,
      error: "Semua field harus diisi!",
    });
  }

  // Hash password dan simpan ke database
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error("❌ Error hashing password:", err.message);
      return res.status(500).send("Internal Server Error");
    }

    db.query(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [username, hash, role],
      (err) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            // Handle duplicate username
            return res.status(400).render("signup", {
              layout: "layouts/main-layout",
              role,
              error: "Username sudah digunakan!",
            });
          }
          console.error("❌ Error registering user:", err.message);
          return res.status(500).send("Internal Server Error");
        }

        res.redirect("/login"); // Arahkan ke halaman login setelah berhasil signup
      }
    );
  });
});

// Route untuk menampilkan form login
router.get("/login", (req, res) => {
  res.render("login", {
    layout: "layouts/main-layout",
    error: null,
  });
});

// Route Login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Validasi input
  if (!username || !password) {
    return res.status(400).render("login", {
      layout: "layouts/main-layout",
      error: "Username dan password harus diisi!",
    });
  }

  // Cek apakah user ada di database
  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err, results) => {
      if (err) {
        console.error("❌ Error fetching user:", err.message);
        return res.status(500).send("Internal Server Error");
      }

      if (results.length === 0) {
        return res.status(400).render("login", {
          layout: "layouts/main-layout",
          error: "Username atau password salah!",
        });
      }

      const user = results[0];

      // Cek password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.error("❌ Error checking password:", err.message);
          return res.status(500).send("Internal Server Error");
        }

        if (!isMatch) {
          return res.status(401).render("login", {
            layout: "layouts/main-layout",
            error: "Username atau password salah!",
          });
        }

        // Simpan data user ke session
        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.role = user.role;

        // Redirect berdasarkan role
        if (user.role === "admin") {
          res.redirect("/");
        } else {
          res.redirect("/userDataBuku");
        }
      });
    }
  );
});

// Route Logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("❌ Error logging out:", err.message);
      return res.status(500).send("Internal Server Error");
    }
    res.redirect("/login"); // Arahkan ke halaman login setelah logout
  });
});


module.exports = router;
