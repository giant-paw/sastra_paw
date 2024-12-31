const express = require("express");
const router = express.Router();
const db = require("../database/db");

// GET: Mendapatkan semua buku
router.get("/", (req, res) => {
  db.query("SELECT * FROM peminjaman", (err, results) => {
    if (err) return res.status(500).send("Internal Server Error");
    res.json(results);
  });
});

// GET: Mendapatkan peminjaman berdasarkan no_pinjaman
router.get("/:no_pinjaman", (req, res) => {
  db.query(
    "SELECT * FROM peminjaman WHERE no_pinjaman = ?",
    [req.params.no_pinjaman],
    (err, results) => {
      if (err) return res.status(500).send("Internal Server Error");
      if (results.length === 0)
        return res.status(404).send("Data peminjaman tidak ditemukan");
      res.json(results[0]);
    }
  );
});

// POST: Menambahkan data peminjaman baru
router.post("/", (req, res) => {
  const { id_anggota, id_buku, judul_buku, tgl_pinjam, tgl_kembali } = req.body;

  // Validasi input
  if (!id_anggota || !id_buku || !judul_buku || !tgl_pinjam || !tgl_kembali) {
    return res.status(400).send('SEMUA FIELD HARUS DI ISI !!!');
}

  // Cari jumlah entri untuk membuat no_pinjaman baru
  db.query("SELECT COUNT(*) AS count FROM peminjaman", (err, results) => {
    if (err) return res.status(500).send("Internal Server Error");

    const count = results[0].count; // Ambil jumlah entri yang ada
    const no_pinjaman = `noPinjam_${count + 1}`; // Buat no_pinjaman baru

    // Masukkan data ke tabel peminjaman
    db.query(
      "INSERT INTO peminjaman (no_pinjaman, id_anggota, id_buku, judul_buku, tgl_pinjam, tgl_kembali) VALUES (?, ?, ?, ?, ?, ?)",
      [no_pinjaman, id_anggota, id_buku, judul_buku, tgl_pinjam, tgl_kembali],
      (err) => {
        if (err){
            console.error("Database error:", err); 
            return res.status(500).send("Internal Server Error");
        } 
        res.status(201).json({ no_pinjaman, id_anggota, id_buku, judul_buku, tgl_pinjam, tgl_kembali });
      }
    );
  });
});

// PUT: Memperbarui buku berdasarkan no_pinjaman
router.put("/:no_pinjaman", (req, res) => {
  const { id_anggota, id_buku, judul_buku, tgl_pinjam, tgl_kembali } = req.body;

  db.query(
    "UPDATE peminjaman SET id_anggota = ?, id_buku = ?, judul_buku = ?, tgl_pinjam = ?, tgl_kembali = ? WHERE no_pinjaman = ?",
    [id_anggota, id_buku, judul_buku, tgl_pinjam, tgl_kembali, req.params.no_pinjaman],
    (err, results) => {
      if (err) return res.status(500).send("Internal Server Error");
      if (results.affectedRows === 0)
        return res.status(404).send("Data peminjaman tidak ditemukan");
      res.json({ no_pinjaman: req.params.no_pinjaman, id_anggota, id_buku, judul_buku, tgl_pinjam, tgl_kembali });
    }
  );
});

// DELETE: Menghapus peminjaman berdasarkan no [peminjaman]
router.delete("/:no_pinjaman", (req, res) => {
  db.query("DELETE FROM peminjaman WHERE no_pinjaman = ?", [req.params.no_pinjaman], (err, results) => {
    if (err) return res.status(500).send("Internal Server Error");
    if (results.affectedRows === 0)
      return res.status(404).send("Data peminjaman tidak ditemukan");
    res.status(204).send();
  });
});

module.exports = router;
