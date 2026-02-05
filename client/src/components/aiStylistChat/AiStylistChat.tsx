import { useState, useEffect, useRef } from 'react';
import { $api } from '../../api/interceptors';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import { Close, AutoAwesome, SmartToy, Send } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'ai' | 'user';
  text: string;
}

const AiStylistChat = ({
  productId,
  lang,
  productTitle,
}: {
  productId: string;
  lang: string;
  productTitle: string;
}) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const startChat = () => {
    setOpen(true);
    if (messages.length === 0) {
      handleSendMessage();
    }
  };

  const handleSendMessage = async (text?: string) => {
    const newUserMessage: Message = {
      role: 'user',
      text: text || `How to style ${productTitle}?`,
    };
    const updatedMessages = [...messages, newUserMessage];

    if (text) {
      setMessages(updatedMessages);
      setUserInput('');
    }

    setLoading(true);
    try {
      const res = await $api.post(`/ai/stylist`, {
        id: productId,
        lang,
        history: updatedMessages,
      });

      const aiMsg: Message = { role: 'ai', text: res.data.text };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: lang === 'ru' ? 'Ошибка связи.' : 'Connection error.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={startChat}
        className="w-fit h-fit flex items-center gap-2 border-2 border-teal-600 px-3 py-1 font-medium hover:bg-teal-50 
        transition tracking-widest text-xs cursor-pointer"
      >
        <AutoAwesome className="text-teal-600" fontSize="small" />
        {lang === 'ru' ? 'ИИ стилист' : 'AI Stylist'}
      </button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: '20px', height: '70vh' } }}
      >
        <DialogTitle className="flex justify-between items-center border-b">
          <div className="flex items-center gap-2">
            <SmartToy className="text-teal-600" />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 300,
                textTransform: 'uppercase',
              }}
            >
              {lang === 'ru' ? 'ИИ стилист' : 'AI stylist'}
            </Typography>
          </div>
          <IconButton onClick={() => setOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent className="flex flex-col bg-gray-50 p-0">
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto space-y-4 p-4 pr-3 pt-3"
          >
            {/* Первое "автоматическое" облако пользователя */}
            <div className="flex justify-end chat-message">
              <div className="bg-teal-600 text-white p-3 rounded-2xl rounded-tr-none max-w-[85%] shadow-sm">
                <Typography variant="body2">
                  {lang === 'ru'
                    ? `Привет! Расскажи, с чем мне носить ${productTitle}?`
                    : `Hi! Can you tell me how to style ${productTitle}?`}
                </Typography>
              </div>
            </div>

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex chat-message ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`p-3 rounded-2xl shadow-sm max-w-[85%] ${
                    msg.role === 'ai'
                      ? 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                      : 'bg-teal-600 text-white rounded-tr-none'
                  }`}
                >
                  {/* <Typography variant="body2">{msg.text}</Typography> */}
                  {msg.role === 'ai' ? (
                    // Для ИИ используем Markdown
                    <div className="text-sm max-w-prose text-gray-800">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  ) : (
                    // Для пользователя оставляем обычный текст
                    <Typography variant="body2">{msg.text}</Typography>
                  )}
                </div>
              </div>
            ))}

            {/* Заменяем блок с CircularProgress на этот */}
            {loading && (
              <div className="flex justify-start chat-message">
                <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 flex gap-1 items-center">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            )}
          </div>

          {/* Поле ввода сообщения */}
          <Box className="p-4 bg-white border-t flex gap-2 items-center">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === 'Enter' && handleSendMessage(userInput)
              }
              placeholder={
                lang === 'ru' ? 'Задать вопрос...' : 'Ask a question...'
              }
              className="flex-1 outline-none text-sm p-2 bg-gray-50 rounded-lg border focus:border-teal-600 transition"
            />
            <IconButton
              onClick={() => handleSendMessage(userInput)}
              disabled={loading || !userInput.trim()}
              sx={{ color: '#0d9488' }}
            >
              <Send fontSize="small" />
            </IconButton>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AiStylistChat;
