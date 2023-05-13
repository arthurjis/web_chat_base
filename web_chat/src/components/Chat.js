import React, { useState, useEffect, useContext, useRef } from 'react';
import Message from './Message';
import Input from './Input';
import './Chat.css';
import SocketContext from '../contexts/SocketContext';

function Chat() {
  const socket = useContext(SocketContext);
  const [messages, setMessages] = useState([]);
  const messagesRef = useRef(null);

 useEffect(() => {
   // Listen for new messages from the server
   socket.on('newMessage', (message) => {
     setMessages((prevMessages) => [...prevMessages, message]);
   });

   return () => {
     // Clean up the listener when the component is unmounted
     socket.off('newMessage');
   };
 }, [socket]);

 useEffect(() => {
  if (messagesRef.current) {
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

 function handleSendMessage(messageText) {
  // Add the user's message to the chat
  const userMessage = {
    content: messageText,
    sender_id: 'You',
    role: 'user',
  };
  setMessages((prevMessages) => [...prevMessages, userMessage]);

  // Emit the user's message to the server
  socket.emit('message', messageText);
}

 return (
   <div className="chat">
     <div className="chat-messages" ref={messagesRef}>
       {messages.map((message, index) => (
         <Message key={index} message={message.content} isLocal={message.role === 'user'} />
       ))}
     </div>
     <Input className="chat-input" onSendMessage={handleSendMessage} />
   </div>
 );
}

export default Chat;
