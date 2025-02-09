import React, { useState } from "react";
import { useCart } from "react-use-cart";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function CartPage() {
  const { isEmpty, items, removeItem, cartTotal } = useCart();
  const navigate = useNavigate();
  const [language, setLanguage] = useState(
    localStorage.getItem("siteLanguage") || "ru"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderData, setOrderData] = useState({
    date: "",
    time: "",
    roomNumber: "",
    comments: "",
  });

  const translations = {
    ru: {
      myOrders: "Мои заказы",
      noOrders: "Нет заказов",
      firstOrder: "Сделать первый заказ",
      totalAmount: "Общая сумма",
      placeOrder: "Оформить заказ",
      remove: "Удалить",
      orderDetails: "Детали заказа",
      send: "Отправить",
      cancel: "Отмена",
    },
    en: {
      myOrders: "My Orders",
      noOrders: "No orders",
      firstOrder: "Place your first order",
      totalAmount: "Total amount",
      placeOrder: "Place order",
      remove: "Remove",
      orderDetails: "Order details",
      send: "Send",
      cancel: "Cancel",
    },
  };

  const t = translations[language];

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prev) => ({ ...prev, [name]: value }));
  };

  const sendOrder = async () => {
    const orderDetails = {
      items: items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total_price: cartTotal,
      date: orderData.date,
      time: orderData.time,
      room_number: orderData.roomNumber,
      comments: orderData.comments,
    };

    try {
      // 🔹 1. Отправляем заказ в Django-бэкенд
      const response = await fetch("https://intrips.site/orders/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderDetails),
      });

      if (!response.ok) {
        alert("Ошибка при отправке заказа на сервер ❌");
        return;
      }

      // 🔹 2. Отправляем заказ в Telegram
      const botToken = "7222921497:AAHdC-9gxrjaTHlItXjkZafA_7ldGVuPwTE";
      const chatId = "-4626568232";
      const telegramMessage = `
  📦 Новый заказ:
  
  ${orderDetails.items
    .map(
      (item) =>
        `🛒 ${item.name} (x${item.quantity}) - ${item.price * item.quantity} ₽`
    )
    .join("\n")}
  
  💰 Общая сумма: ${orderDetails.total_price} ₽
  
  📅 Дата: ${orderDetails.date}
  ⏰ Время: ${orderDetails.time}
  🏨 Номер комнаты: ${orderDetails.room_number}
  💬 Комментарий: ${orderDetails.comments}
      `;

      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: telegramMessage }),
      });

      alert("Заказ успешно отправлен в систему и Telegram! ✅");
      handleCloseModal();
      items.forEach((item) => removeItem(item.id)); // Очищаем корзину
    } catch (error) {
      console.error("Ошибка:", error);
      alert("Ошибка сети. Попробуйте еще раз.");
    }
  };

  // бекенд отправка

  const sendOrderToBackend = async () => {
    const orderDetails = {
      items: items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total_price: cartTotal,
      date: orderData.date,
      time: orderData.time,
      room_number: orderData.roomNumber,
      comments: orderData.comments,
    };

    try {
      const response = await fetch("https://intrips.site/orders/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderDetails),
      });

      if (response.ok) {
        alert("Заказ успешно отправлен! ✅");
        handleCloseModal();
        // Дополнительно: очищаем корзину после заказа
        items.forEach((item) => removeItem(item.id));
      } else {
        alert("Ошибка при отправке заказа ❌");
      }
    } catch (error) {
      console.error("Ошибка:", error);
      alert("Ошибка сети. Попробуйте еще раз.");
    }
  };

  return (
    <>
      <Container maxWidth="sm" style={{ padding: "0" }}>
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => navigate(-1)}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography
              variant="h6"
              style={{ flexGrow: 1, textAlign: "center" }}
            >
              {t.myOrders}
            </Typography>
          </Toolbar>
        </AppBar>

        <Box style={{ padding: "16px", textAlign: "center" }}>
          {isEmpty ? (
            <>
              <Typography
                variant="h5"
                style={{ marginBottom: "16px", fontWeight: "bold" }}
              >
                {t.noOrders}
              </Typography>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "black",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "30px",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
                onClick={() => navigate("/")}
              >
                {t.firstOrder}
              </Button>
            </>
          ) : (
            <>
              <List>
                {items.map((item) => (
                  <ListItem
                    key={item.id}
                    style={{
                      marginBottom: "10px",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    <ListItemText
                      primary={`${item.name} (x${item.quantity})`}
                      secondary={`${item.price * item.quantity} ₽`}
                    />
                    <ListItemSecondaryAction>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => removeItem(item.id)}
                      >
                        {t.remove}
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
              <Box style={{ marginTop: "20px", textAlign: "center" }}>
                <Typography
                  variant="h6"
                  style={{ fontWeight: "bold", marginBottom: "16px" }}
                >
                  {t.totalAmount}: {cartTotal} ₽
                </Typography>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "black",
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: "30px",
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                  onClick={handleOpenModal}
                >
                  {t.placeOrder}
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Container>

      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>{t.orderDetails}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Дата"
            name="date"
            type="date"
            InputLabelProps={{ shrink: true }}
            onChange={handleInputChange}
            style={{ marginBottom: "16px" }}
          />
          <TextField
            fullWidth
            label="Время"
            name="time"
            type="time"
            InputLabelProps={{ shrink: true }}
            onChange={handleInputChange}
            style={{ marginBottom: "16px" }}
          />
          <TextField
            fullWidth
            label="Номер комнаты"
            name="roomNumber"
            onChange={handleInputChange}
            style={{ marginBottom: "16px" }}
          />
          <TextField
            fullWidth
            label="Комментарии"
            name="comments"
            multiline
            rows={4}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            {t.cancel}
          </Button>
          <Button onClick={sendOrder} variant="contained" color="primary">
            {t.send}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
