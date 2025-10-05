import React from 'react'
import { FaUtensils, FaCar, FaShoppingBag, FaFilm, FaLightbulb, FaHospital, FaPlane, FaBook, FaClipboard } from 'react-icons/fa'
import { exportExpenses, importExpenses, clearAllExpenses } from '../utils/storage'

function ExpenseSummary({ expenses, onImportExpenses }) {
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {})

  const monthlyTotals = expenses.reduce((acc, expense) => {
    const month = new Date(expense.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    })
    acc[month] = (acc[month] || 0) + expense.amount
    return acc
  }, {})

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  // Replace emoji mapping with React Icons (FontAwesome)
  const getCategoryIcon = (category, size = 18) => {
    const icons = {
      'Food & Dining': <FaUtensils size={size} aria-label="Food & Dining" />,
      'Transportation': <FaCar size={size} aria-label="Transportation" />,
      'Shopping': <FaShoppingBag size={size} aria-label="Shopping" />,
      'Entertainment': <FaFilm size={size} aria-label="Entertainment" />,
      'Bills & Utilities': <FaLightbulb size={size} aria-label="Bills & Utilities" />,
      'Healthcare': <FaHospital size={size} aria-label="Healthcare" />,
      'Travel': <FaPlane size={size} aria-label="Travel" />,
      'Education': <FaBook size={size} aria-label="Education" />,
      'Other': <FaClipboard size={size} aria-label="Other" />,
      'None': <FaClipboard size={size} aria-label="None" />
    }
    return icons[category] || <FaClipboard size={size} aria-label={category} />
  }

  const topCategory = Object.entries(categoryTotals).reduce((max, [category, amount]) => 
    amount > max.amount ? { category, amount } : max, 
    { category: 'None', amount: 0 }
  )

  const handleExport = async () => {
    const result = await exportExpenses(expenses)
    if (result.success) {
      alert('Expenses exported successfully!')
    } else if (!result.canceled) {
      alert(`Export failed: ${result.error}`)
    }
  }

  const handleImport = async () => {
    const result = await importExpenses()
    if (result.success) {
      onImportExpenses(result.expenses)
      alert('Expenses imported successfully!')
    } else if (!result.canceled) {
      alert(`Import failed: ${result.error}`)
    }
  }

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear all expenses? This action cannot be undone.')) {
      await clearAllExpenses()
      onImportExpenses([])
      alert('All expenses cleared!')
    }
  }

  return (
    <div className="expense-summary">
      <div className="summary-header">
        <h2> Summary</h2>
        <div className="summary-actions">
          <button onClick={handleExport} className="btn btn-sm btn-secondary">
             Export
          </button>
          <button onClick={handleImport} className="btn btn-sm btn-secondary">
             Import
          </button>
          {expenses.length > 0 && (
            <button onClick={handleClearAll} className="btn btn-sm btn-delete">
               Clear All
            </button>
          )}
        </div>
      </div>
      
      <div className="summary-cards">
        <div className="summary-card total">
          <div className="card-icon"></div>
          <div className="card-content">
            <h3>Total Spent</h3>
            <p className="amount">{formatAmount(totalAmount)}</p>
            <p className="count">{expenses.length} expenses</p>
          </div>
        </div>

        <div className="summary-card top-category">
          <div className="card-icon">{getCategoryIcon(topCategory.category, 22)}</div>
          <div className="card-content">
            <h3>Top Category</h3>
            <p className="category">{topCategory.category}</p>
            <p className="amount">{formatAmount(topCategory.amount)}</p>
          </div>
        </div>

        <div className="summary-card average">
          <div className="card-icon"></div>
          <div className="card-content">
            <h3>Average</h3>
            <p className="amount">
              {expenses.length > 0 ? formatAmount(totalAmount / expenses.length) : '$0.00'}
            </p>
            <p className="count">per expense</p>
          </div>
        </div>
      </div>

      {Object.keys(categoryTotals).length > 0 && (
        <div className="category-breakdown">
          <h3>By Category</h3>
          <div className="category-list">
            {Object.entries(categoryTotals)
              .sort(([,a], [,b]) => b - a)
              .map(([category, amount]) => (
                <div key={category} className="category-item">
                  <div className="category-info">
                    <span className="category-icon">{getCategoryIcon(category)}</span>
                    <span className="category-name">{category}</span>
                  </div>
                  <div className="category-amount">
                    {formatAmount(amount)}
                    <span className="category-percentage">
                      ({((amount / totalAmount) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {Object.keys(monthlyTotals).length > 0 && (
        <div className="monthly-breakdown">
          <h3>By Month</h3>
          <div className="monthly-list">
            {Object.entries(monthlyTotals)
              .sort(([a], [b]) => new Date(a) - new Date(b))
              .map(([month, amount]) => (
                <div key={month} className="monthly-item">
                  <span className="month-name">{month}</span>
                  <span className="month-amount">{formatAmount(amount)}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ExpenseSummary
