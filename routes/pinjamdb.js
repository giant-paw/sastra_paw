const express = require("express");
const router = express.Router();
const db = require("../database/db");

// GET: Mendapatkan semua peminjaman
router.get("/", (req, res) => {
  db.query("SELECT * FROM peminjaman", (err, results) => {
    if (err) return res.status(500).send("Internal Server Error");
    res.json(results);
  });
});

// Endpoint untuk mendapatkan data buku berdasarkan ID
router.get('/:no_pinjaman', (req, res) => {
    db.query('SELECT * FROM peminjaman WHERE no_pinjaman = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.length === 0) return res.status(404).send('Data peminjaman tidak ditemukan');
        res.json(results[0]);
    });
});

// Endpoint untuk menambahkan data peminjaman baru
router.post('/', (req, res) => {
    const { id_anggota, id_buku, judul_buku, tgl_pinjam, tgl_kembali } = req.body;
    if (!id_anggota || !id_buku || !judul_buku || !tgl_pinjam || !tgl_kembali) {
        return res.status(400).send('SEMUA FIELD HARUS DI ISI !!!');
    }

    db.query('INSERT INTO peminjaman (id_anggota, id_buku, judul_buku, tgl_pinjam, tgl_kembali) VALUES (?, ?, ?, ?, ?)', [id_anggota, id_buku, judul_buku, tgl_pinjam, tgl_kembali], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        const newLoan = { no_pinjaman: results.insertNoPinjaman, id_anggota, id_buku, judul_buku, tgl_pinjam, tgl_kembali};
        res.status(201).json(newLoan);
    });
});

// Endpoint untuk memperbarui data Pinjam
router.put('/:no_pinjaman', (req, res) => {
    const { id_anggota, id_buku, judul_buku, tgl_pinjam, tgl_kembali } = req.body;

    db.query('UPDATE peminjaman SET id_anggota = ?, id_buku = ?, judul_buku = ?, tgl_pinjam = ?, tgl_kembali = ? WHERE no_pinjaman = ?', [id_anggota, id_buku, judul_buku, tgl_pinjam, tgl_kembali, req.params.no_pinjaman], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Data peminjaman tidak ditemukan');
        res.json({ no_pinjaman: req.params.no_pinjaman, id_anggota, id_buku, judul_buku, tgl_pinjam, tgl_kembali });
    });
});

// Endpoint untuk menghapus data peminjaman
router.delete('/:no_pinjaman', (req, res) => {
    db.query('DELETE FROM peminjaman WHERE no_pinjaman = ?', [req.params.no_pinjaman], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Data peminjaman tidak ditemukan');
        res.status(204).send();
    });
});

module.exports = router;
