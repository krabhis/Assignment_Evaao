import express from 'express';
import {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseStats,
  clearAllExpenses
} from '../controllers/expenseController.js';

const router = express.Router();

router.get('/', getAllExpenses);

router.get('/stats', getExpenseStats);

router.get('/:id', getExpenseById);

router.post('/', createExpense);

router.put('/:id', updateExpense);

router.delete('/:id', deleteExpense);

router.delete('/', clearAllExpenses);

export default router;
