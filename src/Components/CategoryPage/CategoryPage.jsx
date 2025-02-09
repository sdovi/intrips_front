import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from 'react-use-cart';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Button,
  Box,
  IconButton as MUIButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Footer from '../Footer/Footer';

export default function CategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const siteLanguage = localStorage.getItem('siteLanguage') || 'ru'; // Получаем текущий язык

  useEffect(() => {
    // Получение информации о товаре по ID
    axios
      .get(`https://intrips.site/api/menu-items/`)
      .then((response) => {
        const foundItem = response.data.find((menuItem) => menuItem.id === parseInt(id));
        if (foundItem) {
          // Подставляем язык
          setItem({
            ...foundItem,
            name: siteLanguage === 'en' ? foundItem.name_en : foundItem.name,
            description: siteLanguage === 'en' ? foundItem.description_en : foundItem.description,
          });
        }
      })
      .catch((error) => console.error('Error fetching item:', error));
  }, [id, siteLanguage]);

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    if (item) {
      addItem(
        {
          id: item.id,
          name: item.name,
          price: parseFloat(item.price),
          image: item.photo,
        },
        quantity
      );
      alert(
        `${siteLanguage === 'en' ? 'Item' : 'Товар'} "${item.name}" ${
          siteLanguage === 'en' ? 'added to the cart' : 'добавлен в корзину'
        } (${quantity}x)!`
      );
    }
  };

  if (!item) {
    return (
      <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '20px' }}>
        <Typography variant="h6">
          {siteLanguage === 'en' ? 'Loading...' : 'Загрузка...'}
        </Typography>
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="sm" style={{ padding: '0', backgroundColor: '#f9f9f9' }}>
        {/* Заголовок */}
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => navigate(-1)}>
              <ArrowBackIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Информация о товаре */}
        <Box style={{ padding: '16px', textAlign: 'center' }}>
          <Typography variant="h4" style={{ marginBottom: '16px', fontWeight: 'bold', fontStyle: 'italic' }}>
            {item.name}
          </Typography>
          <Box
            style={{
              width: '100%',
              height: '200px',
              border: '1px solid black',
              marginBottom: '16px',
            }}
          >
            <img
              src={item.photo}
              alt={item.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>
          <Typography variant="body1" style={{ marginBottom: '16px', color: '#555' }}>
            {item.description}
          </Typography>

          {/* Счетчик количества */}
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            }}
          >
            <MUIButton onClick={decreaseQuantity} style={{ backgroundColor: '#f5f5f5', padding: '10px' }}>
              <RemoveIcon />
            </MUIButton>
            <Typography variant="h6" style={{ margin: '0 16px' }}>
              {quantity}
            </Typography>
            <MUIButton onClick={increaseQuantity} style={{ backgroundColor: '#f5f5f5', padding: '10px' }}>
              <AddIcon />
            </MUIButton>
          </Box>

          {/* Кнопка добавления в корзину */}
          <Button
            variant="contained"
            style={{
              backgroundColor: 'black',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '30px',
              fontWeight: 'bold',
              fontSize: '16px',
            }}
            onClick={handleAddToCart}
          >
            {siteLanguage === 'en' ? 'Add to cart' : 'Добавить'}
            <Typography variant="h6" style={{ marginLeft: '10px' }}>
              {item.price * quantity} ₽
            </Typography>
          </Button>
        </Box>
      </Container>

      <Footer />
    </>
  );
}
