'use client';

import { useEffect, useState } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { useLanguage } from './context/LanguageContext';

export default function Providers({ children }) {
  let language;
  try {
    language = useLanguage();
  } catch {
    return null; // 🔒 If LanguageProvider is missing
  }

  const { locale } = language;
  const [messages, setMessages] = useState(null);

  useEffect(() => {
    if (!locale) return;

    import(`./messages/${locale}.json`)
      .then((mod) => setMessages(mod.default))
      .catch((err) => {
        console.error('Failed to load messages:', err);
        setMessages({});
      });
  }, [locale]);

  if (!messages) return null;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
