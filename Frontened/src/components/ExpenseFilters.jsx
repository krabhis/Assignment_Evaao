import { useState } from 'react'

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

function ExpenseFilters({ filters, onFiltersChange, expenses }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleFilterChange = (filterName, value) => {
    onFiltersChange(prev => ({
      ...prev,
      [filterName]: value
    }))
  }

  const clearFilters = () => {
    onFiltersChange({
      category: '',
      startDate: '',
      endDate: ''
    })
  }

  const hasActiveFilters = filters.category || filters.startDate || filters.endDate

  const getUniqueCategories = () => {
    const categories = [...new Set(expenses.map(expense => expense.category))]
    return categories.sort()
  }

  return (
    <div className="expense-filters">
      <div className="filters-header">
        <h2> Filters</h2>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="btn btn-sm btn-toggle"
        >
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {isExpanded && (
        <div className="filters-content">
          <div className="filter-group">
            <label htmlFor="category-filter">Category</label>
            <select
              id="category-filter"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              {getUniqueCategories().map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="start-date">Start Date</label>
            <input
              type="date"
              id="start-date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="end-date">End Date</label>
            <input
              type="date"
              id="end-date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
          </div>

          <div className="filter-actions">
            <button 
              onClick={clearFilters}
              className="btn btn-secondary"
              disabled={!hasActiveFilters}
            >
              Clear Filters
            </button>
          </div>

          {hasActiveFilters && (
            <div className="active-filters">
              <h4>Active Filters:</h4>
              <div className="filter-tags">
                {filters.category && (
                  <span className="filter-tag">
                    Category: {filters.category} 
                    <button 
                      onClick={() => handleFilterChange('category', '')}
                      className="remove-filter"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.startDate && (
                  <span className="filter-tag">
                    From: {new Date(filters.startDate).toLocaleDateString()}
                    <button 
                      onClick={() => handleFilterChange('startDate', '')}
                      className="remove-filter"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.endDate && (
                  <span className="filter-tag">
                    To: {new Date(filters.endDate).toLocaleDateString()}
                    <button 
                      onClick={() => handleFilterChange('endDate', '')}
                      className="remove-filter"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ExpenseFilters
