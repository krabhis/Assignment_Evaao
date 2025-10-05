import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0']
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now
  },
  category:{
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Food & Dining',
      'Transportation', 
      'Shopping',
      'Entertainment',
      'Bills & Utilities',
      'Healthcare',
      'Travel',
      'Education',
      'Other'
    ]
  },
  note: {
    type: String,
    required: [true, 'Note is required'],
    trim: true,
    maxlength: [500, 'Note cannot exceed 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

expenseSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

expenseSchema.index({ date: -1 });
expenseSchema.index({ category: 1});
expenseSchema.index({ createdAt: -1 });

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;
