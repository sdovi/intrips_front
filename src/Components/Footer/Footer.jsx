import React, { useState } from 'react';
import './style.css';

export default function Footer() {
  const [language, setLanguage] = useState(localStorage.getItem("siteLanguage") || "ru");

  const translations = {
    ru: {
      notFound: "Не нашли то, что искали?",
      contactUs: "Напишите нам",
    },
    en: {
      notFound: "Couldn't find what you're looking for?",
      contactUs: "Contact us",
    },
  };

  const t = translations[language];


  return (
    <div className="footer">
      <div className="footer-text">
        <span role="img" aria-label="search">🔍</span>
        <span>{t.notFound}</span>
      </div>
      <button className="footer-button">{t.contactUs}</button>

    
    </div>
  );
}
