const express = require("express");
const router = express.Router();

// Inisialisasi array untuk menyimpan data peminjaman
const loans = []; // Tambahkan ini di bagian atas file

// GET: Mendapatkan semua peminjaman
router.get("/", (req, res) => {
  res.json(loans);
});

// POST: Menambahkan data peminjaman baru
router.post("/", (req, res) => {
  const newLoan = {
    id_anggota: req.body.id_anggota,
    id_buku: req.body.id_buku,
    judul_buku: req.body.judul_buku,
    tgl_pinjam: req.body.tgl_pinjam,
    tgl_kembali: req.body.tgl_kembali,
  };
  if (!newLoan.id_anggota || !newLoan.id_buku || !newLoan.judul_buku || !newLoan.tgl_pinjam || !newLoan.tgl_kembali) {
    console.error("Validation failed: Missing required fields");
    return res.status(400).json({ message: "SEMUA FIELD HARUS DIISI!" });
  }
  loans.push(newLoan);
  res.status(201).json(newLoan);
});

// DELETE: Menghapus data peminjaman
router.delete("/:no_pinjaman", (req, res) => {
  const loanIndex = loans.findIndex(
    (b) => b.no_pinjaman === parseInt(req.params.no_pinjaman)
  );
  if (loanIndex === -1)
    return res.status(404).json({ message: "Data peminjaman tidak ditemukan" });
  const deletedLoan = loans.splice(loanIndex, 1)[0];
  res
    .status(200)
    .json({ message: `Data peminjaman '${deletedLoan.id_anggota}' telah dihapus` });
});

// PUT: Memperbarui data peminjaman
router.put("/:no_pinjaman", (req, res) => {
  const loan = loans.find(
    (b) => b.no_pinjaman === parseInt(req.params.no_pinjaman)
  );
  if (!loan) return res.status(404).json({ message: "Data peminjaman tidak ditemukan" });

  loan.id_anggota = req.body.id_anggota || loan.id_anggota;
  loan.id_buku = req.body.id_buku || loan.id_buku;
  loan.judul_buku = req.body.judul_buku || loan.judul_buku;
  loan.tgl_pinjam = req.body.tgl_pinjam || loan.tgl_pinjam;
  loan.tgl_kembali = req.body.tgl_kembali || loan.tgl_kembali;

  res.status(200).json({
    message: `Data peminjaman dengan kode ${loan.id_anggota} telah diperbarui`,
    updatedLoan: loan,
  });
});

module.exports = router;
