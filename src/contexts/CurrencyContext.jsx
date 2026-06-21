import React, { createContext, useContext, useState } from 'react';
import { CURRENCIES, MOCK_EXPENSES } from '../utils/constants';

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('EUR');
  const [expenses, setExpenses] = useState(MOCK_EXPENSES);
  const [budget, setBudget] = useState(3000);

  // Mock conversion rate
  const getRate = (from, to) => {
    if (from === to) return 1;
    if (from === 'USD' && to === 'EUR') return 0.92;
    if (from === 'EUR' && to === 'USD') return 1.09;
    return 1; // Default mock rate
  };

  const convertAmount = (amount, from, to) => {
    return amount * getRate(from, to);
  };

  const addExpense = (expense) => {
    setExpenses([...expenses, { ...expense, id: Date.now().toString() }]);
  };

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <CurrencyContext.Provider value={{
      baseCurrency, setBaseCurrency,
      targetCurrency, setTargetCurrency,
      expenses, addExpense,
      budget, setBudget,
      totalSpent,
      convertAmount,
      getRate
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}
