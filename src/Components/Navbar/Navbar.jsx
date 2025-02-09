import React, { useState, useEffect } from "react";
import img from "./img/1.jpg";
import "./style.css";
import Flag from "react-world-flags";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  IconButton,
  InputBase,
  Box,
  CircularProgress,
  Typography,
  Container,
} from "@mui/material";
import { Language as GlobeIcon } from "@mui/icons-material";
import { Stack, Button, Modal } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
;
export default function Navbar() {
  const [isSearchOpen, setSearchOpen] = useState(false); // Открытие/закрытие поиска
  const [searchQuery, setSearchQuery] = useState(""); // Поисковый запрос
  const [filteredResults, setFilteredResults] = useState([]); // Результаты поиска
  const [isLoading, setIsLoading] = useState(false); // Индикатор загрузки

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [headerText, setHeaderText] = useState("Загрузка...");
  const [language, setLanguage] = useState(() => {
    // Считываем язык из localStorage или используем "ru" по умолчанию
    return localStorage.getItem("siteLanguage") || "ru";
  });

  const [imgUrl, setImgUrl] = useState(""); // Состояние для URL изображения

  useEffect(() => {
    // Загружаем данные с сервера
    axios
      .get("https://intrips.site/api/header-text/")
      .then((response) => {
        const data = response.data[0];
        if (data) {
          // Устанавливаем текст на основе выбранного языка
          setHeaderText(language === "ru" ? data.name : data.name_en);
          // Устанавливаем URL изображения
          setImgUrl(data.photo);
        } else {
          setHeaderText("Данные отсутствуют");
        }
      })
      .catch(() => setHeaderText("Ошибка загрузки"));
  }, [language]); // Обновляем текст и изображение при смене языка

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("siteLanguage", lang); // Сохраняем язык в localStorage

    window.location.reload();
  };
  const navigate = useNavigate();

  // Открытие поискового меню
  const openSearchMenu = () => {
    setSearchOpen(true);
    setSearchQuery("");
    setFilteredResults([]);
  };

  // Закрытие поискового меню
  const closeSearchMenu = () => {
    setSearchOpen(false);
  };

  // Обновление поискового запроса
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim()) {
      setIsLoading(true);
      axios
        .get("https://intrips.site/api/menu-items/")
        .then((response) => {
          const filteredItems = response.data.filter((item) =>
            item.name.toLowerCase().includes(query)
          );
          setFilteredResults(filteredItems);
        })
        .catch((error) => console.error("Ошибка при поиске:", error))
        .finally(() => setIsLoading(false));
    } else {
      setFilteredResults([]);
    }
  };

  return (
    <div>
      <nav>
        <div
          className="nav_img"
          style={{
            background: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.7)), url(${imgUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center center", // Центр по горизонтали и вертикали
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="container navbar_block-top">
            <Link to={"/cart"}>
              <div className="nav__logo-profile">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="38"
                  height="38"
                  viewBox="0 0 32 32"
                  className="nav__logo-main"
                >
                  <g
                    fill="none"
                    fillRule="evenodd"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="16" cy="16" r="11"></circle>
                    <circle cx="16" cy="14" r="4"></circle>
                    <path d="M23.357 24.034a7.503 7.503 0 00-14.714.001"></path>
                  </g>
                </svg>
              </div>
            </Link>
            <>
     
       {/* Глобус-иконка */}
       <IconButton
        onClick={handleOpen}
        sx={{
          color: "#fff", // Белый цвет
          "&:hover": { color: "primary.light" },
        }}
      >
        <GlobeIcon fontSize="large" />
      </IconButton>

      {/* Модальное окно */}
      <Modal open={open} onClose={handleClose} aria-labelledby="language-modal">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 320,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h2 id="language-modal" style={{ marginBottom: "16px", textAlign: "center" }}>
            Выберите язык
          </h2>
          <Stack direction="row" spacing={2}>
            {/* Кнопка Русский */}
            <Button
              variant={language === "ru" ? "contained" : "outlined"}
              onClick={() => {
                changeLanguage("ru");
                handleClose();
              }}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: language === "ru" ? "#fff" : "#000",
                bgcolor: language === "ru" ? "primary.main" : "#fff",
                borderColor: language === "ru" ? "primary.main" : "#000",
                "&:hover": {
                  bgcolor: language === "ru" ? "primary.dark" : "#f5f5f5",
                },
              }}
            >
              <Flag code="RU" style={{ width: "24px", height: "16px", marginBottom: "4px" }} />
              Русский
            </Button>

            {/* Кнопка English */}
            <Button
              variant={language === "en" ? "contained" : "outlined"}
              onClick={() => {
                changeLanguage("en");
                handleClose();
              }}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: language === "en" ? "#fff" : "#000",
                bgcolor: language === "en" ? "primary.main" : "#fff",
                borderColor: language === "en" ? "primary.main" : "#000",
                "&:hover": {
                  bgcolor: language === "en" ? "primary.dark" : "#f5f5f5",
                },
              }}
            >
              <Flag code="US" style={{ width: "24px", height: "16px", marginBottom: "4px" }} />
              English
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>

            {/* <div className="nav__logo_message">
              <div className="nav__logo-message-main">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                >
                  <g
                    fill="none"
                    fillRule="evenodd"
                    strokeLinecap="round"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      d="M9 8h14a4 4 0 014 4v7.48a4 4 0 01-4 4h-7.18a4 4 0 00-2.33.75l-3.24 2.33a1 1 0 01-1.58-.8v-2.28h0A3.67 3.67 0 015 19.81V12a4 4 0 014-4z"
                      strokeLinejoin="round"
                    ></path>
                    <path d="M9.4 12.93h13.2M9.4 17.15h7.33"></path>
                  </g>
                </svg>
              </div>
            </div> */}
          </div>

          <div className="nav__bottom-txt">
            <h4>{headerText}</h4>
            <IconButton
              color="inherit"
              aria-label="search"
              onClick={openSearchMenu}
              sx={{ transform: "scale(1.5)" }} // Увеличение лупы
            >
              <SearchIcon />
            </IconButton>
          </div>
        </div>
      </nav>

      {/* Search Menu */}
      {isSearchOpen && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            zIndex: 1200,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "20px",
            color: "white",
          }}
        >
          <IconButton
            color="inherit"
            onClick={closeSearchMenu}
            sx={{ position: "absolute", top: "10px", right: "10px" }}
          >
            <CloseIcon />
          </IconButton>
          <InputBase
            autoFocus
            placeholder="Введите название товара"
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{
              backgroundColor: "white",
              color: "black",
              borderRadius: "8px",
              width: "80%",
              maxWidth: "500px",
              padding: "8px 16px",
              marginBottom: "16px",
            }}
          />
          {isLoading ? (
            <CircularProgress color="inherit" />
          ) : (
            <Container>
              {filteredResults.length > 0 ? (
                filteredResults.map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      backgroundColor: "white",
                      color: "black",
                      padding: "8px",
                      borderRadius: "8px",
                      marginBottom: "8px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      closeSearchMenu();
                      navigate(`/category/${item.id}`);
                    }}
                  >
                    <Typography variant="h6">{item.name}</Typography>
                    <Typography variant="body2">{item.price} ₽</Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="h6" align="center">
                  Ничего не найдено
                </Typography>
              )}
            </Container>
          )}
        </Box>
      )}
    </div>
  );
}
