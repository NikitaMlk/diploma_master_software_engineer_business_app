'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context for language
const LanguageContext = createContext();

export const useLanguage = () => {
  return useContext(LanguageContext);
};

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState('en'); // Set 'en' as default locale

  useEffect(() => {
    // If there's a saved locale in localStorage, use that
    const savedLocale = localStorage.getItem('locale');
    if (savedLocale) {
      setLocale(savedLocale);
    }
  }, []);

  const changeLanguage = (newLocale) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale: changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
