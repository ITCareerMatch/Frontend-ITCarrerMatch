import React, { useState, useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiX, FiVolume2, FiVolumeX, FiChevronDown } from 'react-icons/fi';
import { BsFillChatDotsFill } from 'react-icons/bs';
import { chatWithBot, textToSpeech, fetchAvailableVoices } from '../../services/api';

// Initial greeting from bot
const INITIAL_BOT_MESSAGE = {
  role: 'assistant',
  content: 'Halo! Saya JobBot, asisten karir dan pasar kerja di industri IT. Saya siap membantu Anda memahami tren pasar kerja, skill yang dibutuhkan, tips karir, informasi gaji, dan hal-hal seputar dunia kerja IT. Apa yang ingin Anda tahu hari ini?'
};

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('diana');
  const [showVoiceSelector, setShowVoiceSelector] = useState(false);

  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);
  const inputRef = useRef(null);

  // Fetch available voices on mount
  useEffect(() => {
    const loadVoices = async () => {
      try {
        const voices = await fetchAvailableVoices();
        setAvailableVoices(voices);
      } catch (error) {
        console.error('Failed to load voices:', error);
      }
    };
    loadVoices();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Stop audio when closing chat
  useEffect(() => {
    if (!isOpen && audioRef.current) {
      audioRef.current.pause();
      setIsSpeaking(false);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    const trimmedText = inputText.trim();
    if (!trimmedText || isLoading) return;

    const token = localStorage.getItem('access_token');
    const userMessage = { role: 'user', content: trimmedText };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Build history for API (exclude initial bot message that was just a display)
      const history = messages
        .filter(m => m !== INITIAL_BOT_MESSAGE)
        .map(({ role, content }) => ({ role, content }));
      history.push({ role: 'user', content: trimmedText });

      const response = await chatWithBot(token, trimmedText, history);

      if (response?.reply) {
        const botMessage = { role: 'assistant', content: response.reply };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Maaf, saya sedang mengalami gangguan. Silakan coba lagi dalam beberapa saat.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTextToSpeech = async (text) => {
    if (isSpeaking) {
      // Stop speaking
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);

    try {
      const token = localStorage.getItem('access_token');
      const blob = await textToSpeech(token, text, selectedVoice);

      const url = URL.createObjectURL(blob);
      audioRef.current = new Audio(url);

      audioRef.current.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(url);
      };

      audioRef.current.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(url);
      };

      await audioRef.current.play();
    } catch (error) {
      console.error('TTS error:', error);
      setIsSpeaking(false);
    }
  };

  const toggleChat = () => {
    if (!isOpen && messages.length === 0) {
      // Add initial bot message when opening for the first time
      setMessages([INITIAL_BOT_MESSAGE]);
    }
    setIsOpen(!isOpen);
  };

  const getVoiceName = (voiceId) => {
    const voice = availableVoices.find(v => v.id === voiceId);
    return voice?.name || voiceId;
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center shadow-2xl z-[100] cursor-pointer transition-all duration-300 ${
          isOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100 hover:scale-105'
        }`}
        style={{ zIndex: 100 }}
        whileTap={{ scale: 0.95 }}
      >
        <BsFillChatDotsFill size={22} className={isOpen ? '' : 'animate-pulse'} />
      </motion.button>

      {/* Chat Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-6 w-[360px] max-h-[520px] bg-white rounded-3xl shadow-2xl z-[99] flex flex-col overflow-hidden border border-slate-200/60"
            style={{
              maxHeight: 'calc(100vh - 140px)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                  <BsFillChatDotsFill size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">JobBot Assistant</h3>
                  <p className="text-[10px] text-white/70 font-medium">Agen Karir AI</p>
                </div>
              </div>
              <button
                onClick={toggleChat}
                className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
              >
                <FiX size={16} />
              </button>
            </div>

            {/* Messages Container */}
            <div
              className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-thin"
              style={{ maxHeight: 'calc(520px - 130px)' }}
            >
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex flex-col gap-1.5 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    {/* Avatar + Name for bot */}
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                          <BsFillChatDotsFill size={10} className="text-white" />
                        </div>
                        <span className="text-[10px] text-slate-500 font-semibold">JobBot</span>
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div className={`relative px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-br-md'
                        : 'bg-slate-100 text-slate-700 rounded-bl-md'
                    }`}>
                      <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                    </div>

                    {/* TTS Button for bot messages */}
                    {msg.role === 'assistant' && (
                      <button
                        onClick={() => handleTextToSpeech(msg.content)}
                        className={`flex items-center gap-1 text-[10px] font-semibold transition-colors cursor-pointer ${
                          isSpeaking ? 'text-blue-600' : 'text-slate-400 hover:text-blue-500'
                        }`}
                      >
                        {isSpeaking ? <FiVolumeX size={12} /> : <FiVolume2 size={12} />}
                        {isSpeaking ? 'Stop' : 'Dengarkan'}
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">JobBot sedang mengetik...</span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Voice Selector */}
            {showVoiceSelector && availableVoices.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-5 py-3 bg-slate-50 border-t border-slate-100"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Suara:</span>
                  {availableVoices.map(voice => (
                    <button
                      key={voice.id}
                      onClick={() => {
                        setSelectedVoice(voice.id);
                        setShowVoiceSelector(false);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                        selectedVoice === voice.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      {voice.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Input Area */}
            <div className="px-5 py-4 bg-white border-t border-slate-100">
              {/* Voice selector toggle */}
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => setShowVoiceSelector(!showVoiceSelector)}
                  className="flex items-center gap-1.5 text-[10px] text-slate-400 hover:text-blue-500 font-semibold transition-colors cursor-pointer"
                >
                  <FiVolume2 size={12} />
                  {getVoiceName(selectedVoice)}
                  <FiChevronDown size={10} className={`transition-transform ${showVoiceSelector ? 'rotate-180' : ''}`} />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tanyakan sesuatu..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 bg-slate-100 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white transition-all disabled:opacity-50"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isLoading}
                  className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <FiSend size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop for mobile to close chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleChat}
            className="fixed inset-0 z-[98] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Custom scrollbar styles */}
      <style>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </>
  );
}
