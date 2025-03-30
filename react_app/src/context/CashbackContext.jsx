import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const CashbackContext = createContext();

export const CashbackProvider = ({ children }) => {
  const [cashback, setCashback] = useState(0);

  // Функція для отримання cashback
  const fetchCashback = useCallback(async () => {
    try {
      const response = await fetch(process.env.REACT_APP_CREATE_CASHBACK_API_URI, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      const data = await response.json();
      console.log('Cashback data:', data);
      setCashback(data);
    } catch (error) {
      console.error('Error fetching cashback:', error);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchCashback();
    }, process.env.REACT_APP_INTERVAL_UPDATE_CASHBACK * 60 * 1000);

    fetchCashback();

    return () => clearInterval(interval);
  }, [fetchCashback]);

  const forceUpdateCashback = () => {
    fetchCashback();
  };

  return (
    <CashbackContext.Provider value={{ cashback, forceUpdateCashback }}>
      {children}
    </CashbackContext.Provider>
  );
};


export const useCashbackContext = () => useContext(CashbackContext);