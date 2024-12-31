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
router.get("/:kode_buku", (req, res) => {
  db.query(
    "SELECT * FROM buku WHERE kode_buku = ?",
    [req.params.kode_buku],
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

  // Validasi input
  if (!judul_buku || !pengarang || !penerbit) {
    return res.status(400).send("Semua field harus diisi!");
  }

  // Cari jumlah entri untuk membuat ID baru
  db.query("SELECT COUNT(*) AS count FROM buku", (err, results) => {
    if (err) return res.status(500).send("Internal Server Error");

    const count = results[0].count; // Ambil jumlah entri yang ada
    const kode_buku = `buku_${count + 1}`; // Buat ID baru

    // Masukkan data ke tabel buku
    db.query(
      "INSERT INTO buku (kode_buku, judul_buku, pengarang, penerbit) VALUES (?, ?, ?, ?)",
      [kode_buku, judul_buku, pengarang, penerbit],
      (err) => {
        if (err) return res.status(500).send("Internal Server Error");
        res.status(201).json({ kode_buku, judul_buku, pengarang, penerbit });
      }
    );
  });
});

// PUT: Memperbarui buku berdasarkan ID
router.put("/:kode_buku", (req, res) => {
  const { judul_buku, pengarang, penerbit } = req.body;

  db.query(
    "UPDATE buku SET judul_buku = ?, pengarang = ?, penerbit = ? WHERE kode_buku = ?",
    [judul_buku, pengarang, penerbit, req.params.kode_buku],
    (err, results) => {
      if (err) return res.status(500).send("Internal Server Error");
      if (results.affectedRows === 0)
        return res.status(404).send("Data buku tidak ditemukan");
      res.json({ kode_buku: req.params.kode_buku, judul_buku, pengarang, penerbit });
    }
  );
});

// DELETE: Menghapus buku berdasarkan ID
router.delete("/:kode_buku", (req, res) => {
  db.query("DELETE FROM buku WHERE kode_buku = ?", [req.params.kode_buku], (err, results) => {
    if (err) return res.status(500).send("Internal Server Error");
    if (results.affectedRows === 0)
      return res.status(404).send("Data buku tidak ditemukan");
    res.status(204).send();
  });
});

module.exports = router;
