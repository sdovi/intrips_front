import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Container,
  InputBase,
  Box,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import "./style.css";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer/Footer";

export default function ViewProduct() {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [headerText, setHeaderText] = useState(""); // Текст заголовка
  const [selectedCategory, setSelectedCategory] = useState(0); // 0 for "All"
  const [isSearchOpen, setSearchOpen] = useState(false); // Открытие/закрытие поиска
  const [searchQuery, setSearchQuery] = useState(""); // Поисковый запрос
  const [filteredResults, setFilteredResults] = useState([]); // Результаты поиска
  const [isLoading, setIsLoading] = useState(false); // Индикатор загрузки
  const [siteLanguage, setSiteLanguage] = useState(
    localStorage.getItem("siteLanguage") || "ru"
  ); // Язык сайта
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch categories
    axios
      .get("https://intrips.site/api/categories/")
      .then((response) => {
        const allCategory = {
          id: 0,
          name: "Все",
          name_en: "All",
        };
        setCategories([allCategory, ...response.data]);
      })
      .catch((error) => console.error("Error fetching categories:", error));
  
    // Fetch menu items
    axios
      .get("https://intrips.site/api/menu-items/")
      .then((response) => setMenuItems(response.data))
      .catch((error) => console.error("Error fetching menu items:", error));
  
    // Fetch header text
    axios
      .get("https://intrips.site/api/header-text/")
      .then((response) => {
        const header = response.data[0];
        setHeaderText(siteLanguage === "en" ? header.name_en : header.name);
      })
      .catch((error) => console.error("Error fetching header text:", error));
  }, [siteLanguage]);
  

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };

  const handleCardClick = (itemId) => {
    navigate(`/category/${itemId}`);
  };

  const filteredMenuItems =
    selectedCategory === 0
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  const openSearchMenu = () => {
    setSearchOpen(true);
    setSearchQuery("");
    setFilteredResults([]);
  };

  const closeSearchMenu = () => {
    setSearchOpen(false);
  };

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
    <>
      <Container
        maxWidth="sm"
        style={{ padding: "0", backgroundColor: "#f9f9f9" }}
      >
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="back">
              <ArrowBackIcon onClick={() => navigate(-1)} />
            </IconButton>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              {headerText}
            </Typography>
            <IconButton
              color="inherit"
              aria-label="search"
              onClick={openSearchMenu}
            >
              <SearchIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Tabs
          value={selectedCategory}
          onChange={handleCategoryChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="categories tabs"
          textColor="inherit"
          indicatorColor="primary"
        >
          {categories.map((category) => (
            <Tab
              key={category.id}
              label={siteLanguage === "en" ? category.name_en : category.name}
              value={category.id}
            />
          ))}
        </Tabs>

        <Grid container spacing={2} style={{ padding: "16px" }}>
          {filteredMenuItems.map((item) => (
            <Grid item xs={12} key={item.id}>
              <Card
                style={{ display: "flex", cursor: "pointer" }}
                onClick={() => handleCardClick(item.id)}
              >
                <CardMedia
                  component="img"
                  style={{ width: 100, height: 100 }}
                  image={item.photo}
                  alt={item.name}
                />
                <div className="wiew__block-content">
                  <CardContent style={{ flex: "1", paddingTop: "0px" }}>
                    <Typography variant="h6">
                      {siteLanguage === "en" ? item.name_en : item.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {siteLanguage === "en"
                        ? item.description_en
                        : item.description}
                    </Typography>
                    <Typography
                      variant="h6"
                      style={{ marginTop: "8px", fontWeight: "bold" }}
                    >
                      {item.price} ₽
                    </Typography>
                  </CardContent>
                </div>
              </Card>
            </Grid>
          ))}
        </Grid>

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
              placeholder={
                siteLanguage === "en" ? "Enter product name" : "Введите название товара"
              }
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
                      <Typography variant="h6">
                        {siteLanguage === "en" ? item.name_en : item.name}
                      </Typography>
                      <Typography variant="body2">{item.price} ₽</Typography>
                    </Box>
                  ))
                ) : (
                  <Typography variant="h6" align="center">
                    {siteLanguage === "en"
                      ? "No results found"
                      : "Ничего не найдено"}
                  </Typography>
                )}
              </Container>
            )}
          </Box>
        )}
      </Container>

      <Footer />
    </>
  );
}
