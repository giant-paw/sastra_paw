const express = require('express');
const router = express.Router();
const db = require('../database/db'); // Mengimpor koneksi database

// Endpoint untuk mendapatkan semua data buku
router.get('/', (req, res) => {
    db.query('SELECT * FROM buku', (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.json(results);
    });
});

// Endpoint untuk mendapatkan data buku berdasarkan ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM buku WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.length === 0) return res.status(404).send('Data buku tidak ditemukan');
        res.json(results[0]);
    });
});

// Endpoint untuk menambahkan data buku baru
router.post('/', (req, res) => {
    const { judul_buku, pengarang, penerbit } = req.body;
    if (!judul_buku || !pengarang || !penerbit) {
        return res.status(400).send('SEMUA FIELD HARUS DI ISI !!!');
    }

    db.query('INSERT INTO buku (judul_buku, pengarang, penerbit) VALUES (?, ?, ?)', [judul_buku, pengarang, penerbit], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        const newBook = { id: results.insertId, judul_buku, pengarang, penerbit};
        res.status(201).json(newBook);
    });
});

// Endpoint untuk memperbarui data buku
router.put('/:id', (req, res) => {
    const { judul_buku, pengarang, penerbit} = req.body;

    db.query('UPDATE buku SET judul_buku = ?, pengarang = ?, penerbit = ? WHERE id = ?', [judul_buku, pengarang, penerbit, req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Data buku tidak ditemukan');
        res.json({ id: req.params.id, judul_buku, pengarang, penerbit });
    });
});

// Endpoint untuk menghapus data hewan
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM buku WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Data buku tidak ditemukan');
        res.status(204).send();
    });
});

module.exports = router;
