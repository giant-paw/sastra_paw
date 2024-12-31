const express = require("express");
const router = express.Router();
const db = require("../database/db");

// GET: Mendapatkan semua buku
router.get("/", (req, res) => {
  db.query("SELECT * FROM buku", (err, results) => {
    if (err) return res.status(500).send("Internal Server Error");
    res.json(results);
  });
});

// GET: Mendapatkan buku berdasarkan ID
router.get("/:id", (req, res) => {
  db.query(
    "SELECT * FROM buku WHERE id = ?",
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).send("Internal Server Error");
      if (results.length === 0)
        return res.status(404).send("Data buku tidak ditemukan");
      res.json(results[0]);
    }
  );
});

// POST: Menambahkan buku baru
router.post("/", (req, res) => {
  const { judul_buku, pengarang, penerbit } = req.body;

  if (!judul_buku || !pengarang || !penerbit) {
    return res.status(400).send("Semua field harus diisi!");
  }
// Cari jumlah entri untuk membuat ID baru
db.query("SELECT COUNT(*) AS count FROM buku", (err, results) => {
    if (err) return res.status(500).send("Internal Server Error");

    const count = results[0].count; // Ambil jumlah entri yang ada
    const id = `buku_${count + 1}`; // Buat ID baru

    // Masukkan data ke tabel buku
    db.query(
      "INSERT INTO buku (id, judul_buku, pengarang, penerbit) VALUES (?, ?, ?, ?)",
      [id, judul_buku, pengarang, penerbit],
      (err) => {
        if (err) return res.status(500).send("Internal Server Error");
        res.status(201).json({ id, judul_buku, pengarang, penerbit });
      }
    );
  });
});

// PUT: Memperbarui buku berdasarkan ID
router.put("/:id", (req, res) => {
  const { judul_buku, pengarang, penerbit } = req.body;

  db.query(
    "UPDATE buku SET judul_buku = ?, pengarang = ?, penerbit = ? WHERE id = ?",
    [judul_buku, pengarang, penerbit, req.params.id],
    (err, results) => {
      if (err) return res.status(500).send("Internal Server Error");
      if (results.affectedRows === 0)
        return res.status(404).send("Data buku tidak ditemukan");
      res.json({ id: req.params.id, judul_buku, pengarang, penerbit });
    }
  );
});

// DELETE: Menghapus buku berdasarkan ID
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM buku WHERE id = ?", [req.params.id], (err, results) => {
    if (err) return res.status(500).send("Internal Server Error");
    if (results.affectedRows === 0)
      return res.status(404).send("Data buku tidak ditemukan");
    res.status(204).send();
  });
});

module.exports = router;
