'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/app/(user-dashboard)/context/LanguageContext';

const LanguageSwitcher = () => {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const changeLanguage = (lang) => {
    localStorage.setItem('locale', lang);
    setLocale(lang);
    setOpen(false);
  };

  const languages = [
    { code: 'en', label: 'English', country: 'gb' },
    { code: 'fr', label: 'Français', country: 'fr' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = languages.find((lang) => lang.code === locale);
  const flagUrl = (countryCode) => `https://flagcdn.com/w40/${countryCode}.png`;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        title={current.label}
      >
        <img
          src={flagUrl(current.country)}
          alt={current.label}
          className="w-7 h-5 object-cover rounded-sm"
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-28 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-lg rounded">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                lang.code === locale ? 'font-semibold' : ''
              }`}
            >
              <img
                src={flagUrl(lang.country)}
                alt={lang.label}
                className="w-5 h-4 object-cover rounded-sm"
              />
              {lang.code.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
