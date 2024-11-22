import express from 'express';
import {
    addSale,
    updateSale,
    deleteSale,
    getSaleById,
    getSalesByRefresko,
} from '../controller/salesController.js';

const router = express.Router();

router.post('/add', addSale);
router.put('/update/:id', updateSale);
router.delete('/delete/:id', deleteSale);
router.get('/id/:id', getSaleById);
router.get('/refresko/:refreskoId', getSalesByRefresko);

export default router;
