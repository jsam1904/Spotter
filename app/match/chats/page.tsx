'use client';
import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';

interface Message {
  senderEmail: string;
  receiverEmail: string;
  content: string;
  timestamp: string;
}

interface DecodedToken {
  email: string;
  name: string;
  username: string;
}

const socket = io('http://localhost:3000');

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [receiverEmail, setReceiverEmail] = useState('');
  const [senderEmail, setSenderEmail] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode<DecodedToken>(token);
      setSenderEmail(decoded.email);
    }
    setIsReady(true); // habilita renderizado tras montar
  }, []);

  useEffect(() => {
    if (!senderEmail || !receiverEmail) return;

    const room = [senderEmail, receiverEmail].sort().join('_');
    socket.emit('joinRoom', { userEmail1: senderEmail, userEmail2: receiverEmail });

    axios
      .get(`http://localhost:3000/chat/history/${senderEmail}/${receiverEmail}`)
      .then((res) => setMessages(res.data.messages))
      .catch((err) => console.error('Error loading chat history', err));

    socket.on('privateMessage', (message: Message) => {
      if (
        (message.senderEmail === senderEmail && message.receiverEmail === receiverEmail) ||
        (message.senderEmail === receiverEmail && message.receiverEmail === senderEmail)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off('privateMessage');
    };
  }, [senderEmail, receiverEmail]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim() && senderEmail && receiverEmail) {
      socket.emit('privateMessage', {
        senderEmail,
        receiverEmail,
        content: newMessage,
      });
      setNewMessage('');
    }
  };

  if (!isReady) return null; // espera a que haya montado el componente en cliente

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <h2 className="text-xl font-semibold">Chat Privado</h2>

      <input
        type="email"
        placeholder="Email del destinatario"
        value={receiverEmail}
        onChange={(e) => setReceiverEmail(e.target.value)}
        className="w-full border rounded px-3 py-2"
      />

      <div className="border h-96 overflow-y-auto p-3 bg-gray-50 rounded">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 flex ${
              msg.senderEmail === senderEmail ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-xs ${
                msg.senderEmail === senderEmail ? 'bg-[#e6790c] text-white' : 'bg-gray-300'
              }`}
            >
              <p>{msg.content}</p>
              <p className="text-xs text-right mt-1 opacity-70">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Escribe un mensaje..."
          className="flex-1 border rounded px-3 py-2"
        />
        <button onClick={sendMessage} className="bg-[#e6790c] text-white px-4 py-2 rounded">
          Enviar
        </button>
      </div>
    </div>
  );
}
