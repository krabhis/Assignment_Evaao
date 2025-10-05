function ExpenseItem({ expense, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getCategoryIcon = (category) => {
    const icons = {
      'Food & Dining': '🍽️',
      'Transportation': '🚗',
      'Shopping': '🛍️',
      'Entertainment': '🎬',
      'Bills & Utilities': '💡',
      'Healthcare': '🏥',
      'Travel': '✈️',
      'Education': '📚',
      'Other': '📋'
    }
    return icons[category] || '📋'
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      onDelete(expense.id)
    }
  }

  return (
    <div className="expense-item">
      <div className="expense-item-header">
        <div className="expense-category">
          <span className="category-icon">{getCategoryIcon(expense.category)}</span>
          <span className="category-name">{expense.category}</span>
        </div>
        <div className="expense-amount">
          {formatAmount(expense.amount)}
        </div>
      </div>
      
      <div className="expense-item-body">
        <p className="expense-note">{expense.note}</p>
        <div className="expense-meta">
          <span className="expense-date">{formatDate(expense.date)}</span>
          <div className="expense-actions">
            <button 
              onClick={() => onEdit(expense)} 
              className="btn btn-sm btn-edit"
              title="Edit expense"
            >
              ✏️
            </button>
            <button 
              onClick={handleDelete} 
              className="btn btn-sm btn-delete"
              title="Delete expense"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExpenseItem
