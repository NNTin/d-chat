import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react';
import { Message } from '../types';
import { ChatMessage } from './ChatMessage';
import { ApiService } from '../services/api';

export const WidgetChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Hi! How can I help?', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (isOpen) {
        messagesEndRef.current?.scrollIntoView();
    }
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input, timestamp: Date.now() };
    setMessages(p => [...p, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await ApiService.sendMessage(messages, input);
      setMessages(p => [...p, { id: Date.now().toString(), role: 'assistant', content: responseText, timestamp: Date.now() }]);
    } catch {
      setMessages(p => [...p, { id: Date.now().toString(), role: 'system', content: "Connection error.", timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  // If we are on the /widget route, we behave like an iframe content
  // But typically a widget is a button that expands. 
  // Here we simulate the Floating Action Button (FAB) behavior.

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end font-sans">
      {isOpen && (
        <div className="w-[350px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 mb-4 animate-fade-in-up transition-all">
          {/* Header */}
          <div className="bg-blue-600 p-4 text-white flex justify-between items-center shadow-md">
            <h3 className="font-bold">Assistant</h3>
            <button onClick={toggleOpen} className="hover:bg-blue-700 p-1 rounded">
              <Minimize2 size={18} />
            </button>
          </div>
          
          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-3 bg-slate-50">
            {messages.map(m => (
                <div key={m.id} className={`mb-2 text-sm ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <span className={`inline-block px-3 py-2 rounded-lg ${
                        m.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 
                        m.role === 'system' ? 'bg-red-100 text-red-800' :
                        'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                    }`}>
                        {m.content}
                    </span>
                </div>
            ))}
            {isLoading && <div className="text-xs text-slate-400 italic ml-2">Typing...</div>}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-slate-100">
            <form onSubmit={handleSend} className="flex gap-2">
              <input 
                className="flex-1 text-sm border border-slate-300 rounded-md px-3 py-2 outline-none focus:border-blue-500"
                placeholder="Ask something..."
                value={input}
                onChange={e => setInput(e.target.value)}
              />
              <button type="submit" className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700" disabled={isLoading}>
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FAB */}
      <button 
        onClick={toggleOpen}
        className={`${isOpen ? 'bg-slate-700' : 'bg-blue-600'} text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
};