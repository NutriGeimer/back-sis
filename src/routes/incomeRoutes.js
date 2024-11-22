import express from 'express';
import {
    addIncome,
    updateIncome,
    getIncomeById,
    getTotalIncome,
} from '../controller/incomeController.js';

const router = express.Router();

router.post('/add', addIncome);
router.put('/update/:id', updateIncome);
router.get('/id/:id', getIncomeById);
router.get('/total', getTotalIncome);

export default router;
