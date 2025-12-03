import React, { useState, useRef, useEffect } from 'react';
import { Send, Eraser } from 'lucide-react';
import { Message } from '../types';
import { ChatMessage } from './ChatMessage';
import { ApiService } from '../services/api';
import { Button } from './Button';

export const FullChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Hello! I am your Ollama-powered AI assistant with long-term memory. How can I help you today?', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await ApiService.sendMessage(messages, input);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: "Error: Could not connect to the backend. Is Ollama running?",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-w-5xl mx-auto bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Header inside chat component (optional if using global nav) */}
      <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center">
        <h2 className="font-semibold text-slate-700 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Connected to Ollama
        </h2>
        <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setMessages([messages[0]])}
            title="Clear conversation"
        >
            <Eraser size={16} />
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/50">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
             <div className="bg-slate-200 text-slate-500 p-3 rounded-2xl rounded-tl-none text-sm animate-pulse">
               Thinking...
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form onSubmit={handleSend} className="relative flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type your message..."
            className="w-full p-3 pr-12 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-14 max-h-32 scrollbar-hide text-sm md:text-base"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            variant="primary" 
            className="absolute right-2 bottom-2 !p-2 rounded-md h-10 w-10"
            disabled={!input.trim() || isLoading}
          >
            <Send size={18} />
          </Button>
        </form>
        <div className="text-center text-xs text-slate-400 mt-2">
          AI can make mistakes. Check important info.
        </div>
      </div>
    </div>
  );
};