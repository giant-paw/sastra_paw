const express = require('express');
const router = express.Router();

let books = [
    {
       kode_buku: 1, judul_buku: "Bulan", pengarang: "Tere Liye", penerbit: "Gramedia"
    },
    {
        kode_buku: 2, judul_buku: "Grit", pengarang: "Angela Duckworth", penerbit: "Sinar Pustaka"
     }
];

router.get('/', (req, res) => {
    res.json(books);
});

router.post('/', (req, res) => {
    const newBook = {
        kode_buku: books.length + 1,
        judul_buku: req.body.judul_buku,
        pengarang: req.body.pengarang,
        penerbit: req.body.penerbit
    };
    books.push(newBook);
    res.status(201).json(newBook);
});

router.delete('/:id', (req, res) => {
    const bookIndex = books.findIndex(t => t.id === parseInt(req.params.id));
    if (bookIndex === -1) return res.status(404).json({message: 'Buku tidak ditemukan'});

    const deletedBook = books.splice(bookIndex, 1)[0];
    res.status(200).json({message: `Buku '${deletedBook.judul_buku}' telah dihapus`});
});

router.put('/:id', (req, res) => {
    const book = books.find(t => t.id === parseInt(req.params.id));
    if (!book) return res.status(404).json({message: 'Buku tidak ditemukan'});

    book.judul_buku = req.body.judul_buku || book.judul_buku;
    book.pengarang = req.body.pengarang || book.pengarang;
    book.penerbit = req.body.penerbit || book.penerbit;

    res.status(200).json({
        message: `Buku dengan ID ${book.id} telah diperbarui`,
        updatedBook: book
    });
});

module.exports = router;