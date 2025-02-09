import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Box,
  IconButton,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Collapse,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import { motion } from "framer-motion";

const ClientChat = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [userId] = useState(
    () => localStorage.getItem("user_id") || Date.now().toString()
  );
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null); // Реф для авто-прокрутки

  useEffect(() => {
    localStorage.setItem("user_id", userId);

    // Изначально загружаем сообщения
    fetchMessages();

    // Периодическое обновление сообщений каждые 30 секунд
    const interval = setInterval(fetchMessages, 30000);

    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    // Авто-прокрутка при обновлении сообщений
    scrollToBottom();
  }, [messages]);

  // Функция прокрутки вниз
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Функция получения сообщений с сервера
  const fetchMessages = async () => {
    try {
      const response = await axios.get("https://intrips.site/chat/messages/", {
        params: { user_id: userId },
      });
      setMessages(response.data);
      setError(null); // Сбрасываем ошибки при успешной загрузке
    } catch (err) {
      setError("Ошибка загрузки сообщений");
      console.error("Error fetching messages:", err);
    }
  };

  // Функция отправки сообщения
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await axios.post(
        "https://intrips.site/chat/messages/",
        {
          user_id: userId,
          message: newMessage,
          is_admin: false, // Отмечаем, что сообщение отправлено пользователем
        }
      );

      setMessages((prevMessages) => [...prevMessages, response.data]);
      setNewMessage("");
      setError(null);
    } catch (err) {
      setError("Ошибка отправки сообщения");
      console.error("Error sending message:", err);
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 16,
        right: 16,
        width: "100%",
        maxWidth: 400,
      }}
    >
      {/* Кнопка открытия/закрытия чата */}
      <IconButton
        onClick={() => setIsChatOpen(!isChatOpen)}
        sx={{
          backgroundColor: "primary.main",
          color: "white",
          "&:hover": {
            backgroundColor: "primary.dark",
          },
          position: "absolute",
          right: 16,
          bottom: isChatOpen ? "calc(100% + 16px)" : 0,
        }}
      >
        {isChatOpen ? <CloseIcon /> : <ChatIcon />}
      </IconButton>

      {/* Прозрачный фон и окно чата */}
      {isChatOpen && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1200,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={() => setIsChatOpen(false)} // Закрытие при нажатии на фон
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={(e) => e.stopPropagation()} // Остановка всплытия клика
          >
            <Box
              sx={{
                p: 2,
                boxShadow: 2,
                borderRadius: 2,
                backgroundColor: "background.paper",
                display: "flex",
                flexDirection: "column",
                maxHeight: "80vh",
                overflowY: "auto",
                width: "100%",
                maxWidth: 400,
              }}
            >
              <Typography
                variant="h6"
                sx={{ textAlign: "center", mb: 1, fontWeight: "bold" }}
              >
                Чат
              </Typography>

              {/* Ошибка */}
              {error && (
                <Typography
                  variant="body2"
                  color="error"
                  sx={{ textAlign: "center", mb: 1 }}
                >
                  {error}
                </Typography>
              )}

              {/* Список сообщений */}
              <List sx={{ overflowY: "auto", flexGrow: 1 }}>
                {messages.map((msg, idx) => (
                  <ListItem key={idx}>
                    <ListItemText
                      primary={msg.message}
                      secondary={msg.is_admin ? "Администратор" : "Вы"}
                    />
                  </ListItem>
                ))}
                {/* Реф для авто-прокрутки */}
                <div ref={messagesEndRef} />
              </List>

              {/* Поле ввода сообщения */}
              <Box sx={{ display: "flex", mt: 2 }}>
                <TextField
                  fullWidth
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Введите сообщение"
                  variant="outlined"
                  size="small"
                />
                <Button
                  variant="contained"
                  onClick={sendMessage}
                  sx={{ ml: 1 }}
                >
                  Отправить
                </Button>
              </Box>
            </Box>
          </motion.div>
        </Box>
      )}
    </Box>
  );
};

export default ClientChat;
