const express = require("express");
const router = express.Router();

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

  book.id_anggota = req.body.id_anggota || book.id_anggota;
  book.id_buku = req.body.id_buku || book.id_buku;
  book.judul_buku = req.body.judul_buku || book.judul_buku;
  book.tgl_pinjam = req.body.tgl_pinjam || book.tgl_pinjam;
  book.tgl_kembali = req.body.tgl_kembali || book.tgl_kembali;

  res.status(200).json({
    message: `Data peminjaman dengan kode ${book.id_anggota} telah diperbarui`,
    updatedBook: loan,
  });
});

module.exports = router;
