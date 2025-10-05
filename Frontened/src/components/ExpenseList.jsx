import ExpenseItem from './ExpenseItem'

function ExpenseList({ expenses, onEditExpense, onDeleteExpense }) {
  if (expenses.length === 0) {
    return (
      <div className="expense-list">
        <h2>Expenses</h2>
        <div className="empty-state">
          <p>📝 No expenses found</p>
          <p>Add your first expense to get started!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="expense-list">
      <h2>Expenses ({expenses.length})</h2>
      <div className="expense-items">
        {expenses.map(expense => (
          <ExpenseItem
            key={expense.id}
            expense={expense}
            onEdit={onEditExpense}
            onDelete={onDeleteExpense}
          />
        ))}
      </div>
    </div>
  )
}

export default ExpenseList
