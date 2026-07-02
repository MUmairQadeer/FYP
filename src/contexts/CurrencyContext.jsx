import React, { createContext, useContext, useState, useEffect } from 'react';
import { CURRENCIES } from '../utils/constants';

const CurrencyContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL || '/api';

export function CurrencyProvider({ children }) {
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('EUR');
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(3000);
  const [rates, setRates] = useState({ EUR: 0.92, GBP: 0.79, PKR: 278.5, JPY: 156.4 }); // fallback defaults

  // Fetch real exchange rates from backend
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch(`${API_URL}/tools/currencies`);
        if (res.ok) {
          const data = await res.json();
          if (data.rates) {
            setRates(data.rates);
          }
        }
      } catch (err) {
        console.error('Failed to fetch exchange rates, using defaults:', err);
      }
    };
    fetchRates();
  }, []);

  // Use real rates for conversion (relative to USD base)
  const getRate = (from, to) => {
    if (from === to) return 1;
    
    // Convert from → USD → to
    const fromToUSD = from === 'USD' ? 1 : (rates[from] ? 1 / rates[from] : 1);
    const usdToTarget = to === 'USD' ? 1 : (rates[to] || 1);
    return fromToUSD * usdToTarget;
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
      expenses, addExpense, setExpenses,
      budget, setBudget,
      totalSpent,
      convertAmount,
      getRate,
      rates
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
