import React, { useState, useEffect } from 'react'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import ExpenseSummary from './components/ExpenseSummary'
import ExpenseFilters from './components/ExpenseFilters'
import {
  loadExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
} from './utils/storage'
import './App.css'

export default function AppWithSidebar() {
  const [activeTab, setActiveTab] = useState('expenses') 
  const [expenses, setExpenses] = useState([])
  const [editingExpense, setEditingExpense] = useState(null)
  const [filters, setFilters] = useState({ category: '', startDate: '', endDate: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    const loadData = async () => {
      setLoading(true)
      try {
        const loaded = await loadExpenses(filters)
        if (mounted) setExpenses(Array.isArray(loaded) ? loaded : [])
      } catch (err) {
        console.error('Failed to load expenses:', err)
        if (mounted) alert('Failed to load expenses. Please check the backend/server.')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    loadData()
    return () => {
      mounted = false
    }
  }, [filters])

  const handleAddExpense = async (expense) => {
    try {
      const newExpense = await addExpense(expense)
      setExpenses((prev) => [newExpense, ...prev])
      setActiveTab('expenses')
    } catch (err) {
      console.error(err)
      alert('Failed to add expense.')
    }
  }

  const handleUpdateExpense = async (updated) => {
    try {
      const result = await updateExpense(updated.id, {
        amount: updated.amount,
        date: updated.date,
        category: updated.category,
        note: updated.note,
      })
      setExpenses((prev) => prev.map((e) => (e.id === updated.id ? result : e)))
      setEditingExpense(null)
      setActiveTab('expenses')
    } catch (err) {
      console.error(err)
      alert('Failed to update expense.')
    }
  }

  const handleDeleteExpense = async (id) => {
    try {
      await deleteExpense(id)
      setExpenses((prev) => prev.filter((e) => e.id !== id))
    } catch (err) {
      console.error(err)
      alert('Failed to delete expense.')
    }
  }

  const handleImportExpenses = (imported) => {
    if (!Array.isArray(imported)) return
    setExpenses(imported)
  }

  const renderContent = () => {
    if (activeTab === 'form') {
      return (
        <div className="content-panel">
          <ExpenseForm
            onAddExpense={handleAddExpense}
            onUpdateExpense={handleUpdateExpense}
            editingExpense={editingExpense}
            onCancelEdit={() => setEditingExpense(null)}
          />
        </div>
      )
    }

    if (activeTab === 'summary') {
      return (
        <div className="content-panel">
          <ExpenseSummary expenses={expenses} onImportExpenses={handleImportExpenses} />
        </div>
      )
    }

    return (
      <div className="content-panel">
        <div style={{ marginBottom: 12 }}>
          <ExpenseFilters filters={filters} onFiltersChange={(f) => setFilters(f)} expenses={expenses} />
        </div>

        {loading ? (
          <div style={{ padding: 12 }}>Loading expenses...</div>
        ) : (
          <ExpenseList
            expenses={expenses}
            onEditExpense={(e) => {
              setEditingExpense(e)
              setActiveTab('form')
            }}
            onDeleteExpense={handleDeleteExpense}
          />
        )}
      </div>
    )
  }

  const SIDEBAR_WIDTH = 240
  const sidebarStyle = {
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    padding: '1rem',
    background: 'var(--muted-surface, #111827)',
    borderRight: '1px solid var(--border, #222831)',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    zIndex: 999,
  }

  const sidebarHeaderStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    paddingBottom: 8,
    borderBottom: '1px solid rgba(255,255,255,0.03)'
  }

  const navStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    marginTop: 12,
    flex: '1 1 auto'
  }

  const tabBtn = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '0.6rem 0.8rem',
    borderRadius: 6,
    width: '100%',
    background: isActive ? 'var(--primary, #6366f1)' : 'transparent',
    color: isActive ? '#fff' : 'var(--text, #e6eef8)',
    border: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    fontWeight: 600,
  })

  const mainStyle = {
    marginLeft: SIDEBAR_WIDTH,
    padding: '1rem',
    minHeight: '100vh',
    background: 'var(--bg, #05090e)'
  }

  return (
    <div className="app">
      {/* fixed sidebar */}
      <aside style={sidebarStyle} className="dashboard-sidebar">
        <div style={sidebarHeaderStyle} className="sidebar-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--primary)', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 800 }}>
              ET
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>Expense Tracker</div>
            </div>
          </div>
        </div>

        <nav style={navStyle} aria-label="Main navigation">
          <button style={tabBtn(activeTab === 'expenses')} onClick={() => setActiveTab('expenses')}>
            Expenses
          </button>

          <button style={tabBtn(activeTab === 'form')} onClick={() => setActiveTab('form')}>
            Add / Edit
          </button>

          <button style={tabBtn(activeTab === 'summary')} onClick={() => setActiveTab('summary')}>
            Summary
          </button>

          <div style={{ marginTop: 'auto' }}>
            <hr style={{ borderColor: 'var(--border, #222831)' }} />
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button className="btn btn-sm btn-secondary" onClick={() => setFilters({ category: '', startDate: '', endDate: '' })}>
                Clear filters
              </button>

              <button className="btn btn-sm" onClick={() => { setEditingExpense(null); setActiveTab('form') }}>
                New expense
              </button>
            </div>
          </div>
        </nav>
      </aside>

      <main style={mainStyle}>
        <div className="app-content">{renderContent()}</div>
      </main>
    </div>
  )
}
