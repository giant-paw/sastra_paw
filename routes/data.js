const express = require("express");
const router = express.Router();

// GET: Mendapatkan semua buku
router.get("/", (req, res) => {
  res.json(books);
});

// POST: Menambahkan buku baru
router.post("/", (req, res) => {
  const newBook = {
    judul_buku: req.body.judul_buku,
    pengarang: req.body.pengarang,
    penerbit: req.body.penerbit,
  };
  if (!newBook.judul_buku || !newBook.pengarang || !newBook.penerbit) {
    return res.status(400).json({ message: "SEMUA FIELD HARUS DIISI!" });
  }
  books.push(newBook);
  res.status(201).json(newBook);
});

// DELETE: Menghapus buku
router.delete("/:id", (req, res) => {
  const bookIndex = books.findIndex(
    (b) => b.id === parseInt(req.params.id)
  );
  if (bookIndex === -1)
    return res.status(404).json({ message: "Buku tidak ditemukan" });
  const deletedBook = books.splice(bookIndex, 1)[0];
  res
    .status(200)
    .json({ message: `Buku '${deletedBook.judul_buku}' telah dihapus` });
});

// PUT: Memperbarui buku
router.put("/:id", (req, res) => {
  const book = books.find(
    (b) => b.id === parseInt(req.params.id)
  );
  if (!book) return res.status(404).json({ message: "Buku tidak ditemukan" });

  book.judul_buku = req.body.judul_buku || book.judul_buku;
  book.pengarang = req.body.pengarang || book.pengarang;
  book.penerbit = req.body.penerbit || book.penerbit;

  res.status(200).json({
    message: `Buku dengan kode ${book.id} telah diperbarui`,
    updatedBook: book,
  });
});

module.exports = router;
