import { useState, useEffect } from 'react'

const CATEGORIES = [
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

function ExpenseForm({ onAddExpense, onUpdateExpense, editingExpense, onCancelEdit }) {
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    note: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (editingExpense) {
      setFormData({
        amount: editingExpense.amount.toString(),
        date: editingExpense.date,
        category: editingExpense.category,
        note: editingExpense.note
      })
    } else {
      setFormData({
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category: '',
        note: ''
      })
    }
    setErrors({})
  }, [editingExpense])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0'
    }

    if (!formData.date) {
      newErrors.date = 'Date is required'
    }

    if (!formData.category) {
      newErrors.category = 'Category is required'
    }

    if (!formData.note.trim()) {
      newErrors.note = 'Note is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const expenseData = {
      ...formData,
      amount: parseFloat(formData.amount),
      note: formData.note.trim()
    }

    if (editingExpense) {
      onUpdateExpense({ ...expenseData, id: editingExpense.id })
    } else {
      onAddExpense(expenseData)
    }

    // Reset form
    setFormData({
      amount: '',
      date: new Date().toISOString().split('T')[0],
      category: '',
      note: ''
    })
    setErrors({})
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  return (
    <div className="expense-form">
      <h2>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</h2>
      
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="amount">Amount ($)</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            step="0.01"
            min="0"
            className={errors.amount ? 'error' : ''}
            placeholder="Enter amount"
          />
          {errors.amount && <span className="error-message">{errors.amount}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={errors.date ? 'error' : ''}
          />
          {errors.date && <span className="error-message">{errors.date}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={errors.category ? 'error' : ''}
          >
            <option value="">Select a category</option>
            {CATEGORIES.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && <span className="error-message">{errors.category}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="note">Note</label>
          <textarea
            id="note"
            name="note"
            value={formData.note}
            onChange={handleChange}
            className={errors.note ? 'error' : ''}
            placeholder="Enter expense description"
            rows="3"
          />
          {errors.note && <span className="error-message">{errors.note}</span>}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editingExpense ? 'Update Expense' : 'Add Expense'}
          </button>
          {editingExpense && (
            <button type="button" onClick={onCancelEdit} className="btn btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default ExpenseForm
