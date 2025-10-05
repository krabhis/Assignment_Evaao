import Expense from '../models/Expense.js';

export const getAllExpenses = async (req, res) => {
  try {
    const { category, startDate, endDate } = req.query;
    
    const filter = {};
    
    if (category) {
      filter.category = category;
    }
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    }
    
    const expenses = await Expense.find(filter)
      .sort({ date: -1, createdAt: -1 })
      .lean();
    
    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching expenses',
      error: error.message
    });
  }
};

export const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: expense
    });
  } catch (error) {
    console.error('Error fetching expense:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching expense',
      error: error.message
    });
  }
};

export const createExpense = async (req, res) => {
  try {
    console.log(req.body);

    const { amount, date, category, note } = req.body;
    
    if (!amount || !date || !category || !note) {
      return res.status(400).json({
        success: false,
        message: 'All fields (amount, date, category, note) are required'
      });
    }
    
    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0'
      });
    }
    
    const expense = new Expense({
      amount: parseFloat(amount),
      date: new Date(date),
      category,
      note: note.trim()
    });
    
    const savedExpense = await expense.save();
    
    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: savedExpense
    });
  } catch (error) {
    console.error('Error creating expense:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating expense',
      error: error.message
    });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { amount, date, category, note } = req.body;
    
    if (!amount || !date || !category || !note) {
      return res.status(400).json({
        success: false,
        message: 'All fields (amount, date, category, note) are required'
      });
    }
    
    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0'
      });
    }
    
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      {
        amount: parseFloat(amount),
        date: new Date(date),
        category,
        note: note.trim(),
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );
    
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      data: expense
    });
  } catch (error) {
    console.error('Error updating expense:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error updating expense',
      error: error.message
    });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
      data: expense
    });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting expense',
      error: error.message
    });
  }
};

export const getExpenseStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const filter = {};
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    }
    
    const totalStats = await Expense.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalCount: { $sum: 1 },
          averageAmount: { $avg: '$amount' }
        }
      }
    ]);
    
    const categoryStats = await Expense.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { totalAmount: -1 } }
    ]);
    
    const monthlyStats = await Expense.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    const stats = {
      total: totalStats[0] || { totalAmount: 0, totalCount: 0, averageAmount: 0 },
      categories: categoryStats,
      monthly: monthlyStats
    };
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching expense stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching expense statistics',
      error: error.message
    });
  }
};

export const clearAllExpenses = async (req, res) => {
  try {
    const result = await Expense.deleteMany({});
    
    res.status(200).json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} expenses`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error clearing expenses:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing expenses',
      error: error.message
    });
  }
};
