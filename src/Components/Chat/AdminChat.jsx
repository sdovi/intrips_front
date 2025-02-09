import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, List, ListItem, ListItemText, TextField, Button } from '@mui/material';

const AdminChat = () => {
    const [messages, setMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await axios.get('https://intrips.site/chat/messages/');
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedUser) return;
        try {
            const response = await axios.post('https://intrips.site/chat/messages/', {
                user_id: selectedUser,
                message: newMessage,
                is_admin: true,
            });
            setMessages([...messages, response.data]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const userMessages = messages.filter((msg) => msg.user_id === selectedUser);

    return (
        <Box>
            <List>
                {Array.from(new Set(messages.map((msg) => msg.user_id))).map((userId) => (
                    <ListItem button key={userId} onClick={() => setSelectedUser(userId)}>
                        <ListItemText primary={`User: ${userId}`} />
                    </ListItem>
                ))}
            </List>
            {selectedUser && (
                <Box>
                    <List>
                        {userMessages.map((msg, idx) => (
                            <ListItem key={idx}>
                                <ListItemText
                                    primary={msg.message}
                                    secondary={msg.is_admin ? 'Admin' : 'User'}
                                />
                            </ListItem>
                        ))}
                    </List>
                    <TextField
                        fullWidth
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message"
                    />
                    <Button variant="contained" onClick={sendMessage}>
                        Send
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default AdminChat;
