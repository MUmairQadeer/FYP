import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Wallet, TrendingUp, Plus, DollarSign, Activity, MapPin, Search } from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext';

export default function BudgetTracker() {
  const { budget, totalSpent, expenses, baseCurrency } = useCurrency();
  const remaining = budget - totalSpent;
  const percentSpent = Math.min((totalSpent / budget) * 100, 100);

  const [newExpense, setNewExpense] = useState({ label: '', amount: '', category: 'food' });
  const { addExpense } = useCurrency();

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (newExpense.label && newExpense.amount) {
      addExpense({
        ...newExpense,
        amount: Number(newExpense.amount),
        color: '#6366f1' // Default color for new items in this mock
      });
      setNewExpense({ label: '', amount: '', category: 'food' });
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 page-transition">
      <div className="container-custom mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-heading text-white mb-2">Budget Tracker</h1>
          <p className="text-dark-400">Keep track of your expenses across all currencies</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Summary Cards */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card !p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2" />
              
              <h3 className="text-white font-medium mb-4">Budget Overview</h3>
              <div className="flex flex-col sm:flex-row gap-6 mb-6">
                <div className="flex-1 bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
                  <p className="text-dark-400 text-xs mb-1">Total Budget</p>
                  <p className="text-2xl font-bold text-white">{baseCurrency} {budget.toLocaleString()}</p>
                </div>
                <div className="flex-1 bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
                  <p className="text-dark-400 text-xs mb-1">Total Spent</p>
                  <p className="text-2xl font-bold text-primary-400">{baseCurrency} {totalSpent.toLocaleString()}</p>
                </div>
                <div className="flex-1 bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
                  <p className="text-dark-400 text-xs mb-1">Remaining</p>
                  <p className={`text-2xl font-bold ${remaining < 0 ? 'text-error-500' : 'text-success-500'}`}>
                    {baseCurrency} {remaining.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-dark-400">{percentSpent.toFixed(1)}% spent</span>
                </div>
                <div className="h-3 w-full bg-dark-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentSpent}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${percentSpent > 90 ? 'bg-error-500' : percentSpent > 75 ? 'bg-warning-500' : 'bg-primary-500'}`}
                  />
                </div>
              </div>
            </div>

            {/* Expenses List */}
            <div className="glass-card !p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-medium">Recent Expenses</h3>
              </div>
              <div className="space-y-3">
                {expenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-3 bg-white/[0.02] rounded-xl border border-white/[0.04]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${expense.color}20` }}>
                        <DollarSign className="w-5 h-5" style={{ color: expense.color }} />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{expense.label}</p>
                        <p className="text-dark-500 text-xs capitalize">{expense.category}</p>
                      </div>
                    </div>
                    <p className="text-white font-medium">{baseCurrency} {expense.amount.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
             {/* Chart */}
            <div className="glass-card !p-6">
              <h3 className="text-white font-medium mb-4">Expense Breakdown</h3>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenses}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="amount"
                      nameKey="label"
                    >
                      {expenses.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Add Expense Form */}
            <div className="glass-card !p-6">
              <h3 className="text-white font-medium mb-4">Add Expense</h3>
              <form onSubmit={handleAddExpense} className="space-y-4">
                <div>
                  <label className="text-xs text-dark-400 mb-1 block">Description</label>
                  <input
                    type="text"
                    value={newExpense.label}
                    onChange={(e) => setNewExpense({...newExpense, label: e.target.value})}
                    className="input-field !py-2 !text-sm"
                    placeholder="E.g. Dinner at local cafe"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-dark-400 mb-1 block">Amount</label>
                    <input
                      type="number"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                      className="input-field !py-2 !text-sm"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-dark-400 mb-1 block">Category</label>
                    <select
                      value={newExpense.category}
                      onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                      className="input-field !py-2 !text-sm"
                    >
                      <option value="food">Food</option>
                      <option value="transport">Transport</option>
                      <option value="hotels">Hotels</option>
                      <option value="activities">Activities</option>
                      <option value="shopping">Shopping</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn-primary w-full justify-center !py-2.5 !text-sm">
                  <Plus className="w-4 h-4" /> Add Expense
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
