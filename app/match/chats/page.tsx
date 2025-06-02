'use client';
import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { Navbar } from "@/components/ui/Navbar"

import LoadingSpinner from '@/components/loading-spinner';

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

interface Match {
  email: string;
  username: string;
  prof_pic: string | null;
}

  const links = [
    { href: "/", label: "Pagina de inicio" },
    { href: "/match", label: "Match" },
    { href: "/recomendation", label: "Recomendaciones" },
    { href: "/Psettings", label: "Perfil" },
  ]



const socket = io('http://localhost:3000');

export default function ChatPage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [receiverEmail, setReceiverEmail] = useState('');
  const [senderEmail, setSenderEmail] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme")
    if (storedTheme === "dark") {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark")
    }


    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode<DecodedToken>(token);
      setSenderEmail(decoded.email);

      axios
        .get(`http://localhost:3000/users/${decoded.email}/getMatches`)
        .then(async (res) => {
          const matchesData = res.data.matches;
          setMatches(matchesData);

          if (matchesData.length > 0) {
            let mostRecentMatch = null;
            let latestTimestamp = 0;

            for (const match of matchesData) {
              try {
                const response = await axios.get(
                  `http://localhost:3000/chat/history/${decoded.email}/${match.email}`
                );
                const chatMessages = response.data.messages;
                if (chatMessages.length > 0) {
                  const latestMessage = chatMessages.reduce((latest: Message, msg: Message) =>
                    new Date(msg.timestamp) > new Date(latest.timestamp) ? msg : latest
                  );
                  if (new Date(latestMessage.timestamp).getTime() > latestTimestamp) {
                    latestTimestamp = new Date(latestMessage.timestamp).getTime();
                    mostRecentMatch = match.email;
                  }
                }
              } catch (err) {
                console.error(`Error loading chat history for ${match.email}`, err);
              }
            }

            // Set the most recent match as default, or the first match if no messages
            const defaultMatch = mostRecentMatch || matchesData[0].email;
            setReceiverEmail(defaultMatch);
            setSelectedMatch(defaultMatch);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error loading matches', err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
    setIsReady(true);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    if (newMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

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

  const handleSelectMatch = (email: string) => {
    setReceiverEmail(email);
    setSelectedMatch(email);
  };

  function parseCustomTimestamp(ts: any): Date {
    if (!ts || typeof ts !== "object") return new Date();
    return new Date(
      ts.year?.low ?? 1970,
      (ts.month?.low ?? 1) - 1,
      ts.day?.low ?? 1,
      ts.hour?.low ?? 0,
      ts.minute?.low ?? 0,
      ts.second?.low ?? 0,
      Math.floor((ts.nanosecond?.low ?? 0) / 1e6)
    );
  }
  if (loading) return <LoadingSpinner />;

  if (!isReady) return null;

  return (
    <div className={`transition duration-700 ease-in-out min-h-screen ${isDarkMode ? 'bg-[#01152b]' : 'bg-[#faf6eb]'}`}>
      <Navbar
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        links={links}
      />
    
    <div className="flex min-h-screen">

      <div
        className={`w-80 ${isDarkMode ? 'bg-[#0a223d] border-gray-700' : 'bg-gray-100 border-gray-200'} p-4 border-r ${
          selectedMatch ? 'hidden md:block' : 'block'
        }`}
      >
        <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-gray-100' : ''}`}>Tus Matches</h2>
        {matches.length > 0 ? (
          <ul className="space-y-2">
            {matches.map((match) => (
              <li
                key={match.email}
                className={`p-2 rounded cursor-pointer ${
                  selectedMatch === match.email ? 'bg-[#e6790c] text-white' : 'hover:bg-gray-200'
                }`}
                onClick={() => handleSelectMatch(match.email)}
              >
                <div className="flex items-center space-x-2">
                  {match.prof_pic ? (
                    <img
                      src={match.prof_pic}
                      alt={match.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-300 text-gray-600'}`}>
                      {match.username && match.username.length > 0
                        ? match.username[0].toUpperCase()
                        : '?'}
                    </div>
                  )}
                  <div>
                    <p className={`font-medium ${isDarkMode ? 'text-gray-100' : ''}`}>{match.username}</p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{match.email}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No tienes matches aún.</p>
        )}
      </div>

      <div className="flex-1 p-4 max-w-4xl mx-auto space-y-4">
        <div className={`border h-[calc(100vh-200px)] overflow-y-auto p-3 rounded ${isDarkMode ? 'bg-[#11294a] border-gray-700' : 'bg-gray-50'}`}>
          {messages.length === 0 ? (
            <div className={`text-center mt-10 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>
              Aún no hay mensajes entre ustedes, envia uno e inicia una conversación
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 flex ${
                  msg.senderEmail === senderEmail ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-lg max-w-xs ${
                    msg.senderEmail === senderEmail
                      ? isDarkMode
                        ? 'bg-orange-600 text-white'
                        : 'bg-[#e6790c] text-white'
                      : isDarkMode
                        ? 'bg-gray-700 text-gray-100'
                        : 'bg-gray-300 text-gray-900'
                  }`}
                >
                  <p>{msg.content}</p>
                  <p className={`text-xs text-right mt-1 opacity-70 ${isDarkMode ? 'text-gray-200' : 'text-gray-600'}`}>
                    {parseCustomTimestamp(msg.timestamp).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" })}                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Escribe un mensaje..."
            className={`flex-1 border rounded px-3 py-2 ${isDarkMode ? 'bg-[#11294a] border-gray-700' : 'bg-gray-50'}`}
          />
          <button onClick={sendMessage} className="bg-[#e6790c] text-white px-4 py-2 rounded">
            Enviar
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}