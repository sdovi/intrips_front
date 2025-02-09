import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

export default function SectionMenu() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [siteLanguage, setSiteLanguage] = useState(localStorage.getItem("siteLanguage") || "ru");
  const navigate = useNavigate();

  useEffect(() => {
    // Получение категорий
    fetch("https://intrips.site/api/categories/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Ошибка загрузки категорий");
        }
        return response.json();
      })
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Ошибка:", error);
        setError(error.message);
        setLoading(false);
      });

    // Получение подкатегорий
    fetch("https://intrips.site/api/subcategories/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Ошибка загрузки подкатегорий");
        }
        return response.json();
      })
      .then((data) => {
        setSubcategories(data);
      })
      .catch((error) => {
        console.error("Ошибка:", error);
      });

    // Слушаем изменения в localStorage
    const handleStorageChange = () => {
      setSiteLanguage(localStorage.getItem("siteLanguage") || "ru");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const goToCategory = (id) => {
    navigate(`/category/`);
  };

  if (loading) {
    return <p>Загрузка категорий...</p>;
  }

  if (error) {
    return <p>Ошибка: {error}</p>;
  }

  return (
    <div className="secton1">
      <div className="container sect1_container">
        {subcategories.length > 0 && (
          <p className="sect1__p1">
            {siteLanguage === "en" ? subcategories[0].name_en : subcategories[0].name}
          </p>
        )}
        <div className="sect1__cards mt-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="sect1__card"
              onClick={() => goToCategory(category.id)}
              style={{
                background: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.7)), url(${category.photo_url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <h6>{siteLanguage === "en" ? category.name_en : category.name}</h6>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
